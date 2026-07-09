from __future__ import annotations

from typing import Any, Dict, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .engine import ENGINE
from .llm import LLM

app = FastAPI(
    title="StuntLytics Data Science API",
    version="1.0.0",
    description="Analytics and local ML inference service for the StuntLytics workspace.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class FamilyPredictionInput(BaseModel):
    tinggi_badan_ibu_cm: float = Field(ge=130, le=200)
    lila_saat_hamil_cm: float = Field(ge=15, le=40)
    bmi_pra_hamil: float = Field(ge=10, le=40)
    hb_g_dl: float = Field(ge=5, le=20)
    kenaikan_bb_hamil_kg: float = Field(ge=0, le=30)
    usia_ibu_saat_hamil_tahun: int = Field(ge=15, le=50)
    jarak_kehamilan_sebelumnya_bulan: int = Field(ge=0, le=120)
    kunjungan_anc_x: int = Field(ge=0, le=20)
    jumlah_anak: int = Field(ge=0, le=15)
    kepatuhan_ttd: str
    pendidikan_ibu: str
    jenis_pekerjaan_orang_tua: str
    status_pernikahan: str
    kepesertaan_program_bantuan: str
    akses_air_bersih: str
    paparan_asap_rokok: str
    hipertensi_ibu: int = Field(ge=0, le=1)
    diabetes_ibu: int = Field(ge=0, le=1)


class InsightRequest(BaseModel):
    question: str = Field(min_length=1, max_length=2000)
    filters: Dict[str, Any] = Field(default_factory=dict)


def filters_from_query(
    date_from: Optional[str],
    date_to: Optional[str],
    wilayah: Optional[str],
    kecamatan: Optional[str],
    risk_level: Optional[str],
) -> Dict[str, Any]:
    return ENGINE.parse_filters(date_from, date_to, wilayah, kecamatan, risk_level)


@app.get("/")
def root() -> Dict[str, Any]:
    return {"service": "StuntLytics Data Science API", "status": "ok", "docs": "/docs"}


@app.get("/health")
def health() -> Dict[str, Any]:
    return {
        "status": "ok",
        "source": ENGINE.source_info().to_dict(),
        "model": ENGINE.model_status(),
        "llm": LLM.status(),
    }


@app.get("/model/status")
def model_status() -> Dict[str, Any]:
    return ENGINE.model_status()


@app.get("/data/status")
def data_status() -> Dict[str, Any]:
    return ENGINE.data_status()


@app.get("/llm/status")
def llm_status() -> Dict[str, Any]:
    return LLM.status()


@app.get("/dashboard/summary")
def dashboard_summary(
    dateFrom: Optional[str] = None,
    dateTo: Optional[str] = None,
    wilayah: Optional[str] = None,
    kecamatan: Optional[str] = None,
    riskLevel: Optional[str] = None,
) -> Dict[str, Any]:
    try:
        return ENGINE.dashboard_summary(filters_from_query(dateFrom, dateTo, wilayah, kecamatan, riskLevel))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.get("/dashboard/risk-map")
def risk_map(
    dateFrom: Optional[str] = None,
    dateTo: Optional[str] = None,
    wilayah: Optional[str] = None,
    kecamatan: Optional[str] = None,
    riskLevel: Optional[str] = None,
):
    try:
        return ENGINE.risk_map(filters_from_query(dateFrom, dateTo, wilayah, kecamatan, riskLevel))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.get("/dashboard/chart/{chart_type}")
def chart_data(
    chart_type: str,
    dateFrom: Optional[str] = None,
    dateTo: Optional[str] = None,
    wilayah: Optional[str] = None,
    kecamatan: Optional[str] = None,
    riskLevel: Optional[str] = None,
):
    summary = ENGINE.dashboard_summary(filters_from_query(dateFrom, dateTo, wilayah, kecamatan, riskLevel))
    mapping = {
        "trend": summary.get("trend", []),
        "workforce": summary.get("workforce", []),
        "water": summary.get("waterDistribution", []),
        "risk-distribution": summary.get("riskDistribution", []),
        "top-regions": summary.get("topRegions", []),
    }
    if chart_type not in mapping:
        raise HTTPException(status_code=404, detail=f"Unknown chart type: {chart_type}")
    return mapping[chart_type]


@app.get("/filters/options/{field}")
def filter_options(
    field: str,
    wilayah: Optional[str] = None,
    kecamatan: Optional[str] = None,
):
    return ENGINE.filter_options(field, ENGINE.parse_filters(wilayah=wilayah, kecamatan=kecamatan))


@app.get("/explorer")
def explorer(
    dateFrom: Optional[str] = None,
    dateTo: Optional[str] = None,
    wilayah: Optional[str] = None,
    kecamatan: Optional[str] = None,
    riskLevel: Optional[str] = None,
    pendidikanIbu: Optional[str] = None,
    asiEksklusif: Optional[str] = None,
    aksesAir: Optional[str] = None,
    limit: int = Query(default=250, ge=1, le=1000),
):
    try:
        return ENGINE.explorer(
            filters_from_query(dateFrom, dateTo, wilayah, kecamatan, riskLevel),
            pendidikan_ibu=pendidikanIbu,
            asi_eksklusif=asiEksklusif,
            akses_air=aksesAir,
            limit=limit,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.get("/analysis/correlation")
def correlation(
    dateFrom: Optional[str] = None,
    dateTo: Optional[str] = None,
    wilayah: Optional[str] = None,
    kecamatan: Optional[str] = None,
    riskLevel: Optional[str] = None,
):
    try:
        return ENGINE.correlation(filters_from_query(dateFrom, dateTo, wilayah, kecamatan, riskLevel))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/prediction/family")
def family_prediction(payload: FamilyPredictionInput):
    try:
        return ENGINE.predict(payload.model_dump())
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}") from exc


@app.post("/ai/insights")
def insights(payload: InsightRequest):
    try:
        filters = ENGINE.parse_filters(
            payload.filters.get("dateFrom"),
            payload.filters.get("dateTo"),
            ",".join(payload.filters.get("wilayah", [])) if isinstance(payload.filters.get("wilayah"), list) else payload.filters.get("wilayah"),
            ",".join(payload.filters.get("kecamatan", [])) if isinstance(payload.filters.get("kecamatan"), list) else payload.filters.get("kecamatan"),
            ",".join(payload.filters.get("riskLevel", [])) if isinstance(payload.filters.get("riskLevel"), list) else payload.filters.get("riskLevel"),
        )
        return ENGINE.evidence_insight(payload.question, filters)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
