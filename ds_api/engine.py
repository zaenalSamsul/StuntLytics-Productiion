from __future__ import annotations

import math
import os
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

import joblib
import numpy as np
import pandas as pd
import requests

from .llm import LLM

ROOT = Path(__file__).resolve().parents[1]
try:
    from dotenv import load_dotenv
    load_dotenv(ROOT / ".env")
    load_dotenv(ROOT / ".env.local")
except Exception:
    pass

MODEL_PATH = ROOT / "models" / "stunting_pipeline.joblib"

FRIENDLY_FACTORS = {
    "Z-Score TB/U": "Height-for-age Z-score",
    "ZScore TB/U": "Height-for-age Z-score",
    "Probabilitas Stunting (simulasi)": "Modelled risk probability",
    "Usia Anak (bulan)": "Child age",
    "Berat Lahir (gram)": "Birth weight",
    "BMI Pra-Hamil": "Pre-pregnancy BMI",
    "Hb (g/dL)": "Maternal haemoglobin",
    "LiLA saat Hamil (cm)": "Maternal MUAC",
    "Kunjungan ANC (x)": "ANC continuity",
    "Jumlah Anak": "Number of children",
    "risk_score": "Composite risk score",
    "is_stunting": "Observed stunting status",
    "bblr": "Low birth weight indicator",
    "jumlah_nakes": "Healthcare workforce",
    "z_score_tb_u": "Height-for-age Z-score",
    "usia_anak_bulan": "Child age",
    "berat_lahir_gram": "Birth weight",
    "bmi_pra_hamil": "Pre-pregnancy BMI",
    "hb_g_dl": "Maternal haemoglobin",
    "lila_saat_hamil_cm": "Maternal MUAC",
    "kunjungan_anc_x": "ANC continuity",
    "tanggungan": "Household dependants",
    "akses_air_layak": "Safe water access",
    "imunisasi_lengkap": "Immunisation continuity",
    "asi_eksklusif": "Exclusive breastfeeding",
    "jamban_sehat": "Improved sanitation",
    "paparan_asap_rokok_bin": "Household smoke exposure",
}


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _sigmoid(value: np.ndarray) -> np.ndarray:
    return 1.0 / (1.0 + np.exp(-value))


def _safe_float(value: Any, default: float = 0.0) -> float:
    try:
        if value is None or pd.isna(value):
            return default
        return float(value)
    except (TypeError, ValueError):
        return default


def _normalise_location(value: Any) -> str:
    return str(value or "").strip().upper()


def build_demo_dataset(n: int = 2600, seed: int = 42) -> pd.DataFrame:
    """Create a deterministic, analytically useful fallback dataset.

    The fallback is intentionally generated from a known risk process so that
    charts, correlations, filters and map layers remain coherent when a live
    Elasticsearch instance is not available. API responses always identify
    this source as a demo dataset.
    """
    rng = np.random.default_rng(seed)

    region_map = {
        "KAB. BANDUNG": ["CICALENGKA", "RANCAEKEK", "MAJALAYA", "SOREANG"],
        "KAB. GARUT": ["TAROGONG KIDUL", "CIBATU", "LELES", "BAYONGBONG"],
        "KAB. INDRAMAYU": ["INDRAMAYU", "JATIBARANG", "HAURGEULIS", "LOSARANG"],
        "KAB. CIANJUR": ["CIANJUR", "CIPANAS", "CIBEBER", "SUKALUYU"],
        "KAB. CIREBON": ["SUMBER", "PLERED", "WERU", "PALIMANAN"],
        "KAB. BOGOR": ["CIBINONG", "CIAWI", "LEUWILIANG", "CILEUNGSI"],
        "KAB. SUKABUMI": ["CISAAT", "CIBADAK", "PALABUHANRATU", "SUKARAJA"],
        "KAB. SUMEDANG": ["CIMANGGUNG", "JATINANGOR", "TANJUNGSARI", "SUMEDANG UTARA"],
        "KOTA BANDUNG": ["ANDIR", "SUKAJADI", "LENGKONG", "COBLONG"],
        "KOTA TASIKMALAYA": ["CIPEDES", "TAWANG", "INDIHIANG", "KAWALU"],
    }
    regions = list(region_map)
    region_probs = np.array([0.13, 0.13, 0.12, 0.11, 0.10, 0.11, 0.08, 0.08, 0.08, 0.06])
    region_probs = region_probs / region_probs.sum()
    kabupaten = rng.choice(regions, n, p=region_probs)
    kecamatan = np.array([rng.choice(region_map[k]) for k in kabupaten])

    dates = pd.to_datetime(rng.choice(pd.date_range("2024-01-01", "2026-06-30", freq="D"), n))
    child_age = rng.integers(0, 60, n)
    birth_weight = np.clip(rng.normal(3050, 520, n), 1500, 4700).round()
    bblr = (birth_weight < 2500).astype(int)
    asi = rng.binomial(1, 0.63, n)
    immun = rng.binomial(1, 0.72, n)
    water = rng.binomial(1, 0.81, n)
    sanitation = rng.binomial(1, 0.75, n)
    smoke = rng.binomial(1, 0.31, n)

    education_levels = np.array(["Tidak Sekolah", "SD", "SMP", "SMA", "Diploma", "S1", "S2/S3"])
    education = rng.choice(education_levels, n, p=[0.02, 0.20, 0.25, 0.34, 0.08, 0.10, 0.01])
    edu_risk = pd.Series(education).map({
        "Tidak Sekolah": 1.0, "SD": 0.8, "SMP": 0.55, "SMA": 0.3,
        "Diploma": 0.15, "S1": 0.08, "S2/S3": 0.04,
    }).to_numpy()

    maternal_height = np.clip(rng.normal(155.5, 6.5, n), 135, 180)
    muac = np.clip(rng.normal(25.0, 3.2, n), 16, 38)
    bmi = np.clip(rng.normal(22.3, 3.8, n), 13, 39)
    hb = np.clip(rng.normal(11.4, 1.35, n), 6.5, 16.5)
    gest_gain = np.clip(rng.normal(11.2, 4.1, n), 0, 28)
    maternal_age = rng.integers(16, 46, n)
    birth_spacing = rng.integers(0, 97, n)
    anc = np.clip(rng.poisson(5.2, n), 0, 16)
    dependants = rng.integers(0, 7, n)

    region_effect = pd.Series(kabupaten).map({
        "KAB. INDRAMAYU": 0.38,
        "KAB. GARUT": 0.31,
        "KAB. CIANJUR": 0.26,
        "KAB. CIREBON": 0.21,
        "KAB. SUKABUMI": 0.18,
        "KAB. BANDUNG": 0.10,
        "KOTA TASIKMALAYA": 0.08,
        "KAB. BOGOR": 0.04,
        "KAB. SUMEDANG": -0.02,
        "KOTA BANDUNG": -0.10,
    }).to_numpy()

    logit = (
        -3.05
        + 1.18 * bblr
        + 0.54 * (1 - asi)
        + 0.49 * (1 - immun)
        + 0.70 * (1 - water)
        + 0.58 * (1 - sanitation)
        + 0.38 * smoke
        + 0.46 * edu_risk
        + 0.52 * (muac < 23.5)
        + 0.42 * (hb < 11.0)
        + 0.35 * (bmi < 18.5)
        + 0.28 * (anc < 4)
        + 0.25 * ((maternal_age < 20) | (maternal_age > 35))
        + 0.22 * ((birth_spacing > 0) & (birth_spacing < 24))
        + 0.18 * (child_age / 60)
        + region_effect
    )
    probability = _sigmoid(logit)
    is_stunting = rng.binomial(1, np.clip(probability, 0.02, 0.88))
    z_score = np.clip(rng.normal(-0.72 - 1.7 * probability - 0.55 * is_stunting, 0.72, n), -5.5, 2.5)
    risk_score = np.clip(probability, 0, 1)
    risk_label = pd.cut(risk_score, [-0.001, 0.33, 0.66, 1.0], labels=["Rendah", "Sedang", "Tinggi"]).astype(str)

    nakes_by_region = {
        "KAB. BANDUNG": 468, "KAB. GARUT": 392, "KAB. INDRAMAYU": 286,
        "KAB. CIANJUR": 318, "KAB. CIREBON": 302, "KAB. BOGOR": 522,
        "KAB. SUKABUMI": 331, "KAB. SUMEDANG": 265, "KOTA BANDUNG": 611,
        "KOTA TASIKMALAYA": 238,
    }
    nakes = pd.Series(kabupaten).map(nakes_by_region).to_numpy()

    df = pd.DataFrame({
        "tanggal": dates,
        "kabupaten": kabupaten,
        "kecamatan": kecamatan,
        "usia_anak_bulan": child_age,
        "berat_lahir_gram": birth_weight,
        "bblr": bblr,
        "asi_eksklusif": asi,
        "imunisasi_lengkap": immun,
        "akses_air_layak": water,
        "jamban_sehat": sanitation,
        "pendidikan_ibu": education,
        "pengeluaran_bulan": np.clip(rng.normal(3_400_000, 1_150_000, n), 650_000, 11_000_000).round(),
        "tanggungan": dependants,
        "jumlah_nakes": nakes,
        "tinggi_badan_ibu_cm": maternal_height.round(1),
        "lila_saat_hamil_cm": muac.round(1),
        "bmi_pra_hamil": bmi.round(1),
        "hb_g_dl": hb.round(1),
        "kenaikan_bb_hamil_kg": gest_gain.round(1),
        "usia_ibu_saat_hamil_tahun": maternal_age,
        "jarak_kehamilan_sebelumnya_bulan": birth_spacing,
        "kunjungan_anc_x": anc,
        "paparan_asap_rokok_bin": smoke,
        "is_stunting": is_stunting,
        "z_score_tb_u": z_score.round(2),
        "risk_score": risk_score.round(4),
        "risk_label": risk_label,
    })
    return df.sort_values("tanggal").reset_index(drop=True)


@dataclass
class SourceInfo:
    mode: str
    label: str
    live: bool
    detail: str

    def to_dict(self) -> Dict[str, Any]:
        return {
            "mode": self.mode,
            "label": self.label,
            "live": self.live,
            "detail": self.detail,
            "generatedAt": utc_now_iso(),
        }


class DataScienceEngine:
    def __init__(self) -> None:
        self.mode = os.getenv("DS_DATA_MODE", "auto").strip().lower()
        self._demo_df: Optional[pd.DataFrame] = None
        self._model: Any = None
        self._model_error: Optional[str] = None
        self._source_cache: tuple[float, SourceInfo] | None = None

    @property
    def demo_df(self) -> pd.DataFrame:
        if self._demo_df is None:
            self._demo_df = build_demo_dataset()
        return self._demo_df

    def _elastic_module(self):
        try:
            from src import elastic_client as es
            return es
        except Exception:
            return None

    def source_info(self) -> SourceInfo:
        if self.mode == "demo":
            return SourceInfo("demo", "Deterministic analytical demo", False, "Generated fallback dataset; no live registry connection")

        now = time.time()
        if self._source_cache and now - self._source_cache[0] < 15:
            return self._source_cache[1]

        es = self._elastic_module()
        if es is not None:
            try:
                ok, detail = es.ping()
                if ok:
                    info = SourceInfo("elasticsearch", "Elasticsearch live", True, detail)
                    self._source_cache = (now, info)
                    return info
                if self.mode == "elasticsearch":
                    info = SourceInfo("elasticsearch_unavailable", "Elasticsearch unavailable", False, detail)
                    self._source_cache = (now, info)
                    return info
            except Exception as exc:
                if self.mode == "elasticsearch":
                    info = SourceInfo("elasticsearch_unavailable", "Elasticsearch unavailable", False, str(exc))
                    self._source_cache = (now, info)
                    return info

        info = SourceInfo("demo", "Deterministic analytical demo", False, "Automatic fallback because live Elasticsearch is unavailable")
        self._source_cache = (now, info)
        return info

    @staticmethod
    def parse_filters(
        date_from: Optional[str] = None,
        date_to: Optional[str] = None,
        wilayah: Optional[str] = None,
        kecamatan: Optional[str] = None,
        risk_level: Optional[str] = None,
    ) -> Dict[str, Any]:
        def split_csv(value: Optional[str]) -> List[str]:
            return [item.strip() for item in (value or "").split(",") if item.strip()]

        return {
            "date_from": date_from,
            "date_to": date_to,
            "wilayah": split_csv(wilayah),
            "kecamatan": split_csv(kecamatan),
            "risk_level": split_csv(risk_level),
        }

    def _filter_demo(self, filters: Dict[str, Any]) -> pd.DataFrame:
        df = self.demo_df.copy()
        if filters.get("date_from"):
            df = df[df["tanggal"] >= pd.to_datetime(filters["date_from"], errors="coerce")]
        if filters.get("date_to"):
            df = df[df["tanggal"] <= pd.to_datetime(filters["date_to"], errors="coerce")]
        if filters.get("wilayah"):
            allowed = {_normalise_location(v) for v in filters["wilayah"]}
            df = df[df["kabupaten"].map(_normalise_location).isin(allowed)]
        if filters.get("kecamatan"):
            allowed = {_normalise_location(v) for v in filters["kecamatan"]}
            df = df[df["kecamatan"].map(_normalise_location).isin(allowed)]
        if filters.get("risk_level"):
            labels = {str(v).lower() for v in filters["risk_level"]}
            mapping = {
                "low": "rendah", "stable": "rendah", "rendah": "rendah",
                "medium": "sedang", "monitoring": "sedang", "sedang": "sedang",
                "high": "tinggi", "critical": "tinggi", "attention": "tinggi", "tinggi": "tinggi",
            }
            wanted = {mapping.get(v, v) for v in labels}
            df = df[df["risk_label"].str.lower().isin(wanted)]
        return df

    def _live_filters(self, filters: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "date_from": filters.get("date_from"),
            "date_to": filters.get("date_to"),
            "wilayah": filters.get("wilayah", []),
            "kecamatan": filters.get("kecamatan", []),
            "risk_level": filters.get("risk_level", []),
        }

    @staticmethod
    def _risk_level(prevalence: float) -> str:
        if prevalence >= 30:
            return "critical"
        if prevalence >= 20:
            return "attention"
        if prevalence >= 12:
            return "monitoring"
        return "stable"

    def data_status(self) -> Dict[str, Any]:
        source = self.source_info()
        indices = {
            "stunting": os.getenv("STUNTING_INDEX", "stunting-data"),
            "nutritionWorkforce": os.getenv("NUTRITION_INDEX", "jabar-tenaga-gizi"),
            "villageChildren": os.getenv("VILLAGE_CHILD_INDEX", "jabar-balita-desa"),
            "modelSample": os.getenv("MODEL_SAMPLE_INDEX", "stunting-model-sample"),
        }
        payload: Dict[str, Any] = {"source": source.to_dict(), "indices": {}}
        es_url = os.getenv("ES_URL", "http://localhost:9200").rstrip("/")
        for label, index_name in indices.items():
            try:
                response = requests.get(f"{es_url}/{index_name}/_count", timeout=8)
                if response.status_code == 200:
                    payload["indices"][label] = {
                        "index": index_name,
                        "available": True,
                        "documents": int(response.json().get("count", 0)),
                    }
                else:
                    payload["indices"][label] = {
                        "index": index_name,
                        "available": False,
                        "documents": 0,
                        "status": response.status_code,
                    }
            except Exception as exc:
                payload["indices"][label] = {
                    "index": index_name,
                    "available": False,
                    "documents": 0,
                    "error": str(exc),
                }
        return payload

    def dashboard_summary(self, filters: Dict[str, Any]) -> Dict[str, Any]:
        source = self.source_info()
        if source.mode == "elasticsearch":
            try:
                return self._dashboard_live(filters, source)
            except Exception as exc:
                if self.mode == "elasticsearch":
                    raise
                source = SourceInfo("demo", "Deterministic analytical demo", False, f"Live query failed; fallback active: {exc}")
        return self._dashboard_demo(filters, source)

    def _dashboard_demo(self, filters: Dict[str, Any], source: SourceInfo) -> Dict[str, Any]:
        df = self._filter_demo(filters)
        total = int(len(df))
        stunted = int(df["is_stunting"].sum()) if total else 0
        prevalence = (stunted / total * 100) if total else 0.0
        nakes = int(df.groupby("kabupaten")["jumlah_nakes"].first().sum()) if total else 0
        immun = float(df["imunisasi_lengkap"].mean() * 100) if total else 0.0
        water = float(df["akses_air_layak"].mean() * 100) if total else 0.0

        monthly = (
            df.set_index("tanggal")
            .resample("MS")
            .agg(total=("is_stunting", "size"), stunting=("is_stunting", "sum"), coverage=("imunisasi_lengkap", "mean"))
            .reset_index()
        )
        monthly["prevalence"] = np.where(monthly["total"] > 0, monthly["stunting"] / monthly["total"] * 100, 0)
        trend = [
            {
                "month": row.tanggal.strftime("%Y-%m"),
                "prevalence": round(float(row.prevalence), 2),
                "coverage": round(float(row.coverage * 100), 2),
            }
            for row in monthly.itertuples()
        ][-12:]

        workforce_series = df.groupby("kabupaten")["jumlah_nakes"].first().sort_values(ascending=False).head(10)
        workforce = [{"region": idx, "value": int(value)} for idx, value in workforce_series.items()]
        water_distribution = [
            {"label": "Layak", "value": int(df["akses_air_layak"].sum())},
            {"label": "Tidak Layak", "value": int(total - df["akses_air_layak"].sum())},
        ]

        risk_map = self._risk_map_demo(filters)
        counts = {"stable": 0, "monitoring": 0, "attention": 0, "critical": 0}
        for row in risk_map:
            counts[row["riskLevel"]] += 1
        risk_distribution = [{"name": k.title(), "value": v} for k, v in counts.items()]
        top_regions = sorted(risk_map, key=lambda item: item["prevalensi"], reverse=True)[:6]

        return {
            "source": source.to_dict(),
            "metrics": {
                "totalChildren": total,
                "totalStunting": stunted,
                "prevalence": round(prevalence, 2),
                "totalNakes": nakes,
                "imunisasiCoverage": round(immun, 2),
                "airLayakCoverage": round(water, 2),
            },
            "trend": trend,
            "workforce": workforce,
            "waterDistribution": water_distribution,
            "riskDistribution": risk_distribution,
            "topRegions": top_regions,
        }

    def _dashboard_live(self, filters: Dict[str, Any], source: SourceInfo) -> Dict[str, Any]:
        es = self._elastic_module()
        if es is None:
            raise RuntimeError("Elasticsearch analytics module unavailable")
        live_filters = self._live_filters(filters)
        summary = es.get_main_page_summary(live_filters)
        kpi = summary["kpi"]
        charts = summary["charts"]

        total = int(kpi.get("total_bayi_lahir", 0))
        stunted = int(kpi.get("total_bayi_stunting", 0))
        prevalence = stunted / total * 100 if total else 0.0

        trend: List[Dict[str, Any]] = []
        try:
            trend_df = es.get_monthly_trend(live_filters)
            if not trend_df.empty:
                for idx, row in trend_df.reset_index().iterrows():
                    trend.append({"month": str(row.iloc[0]), "prevalence": round(_safe_float(row.get("Stunting %")), 2), "coverage": None})
        except Exception:
            pass
        if not trend:
            imun_df = charts.get("imunisasi_trend", pd.DataFrame())
            if isinstance(imun_df, pd.DataFrame) and not imun_df.empty:
                trend = [
                    {"month": pd.to_datetime(r["tanggal"]).strftime("%Y-%m"), "prevalence": None, "coverage": round(_safe_float(r["imunisasi_lengkap"]) * 100, 2)}
                    for _, r in imun_df.iterrows()
                ]

        nakes_series = charts.get("nakes_by_region", pd.Series(dtype=float))
        workforce = [{"region": str(idx), "value": round(_safe_float(value), 2)} for idx, value in nakes_series.items()]
        water_series = charts.get("air_distribusi", pd.Series(dtype=float))
        water_distribution = [{"label": str(idx), "value": int(_safe_float(value))} for idx, value in water_series.items()]

        risk_map = self.risk_map(filters)
        counts = {"stable": 0, "monitoring": 0, "attention": 0, "critical": 0}
        for row in risk_map:
            counts[row["riskLevel"]] = counts.get(row["riskLevel"], 0) + 1

        return {
            "source": source.to_dict(),
            "metrics": {
                "totalChildren": total,
                "totalStunting": stunted,
                "prevalence": round(prevalence, 2),
                "totalNakes": round(_safe_float(kpi.get("jumlah_nakes")), 2),
                "imunisasiCoverage": round(_safe_float(kpi.get("cakupan_imunisasi_pct")), 2),
                "airLayakCoverage": round(_safe_float(kpi.get("akses_air_layak_pct")), 2),
            },
            "trend": trend[-12:],
            "workforce": workforce[:10],
            "waterDistribution": water_distribution,
            "riskDistribution": [{"name": k.title(), "value": v} for k, v in counts.items()],
            "topRegions": sorted(risk_map, key=lambda item: item["prevalensi"], reverse=True)[:6],
        }

    def risk_map(self, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        source = self.source_info()
        if source.mode == "elasticsearch":
            try:
                es = self._elastic_module()
                df = es.get_risk_map_data(self._live_filters(filters))
                rows: List[Dict[str, Any]] = []
                for _, row in df.iterrows():
                    total = int(_safe_float(row.get("total_anak")))
                    stunting = int(_safe_float(row.get("jumlah_stunting")))
                    prevalence = stunting / total * 100 if total else 0.0
                    rows.append({
                        "kecamatan": str(row.get("kecamatan", "")),
                        "kabupaten": str(row.get("kabupaten", "")),
                        "jumlahStunting": stunting,
                        "totalAnak": total,
                        "prevalensi": round(prevalence, 2),
                        "riskLevel": self._risk_level(prevalence),
                        "source": "elasticsearch",
                    })
                return rows
            except Exception:
                if self.mode == "elasticsearch":
                    raise
        return self._risk_map_demo(filters)

    def _risk_map_demo(self, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        df = self._filter_demo(filters)
        grouped = df.groupby(["kabupaten", "kecamatan"], dropna=False).agg(totalAnak=("is_stunting", "size"), jumlahStunting=("is_stunting", "sum")).reset_index()
        rows: List[Dict[str, Any]] = []
        for row in grouped.itertuples():
            prevalence = row.jumlahStunting / row.totalAnak * 100 if row.totalAnak else 0.0
            rows.append({
                "kecamatan": str(row.kecamatan),
                "kabupaten": str(row.kabupaten),
                "jumlahStunting": int(row.jumlahStunting),
                "totalAnak": int(row.totalAnak),
                "prevalensi": round(float(prevalence), 2),
                "riskLevel": self._risk_level(float(prevalence)),
                "source": "demo",
            })
        return rows

    def filter_options(self, field: str, filters: Dict[str, Any]) -> List[str]:
        aliases = {"wilayah": "kabupaten", "kabupaten": "kabupaten", "kecamatan": "kecamatan", "risk": "risk_label"}
        key = aliases.get(field.lower(), field)
        source = self.source_info()
        if source.mode == "elasticsearch" and key in {"kabupaten", "kecamatan"}:
            try:
                es = self._elastic_module()
                candidates = es.CANDIDATES_WILAYAH if key == "kabupaten" else es.CANDIDATES_KECAMATAN
                _, values = es.get_filter_options(self._live_filters(filters), candidates)
                return values
            except Exception:
                if self.mode == "elasticsearch":
                    raise
        df = self._filter_demo(filters)
        if key not in df.columns:
            return []
        return sorted(str(value) for value in df[key].dropna().unique())

    def explorer(
        self,
        filters: Dict[str, Any],
        pendidikan_ibu: Optional[str] = None,
        asi_eksklusif: Optional[str] = None,
        akses_air: Optional[str] = None,
        limit: int = 250,
    ) -> Dict[str, Any]:
        source = self.source_info()
        advanced = {
            "pendidikan_ibu": [v.strip() for v in (pendidikan_ibu or "").split(",") if v.strip()],
            "asi_eksklusif": asi_eksklusif or "Semua",
            "akses_air": akses_air or "Semua",
        }
        if source.mode == "elasticsearch":
            try:
                es = self._elastic_module()
                df = es.get_explorer_data(self._live_filters(filters), advanced, size=min(limit, 1000))
                chart_df = es.get_top_counts_for_explorer_chart(self._live_filters(filters), advanced)
                return {
                    "source": source.to_dict(),
                    "records": self._records_json(df),
                    "count": int(len(df)),
                    "topCounts": self._records_json(chart_df),
                }
            except Exception:
                if self.mode == "elasticsearch":
                    raise
                source = SourceInfo("demo", "Deterministic analytical demo", False, "Live explorer query failed; fallback active")

        df = self._filter_demo(filters)
        if advanced["pendidikan_ibu"]:
            df = df[df["pendidikan_ibu"].isin(advanced["pendidikan_ibu"])]
        if advanced["asi_eksklusif"] not in {"Semua", ""}:
            target = 1 if advanced["asi_eksklusif"].lower() in {"ya", "yes", "1", "true"} else 0
            df = df[df["asi_eksklusif"] == target]
        if advanced["akses_air"] not in {"Semua", ""}:
            target = 1 if advanced["akses_air"].lower() in {"ada", "ya", "layak", "yes", "1", "true"} else 0
            df = df[df["akses_air_layak"] == target]

        view = df.sort_values("z_score_tb_u").head(min(limit, 1000)).copy()
        records = pd.DataFrame({
            "Tanggal": view["tanggal"].dt.strftime("%Y-%m-%d"),
            "Kabupaten/Kota": view["kabupaten"],
            "Kecamatan": view["kecamatan"],
            "Status Stunting": np.where(view["is_stunting"] == 1, "Stunting", "Tidak"),
            "Z-Score": view["z_score_tb_u"],
            "Usia Anak (bulan)": view["usia_anak_bulan"],
            "Berat Lahir (gram)": view["berat_lahir_gram"],
            "ASI Eksklusif": np.where(view["asi_eksklusif"] == 1, "Ya", "Tidak"),
            "Imunisasi": np.where(view["imunisasi_lengkap"] == 1, "Lengkap", "Tidak Lengkap"),
            "Pendidikan Ibu": view["pendidikan_ibu"],
            "Akses Air Bersih": np.where(view["akses_air_layak"] == 1, "Layak", "Tidak Layak"),
            "Risk Score": view["risk_score"],
        })
        top = df.groupby("kabupaten").size().sort_values(ascending=False).head(5)
        return {
            "source": source.to_dict(),
            "records": self._records_json(records),
            "count": int(len(df)),
            "topCounts": [{"Kabupaten/Kota": str(idx), "Jumlah Data": int(value)} for idx, value in top.items()],
        }

    def correlation(self, filters: Dict[str, Any]) -> Dict[str, Any]:
        source = self.source_info()
        if source.mode == "elasticsearch":
            try:
                es = self._elastic_module()
                sample = es.get_numeric_sample_for_corr(self._live_filters(filters), size=5000)
                target = next((c for c in ["Z-Score TB/U", "ZScore TB/U", "Probabilitas Stunting (simulasi)", "risk_score"] if c in sample.columns), None)
                trend_df = es.get_monthly_trend(self._live_filters(filters))
                return self._correlation_payload(sample, target, trend_df, source)
            except Exception:
                if self.mode == "elasticsearch":
                    raise
                source = SourceInfo("demo", "Deterministic analytical demo", False, "Live correlation query failed; fallback active")

        df = self._filter_demo(filters)
        numeric = df.select_dtypes(include=["number"]).copy()
        monthly = (
            df.set_index("tanggal").resample("MS")["is_stunting"].mean().mul(100).reset_index(name="Stunting %")
        )
        monthly["Bulan"] = monthly["tanggal"].dt.strftime("%Y-%m")
        return self._correlation_payload(numeric, "z_score_tb_u", monthly[["Bulan", "Stunting %"]], source)

    def _correlation_payload(self, sample: pd.DataFrame, target: Optional[str], trend_df: pd.DataFrame, source: SourceInfo) -> Dict[str, Any]:
        factors: List[Dict[str, Any]] = []
        if target and target in sample.columns and sample.shape[1] > 1:
            corr = sample.corr(numeric_only=True)
            if target in corr.columns:
                values = corr[target].drop(target, errors="ignore").dropna()
                for name, value in values.abs().nlargest(10).items():
                    actual = float(values.loc[name])
                    factors.append({
                        "factor": FRIENDLY_FACTORS.get(str(name), str(name).replace("_", " ").title()),
                        "field": str(name),
                        "coefficient": round(actual, 4),
                        "magnitude": round(abs(actual), 4),
                        "direction": "positive" if actual > 0 else "negative",
                    })
        trend: List[Dict[str, Any]] = []
        if isinstance(trend_df, pd.DataFrame) and not trend_df.empty:
            for _, row in trend_df.iterrows():
                month = row.get("Bulan", row.iloc[0] if len(row) else "")
                value = row.get("Stunting %", row.iloc[-1] if len(row) else 0)
                trend.append({"month": str(month), "prevalence": round(_safe_float(value), 2)})
        return {
            "source": source.to_dict(),
            "target": FRIENDLY_FACTORS.get(str(target), str(target or "Unavailable")),
            "sampleSize": int(len(sample)),
            "factors": factors,
            "trend": trend[-18:],
            "method": "Pearson correlation on numeric sample",
            "guardrail": "Association does not establish causation. Review data quality and domain context before action.",
        }

    @staticmethod
    def _records_json(df: pd.DataFrame) -> List[Dict[str, Any]]:
        if df is None or df.empty:
            return []
        safe = df.copy()
        for col in safe.columns:
            if pd.api.types.is_datetime64_any_dtype(safe[col]):
                safe[col] = safe[col].dt.strftime("%Y-%m-%d")
        safe = safe.replace({np.nan: None, np.inf: None, -np.inf: None})
        return safe.to_dict(orient="records")

    def model_status(self) -> Dict[str, Any]:
        status = {
            "available": MODEL_PATH.exists(),
            "loaded": self._model is not None,
            "path": str(MODEL_PATH.relative_to(ROOT)) if MODEL_PATH.exists() else str(MODEL_PATH),
            "sizeMb": round(MODEL_PATH.stat().st_size / 1024 / 1024, 2) if MODEL_PATH.exists() else 0,
            "engine": "scikit-learn serialized Pipeline",
            "requiredSklearn": "1.6.1",
            "error": self._model_error,
        }
        return status

    def load_model(self):
        if self._model is not None:
            return self._model
        if self._model_error is not None:
            raise RuntimeError(self._model_error)
        if not MODEL_PATH.exists():
            self._model_error = f"Model file not found: {MODEL_PATH}"
            raise RuntimeError(self._model_error)
        try:
            self._model = joblib.load(MODEL_PATH)
            return self._model
        except Exception as exc:
            self._model_error = (
                f"Unable to load bundled pipeline: {exc}. "
                "Install the pinned Python requirements (scikit-learn==1.6.1)."
            )
            raise RuntimeError(self._model_error) from exc

    def predict(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        model = self.load_model()
        input_df = pd.DataFrame([payload])
        probability = float(model.predict_proba(input_df)[0][1])
        result = "Risiko Stunting" if probability > 0.5 else "Risiko Rendah"
        factors = self._prediction_context_factors(payload)
        recommendations = self._recommendations_from_factors(factors)
        return {
            "probability": round(probability * 100, 2),
            "result": result,
            "decisionThreshold": 50,
            "riskBand": "high" if probability >= 0.5 else ("monitoring" if probability >= 0.3 else "low"),
            "engine": "local_sklearn_pipeline",
            "model": self.model_status(),
            "contextFactors": factors[:6],
            "followUpConsiderations": recommendations,
            "guardrail": "Screening support only. This output is not a diagnosis and should be verified by qualified health professionals using clinical and field context.",
        }

    @staticmethod
    def _prediction_context_factors(data: Dict[str, Any]) -> List[Dict[str, Any]]:
        factors: List[Dict[str, Any]] = []

        def add(label: str, reason: str, severity: str = "attention") -> None:
            factors.append({"label": label, "reason": reason, "severity": severity})

        if _safe_float(data.get("tinggi_badan_ibu_cm"), 999) < 150:
            add("Maternal height", "Height below 150 cm deserves nutritional and obstetric context review.")
        if _safe_float(data.get("lila_saat_hamil_cm"), 999) < 23.5:
            add("Maternal MUAC", "MUAC below 23.5 cm indicates a need to review maternal nutritional status.", "high")
        bmi = _safe_float(data.get("bmi_pra_hamil"), 22)
        if bmi < 18.5:
            add("Pre-pregnancy BMI", "BMI is below the normal adult range and merits nutrition follow-up.", "high")
        elif bmi >= 30:
            add("Pre-pregnancy BMI", "Higher BMI can require individualized antenatal risk review.")
        if _safe_float(data.get("hb_g_dl"), 99) < 11:
            add("Maternal haemoglobin", "Haemoglobin below 11 g/dL warrants anaemia-related review.", "high")
        if _safe_float(data.get("kunjungan_anc_x"), 99) < 4:
            add("ANC continuity", "Recorded ANC contacts are limited; verify continuity and missed follow-up.")
        spacing = _safe_float(data.get("jarak_kehamilan_sebelumnya_bulan"), 99)
        if 0 < spacing < 24:
            add("Birth spacing", "Short interpregnancy interval merits contextual review.")
        age = _safe_float(data.get("usia_ibu_saat_hamil_tahun"), 28)
        if age < 20 or age > 35:
            add("Maternal age", "Age falls outside the central adult pregnancy range and may need closer review.")
        if str(data.get("kepatuhan_ttd", "")).lower() != "rutin":
            add("Iron-folic supplementation", "Recorded tablet adherence is not routine.")
        if str(data.get("akses_air_bersih", "")).lower() != "ya":
            add("Safe water access", "Household reports no adequate clean-water access.", "high")
        if str(data.get("paparan_asap_rokok", "")).lower() == "ya":
            add("Household smoke exposure", "Reported household smoke exposure warrants prevention counselling.")
        if int(_safe_float(data.get("hipertensi_ibu"), 0)) == 1:
            add("Maternal hypertension", "Reported hypertension requires clinician-led antenatal management.", "high")
        if int(_safe_float(data.get("diabetes_ibu"), 0)) == 1:
            add("Maternal diabetes", "Reported diabetes requires clinician-led antenatal management.", "high")
        if not factors:
            add("No prominent rule-based context flag", "The submitted fields did not trigger the transparent context checks.", "stable")
        priority = {"high": 0, "attention": 1, "stable": 2}
        return sorted(factors, key=lambda item: priority.get(item["severity"], 9))

    @staticmethod
    def _recommendations_from_factors(factors: List[Dict[str, Any]]) -> List[str]:
        labels = {item["label"] for item in factors}
        recs: List[str] = []
        if labels & {"Maternal MUAC", "Pre-pregnancy BMI", "Maternal haemoglobin", "Iron-folic supplementation"}:
            recs.append("Review maternal nutrition, haemoglobin status, and supplementation continuity with the antenatal care team.")
        if labels & {"Safe water access", "Household smoke exposure"}:
            recs.append("Verify household environmental risks and connect eligible families to WASH or smoke-exposure prevention support.")
        if labels & {"ANC continuity", "Maternal hypertension", "Maternal diabetes", "Maternal age", "Birth spacing"}:
            recs.append("Prioritize clinician-led antenatal review and confirm continuity of scheduled follow-up.")
        if not recs:
            recs.append("Continue routine growth-prevention counselling and verify the record against current clinical information.")
        recs.append("Use the model probability as a screening signal only; document professional review before intervention decisions.")
        return recs[:4]

    def evidence_insight(self, question: str, filters: Dict[str, Any]) -> Dict[str, Any]:
        summary = self.dashboard_summary(filters)
        corr = self.correlation(filters)
        metrics = summary["metrics"]
        top_regions = summary.get("topRegions", [])[:3]
        top_factors = corr.get("factors", [])[:3]

        region_text = ", ".join(f"{r['kecamatan']} ({r['prevalensi']:.1f}%)" for r in top_regions) or "no regional ranking available"
        factor_text = ", ".join(f"{f['factor']} ({f['coefficient']:+.2f})" for f in top_factors) or "insufficient numeric correlation sample"

        answer = (
            f"### Evidence snapshot\n"
            f"- **Observed records:** {metrics['totalChildren']:,}\n"
            f"- **Stunting signal:** {metrics['prevalence']:.1f}% ({metrics['totalStunting']:,} records)\n"
            f"- **Immunisation continuity:** {metrics['imunisasiCoverage']:.1f}%\n"
            f"- **Safe-water coverage:** {metrics['airLayakCoverage']:.1f}%\n\n"
            f"### Priority review\n"
            f"Highest current district signals in this filtered workspace: **{region_text}**.\n\n"
            f"### Factor context\n"
            f"Strongest numeric associations in the available sample: **{factor_text}**. These are associations, not causal effects.\n\n"
            f"### Suggested next step\n"
            f"Use the map and explorer to verify record completeness, then assign follow-up only after program or clinical review.\n\n"
            f"_Question received: {question.strip() or 'general evidence review'}_"
        )

        # Optional free-tier Gemini narrative. Deterministic evidence remains
        # the source of truth and fallback when no key/quota is available.
        llm_result = LLM.generate(question=question, evidence_markdown=answer)
        if llm_result.text:
            answer = llm_result.text

        mode = llm_result.mode

        return {
            "answer": answer,
            "mode": mode,
            "source": summary["source"],
            "question": question,
            "guardrail": "Decision support only; validate data quality and review with qualified professionals.",
            "llm": LLM.status(),
            "llmError": llm_result.error,
        }


ENGINE = DataScienceEngine()
