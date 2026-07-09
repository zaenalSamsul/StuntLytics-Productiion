from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
import logging
import os
import sys
import time
import zipfile
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable, Dict, Iterable, Iterator, List, Optional

try:
    from elasticsearch import Elasticsearch, helpers
except ImportError:  # allows --dry-run before dependencies are installed
    Elasticsearch = Any  # type: ignore[misc,assignment]
    helpers = None  # type: ignore[assignment]

LOG = logging.getLogger("stuntlytics-ingest")
SCHEMA_VERSION = "2026-07-v2"
STATE_INDEX = "stuntlytics-ingest-state"


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def env_bool(name: str, default: bool = False) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "y", "on"}


def clean_text(value: Any) -> Optional[str]:
    if value is None:
        return None
    text = str(value).strip()
    return text or None


def to_int(value: Any) -> Optional[int]:
    text = clean_text(value)
    if text is None:
        return None
    text = text.replace(" ", "")
    if "," in text and "." in text:
        text = text.replace(".", "").replace(",", ".")
    else:
        text = text.replace(",", ".")
    try:
        return int(float(text))
    except (TypeError, ValueError):
        return None


def to_float(value: Any) -> Optional[float]:
    text = clean_text(value)
    if text is None:
        return None
    text = text.replace(" ", "")
    if "," in text and "." in text:
        text = text.replace(".", "").replace(",", ".")
    else:
        text = text.replace(",", ".")
    filtered = "".join(ch for ch in text if ch.isdigit() or ch in ".-")
    try:
        return float(filtered)
    except (TypeError, ValueError):
        return None


def stable_id(*parts: Any) -> str:
    payload = "|".join(str(p or "") for p in parts)
    return hashlib.sha1(payload.encode("utf-8"), usedforsecurity=False).hexdigest()


def keyword_dynamic_templates() -> List[Dict[str, Any]]:
    return [
        {
            "strings_as_keywords": {
                "match_mapping_type": "string",
                "mapping": {"type": "keyword", "ignore_above": 1024},
            }
        }
    ]


MAIN_INT_FIELDS = {
    "Jumlah Anak",
    "Usia Anak (bulan)",
    "Berat Lahir (gram)",
    "Kunjungan ANC (jumlah kunjungan)",
    "Kunjungan ANC (x)",
    "Tahun",
}
MAIN_FLOAT_FIELDS = {
    "Upah",
    "UMP Wilayah (nilai upah minimum untuk kabupaten/kota tersebut)",
    "Upah Keluarga (Rp/bulan)",
    "Rata-rata UMP Wilayah (Rp/bulan)",
    "Tinggi Ibu (cm)",
    "Tinggi Badan Ibu (cm)",
    "LiLA (cm)",
    "LiLA saat Hamil (cm)",
    "IMT (BMI)",
    "BMI Pra-Hamil",
    "Hb (g/dL)",
    "Kenaikan BB Hamil (kg)",
    "Usia Ibu Hamil (tahun)",
    "Usia Ibu saat Hamil (tahun)",
    "Jarak Hamil (tahun)",
    "ZScore TB/U",
    "Z-Score TB/U",
}


def transform_main(row: Dict[str, str], row_number: int) -> Dict[str, Any]:
    doc: Dict[str, Any] = {}
    for key, raw in row.items():
        key = (key or "").strip()
        if not key:
            continue
        if key in MAIN_INT_FIELDS:
            doc[key] = to_int(raw)
        elif key in MAIN_FLOAT_FIELDS:
            doc[key] = to_float(raw)
        else:
            doc[key] = clean_text(raw)

    aliases = {
        "Nama Kepala Keluarga": "Nama KK",
        "Jenis Pekerjaan Orang Tua": "Pekerjaan",
        "Status Imunisasi Anak": "Imunisasi (lengkap/tidak lengkap)",
        "ASI Eksklusif": "ASI Eksklusif (ya/tidak)",
        "Z-Score TB/U": "ZScore TB/U",
        "Rata-rata UMP Wilayah (Rp/bulan)": "UMP Wilayah (nilai upah minimum untuk kabupaten/kota tersebut)",
        "Upah Keluarga (Rp/bulan)": "Upah",
        "LiLA saat Hamil (cm)": "LiLA (cm)",
        "BMI Pra-Hamil": "IMT (BMI)",
        "Tinggi Badan Ibu (cm)": "Tinggi Ibu (cm)",
        "Usia Ibu saat Hamil (tahun)": "Usia Ibu Hamil (tahun)",
        "Kunjungan ANC (x)": "Kunjungan ANC (jumlah kunjungan)",
        "Paparan Asap Rokok": "Paparan Asap Rokok (ya/tidak)",
        "Akses Air Bersih": "Akses Air",
        "Kepesertaan Program Bantuan": "Bantuan",
    }
    for target, source in aliases.items():
        if doc.get(target) is None and doc.get(source) is not None:
            doc[target] = doc[source]

    status = clean_text(doc.get("Status Stunting (Stunting / Berisiko / Normal)"))
    if status:
        doc.setdefault("Kategori Stunting (3L)", status)
        doc.setdefault("Status Stunting (Biner)", "Stunting" if status.casefold() == "stunting" else "Tidak")

    # Exact aggregations in the application use the named region field.
    doc["nama_kabupaten_kota"] = clean_text(doc.get("nama_kabupaten_kota"))
    if not doc["nama_kabupaten_kota"] and clean_text(doc.get("Wilayah")) == "3218":
        doc["nama_kabupaten_kota"] = "Kabupaten Pangandaran"
    doc["Kecamatan"] = clean_text(doc.get("Kecamatan"))
    doc["Tanggal"] = clean_text(doc.get("Tanggal"))
    doc["source_dataset"] = "stunting_main_clean"
    doc["source_row"] = row_number
    return doc


def transform_legacy_sample(row: Dict[str, str], row_number: int) -> Dict[str, Any]:
    int_fields = {"Jumlah Anak", "Usia Anak (bulan)", "Berat Lahir (gram)", "Usia Ibu saat Hamil (tahun)", "Jarak Kehamilan Sebelumnya (bulan)", "Kunjungan ANC (x)"}
    float_fields = {
        "Upah Keluarga (Rp/bulan)", "Rata-rata UMP Wilayah (Rp/bulan)", "Tinggi Badan Ibu (cm)",
        "LiLA saat Hamil (cm)", "BMI Pra-Hamil", "Hb (g/dL)", "Kenaikan BB Hamil (kg)",
        "Prob_raw", "Z-Score TB/U", "Probabilitas Stunting (simulasi)",
    }
    doc: Dict[str, Any] = {}
    for key, raw in row.items():
        key = (key or "").strip()
        if key in int_fields:
            doc[key] = to_int(raw)
        elif key in float_fields:
            doc[key] = to_float(raw)
        else:
            doc[key] = clean_text(raw)
    doc["source_dataset"] = "stunting_model_sample"
    doc["source_row"] = row_number
    return doc


def transform_workforce(row: Dict[str, str], row_number: int) -> Dict[str, Any]:
    doc: Dict[str, Any] = {}
    for key, raw in row.items():
        key = (key or "").strip()
        if key in {"id", "kode_provinsi", "kode_kabupaten_kota", "jumlah_nakes_gizi", "tahun"}:
            doc[key] = to_int(raw)
        else:
            doc[key] = clean_text(raw)
    if doc.get("nama_kabupaten_kota"):
        doc["nama_kabupaten_kota"] = str(doc["nama_kabupaten_kota"]).title()
    doc["source_dataset"] = "nutrition_workforce"
    doc["source_row"] = row_number
    return doc


def transform_village_children(row: Dict[str, str], row_number: int) -> Dict[str, Any]:
    int_fields = {
        "kode_provinsi", "bps_kode_kabupaten_kota", "bps_kode_kecamatan", "bps_kode_desa_kelurahan",
        "jumlah_balita", "tahun", "id",
    }
    doc: Dict[str, Any] = {}
    for key, raw in row.items():
        key = (key or "").strip()
        if key in int_fields:
            doc[key] = to_int(raw)
        else:
            doc[key] = clean_text(raw)
    doc["source_dataset"] = "village_child_counts"
    doc["source_row"] = row_number
    return doc


@dataclass(frozen=True)
class DatasetSpec:
    name: str
    member: str
    index: str
    transform: Callable[[Dict[str, str], int], Dict[str, Any]]
    id_fields: tuple[str, ...]
    mappings: Dict[str, Any]
    optional: bool = False


MAIN_PROPERTIES: Dict[str, Any] = {
    "Tanggal": {"type": "date", "format": "strict_date_optional_time||yyyy-MM-dd"},
    "nama_kabupaten_kota": {"type": "keyword"},
    "Wilayah": {"type": "keyword"},
    "Kecamatan": {"type": "keyword"},
    "Status Stunting (Biner)": {"type": "keyword"},
    "Status Stunting (Stunting / Berisiko / Normal)": {"type": "keyword"},
    "Kategori Stunting (3L)": {"type": "keyword"},
    "Imunisasi (lengkap/tidak lengkap)": {"type": "keyword"},
    "Status Imunisasi Anak": {"type": "keyword"},
    "ASI Eksklusif": {"type": "keyword"},
    "ASI Eksklusif (ya/tidak)": {"type": "keyword"},
    "Akses Air": {"type": "keyword"},
    "Akses Air Bersih": {"type": "keyword"},
    "Pendidikan Ibu": {"type": "keyword"},
    "Jumlah Anak": {"type": "integer"},
    "Usia Anak (bulan)": {"type": "integer"},
    "Berat Lahir (gram)": {"type": "integer"},
    "Kunjungan ANC (jumlah kunjungan)": {"type": "integer"},
    "Kunjungan ANC (x)": {"type": "integer"},
    "Tahun": {"type": "integer"},
    "Upah": {"type": "double"},
    "UMP Wilayah (nilai upah minimum untuk kabupaten/kota tersebut)": {"type": "double"},
    "Upah Keluarga (Rp/bulan)": {"type": "double"},
    "Rata-rata UMP Wilayah (Rp/bulan)": {"type": "double"},
    "Tinggi Ibu (cm)": {"type": "double"},
    "Tinggi Badan Ibu (cm)": {"type": "double"},
    "LiLA (cm)": {"type": "double"},
    "LiLA saat Hamil (cm)": {"type": "double"},
    "IMT (BMI)": {"type": "double"},
    "BMI Pra-Hamil": {"type": "double"},
    "Hb (g/dL)": {"type": "double"},
    "Kenaikan BB Hamil (kg)": {"type": "double"},
    "Usia Ibu Hamil (tahun)": {"type": "double"},
    "Usia Ibu saat Hamil (tahun)": {"type": "double"},
    "Jarak Hamil (tahun)": {"type": "double"},
    "ZScore TB/U": {"type": "double"},
    "Z-Score TB/U": {"type": "double"},
    "source_row": {"type": "integer"},
}

DATASETS: List[DatasetSpec] = [
    DatasetSpec(
        name="stunting_main",
        member="Data/dummy_stunting_jabar_fixed_rules_CLEAN.csv",
        index=os.getenv("STUNTING_INDEX", "stunting-data"),
        transform=transform_main,
        id_fields=("Tanggal", "Nama KK", "nama_kabupaten_kota", "Kecamatan"),
        mappings={"dynamic_templates": keyword_dynamic_templates(), "properties": MAIN_PROPERTIES},
    ),
    DatasetSpec(
        name="nutrition_workforce",
        member="Data/jml_tenaga_kesehatan_gizi__kabupatenkota.csv",
        index=os.getenv("NUTRITION_INDEX", "jabar-tenaga-gizi"),
        transform=transform_workforce,
        id_fields=("kode_kabupaten_kota", "tahun", "id"),
        mappings={
            "dynamic_templates": keyword_dynamic_templates(),
            "properties": {
                "id": {"type": "integer"},
                "kode_provinsi": {"type": "integer"},
                "kode_kabupaten_kota": {"type": "integer"},
                "nama_kabupaten_kota": {"type": "keyword"},
                "jumlah_nakes_gizi": {"type": "integer"},
                "tahun": {"type": "integer"},
                "source_row": {"type": "integer"},
            },
        },
    ),
    DatasetSpec(
        name="village_children",
        member="Data/Jumlah Balita Berdasarkan DesaKelurahan di Jawa Barat.csv",
        index=os.getenv("VILLAGE_CHILD_INDEX", "jabar-balita-desa"),
        transform=transform_village_children,
        id_fields=("bps_kode_desa_kelurahan", "tahun", "id"),
        mappings={
            "dynamic_templates": keyword_dynamic_templates(),
            "properties": {
                "kode_provinsi": {"type": "integer"},
                "bps_kode_kabupaten_kota": {"type": "integer"},
                "bps_kode_kecamatan": {"type": "integer"},
                "bps_kode_desa_kelurahan": {"type": "long"},
                "jumlah_balita": {"type": "integer"},
                "tahun": {"type": "integer"},
                "id": {"type": "integer"},
                "bps_nama_kabupaten_kota": {"type": "keyword"},
                "bps_nama_kecamatan": {"type": "keyword"},
                "bps_nama_desa_kelurahan": {"type": "keyword"},
                "source_row": {"type": "integer"},
            },
        },
    ),
    DatasetSpec(
        name="stunting_model_sample",
        member="Data/data dummy stunting fix.csv",
        index=os.getenv("MODEL_SAMPLE_INDEX", "stunting-model-sample"),
        transform=transform_legacy_sample,
        id_fields=("Wilayah", "Kecamatan", "Nama Kepala Keluarga"),
        mappings={
            "dynamic_templates": keyword_dynamic_templates(),
            "properties": {
                "Wilayah": {"type": "keyword"},
                "Kecamatan": {"type": "keyword"},
                "Z-Score TB/U": {"type": "double"},
                "Probabilitas Stunting (simulasi)": {"type": "double"},
                "Usia Anak (bulan)": {"type": "integer"},
                "Berat Lahir (gram)": {"type": "integer"},
                "source_row": {"type": "integer"},
            },
        },
        optional=True,
    ),
]


def archive_fingerprint(zf: zipfile.ZipFile, spec: DatasetSpec) -> str:
    info = zf.getinfo(spec.member)
    payload = f"{SCHEMA_VERSION}|{spec.member}|{info.CRC}|{info.file_size}|{info.compress_size}"
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def wait_for_elasticsearch(client: Elasticsearch, timeout_seconds: int) -> None:
    deadline = time.monotonic() + timeout_seconds
    last_error: Optional[Exception] = None
    while time.monotonic() < deadline:
        try:
            if client.ping():
                health = client.cluster.health(wait_for_status="yellow", timeout="5s")
                LOG.info("Elasticsearch ready: status=%s", health.get("status"))
                return
        except Exception as exc:  # noqa: BLE001
            last_error = exc
        time.sleep(2)
    raise RuntimeError(f"Elasticsearch not ready within {timeout_seconds}s: {last_error}")


def ensure_state_index(client: Elasticsearch) -> None:
    if client.indices.exists(index=STATE_INDEX):
        return
    client.indices.create(
        index=STATE_INDEX,
        settings={"number_of_shards": 1, "number_of_replicas": 0},
        mappings={
            "dynamic_templates": keyword_dynamic_templates(),
            "properties": {
                "dataset": {"type": "keyword"},
                "targetIndex": {"type": "keyword"},
                "fingerprint": {"type": "keyword"},
                "schemaVersion": {"type": "keyword"},
                "importedAt": {"type": "date"},
                "documents": {"type": "long"},
                "errors": {"type": "long"},
                "status": {"type": "keyword"},
            },
        },
    )


def get_state(client: Elasticsearch, name: str) -> Optional[Dict[str, Any]]:
    try:
        response = client.get(index=STATE_INDEX, id=name)
        return response.get("_source")
    except Exception as exc:  # not_found may vary by client response class
        if getattr(exc, "status_code", None) == 404:
            return None
        if exc.__class__.__name__ == "NotFoundError":
            return None
        raise


def index_count(client: Elasticsearch, index: str) -> int:
    if not client.indices.exists(index=index):
        return 0
    return int(client.count(index=index).get("count", 0))


def create_target_index(client: Elasticsearch, spec: DatasetSpec) -> None:
    client.indices.create(
        index=spec.index,
        settings={
            "number_of_shards": int(os.getenv("ES_INDEX_SHARDS", "1")),
            "number_of_replicas": int(os.getenv("ES_INDEX_REPLICAS", "0")),
            "refresh_interval": "-1",
        },
        mappings={**spec.mappings, "_meta": {"dataset": spec.name, "schemaVersion": SCHEMA_VERSION}},
    )


def action_stream(zf: zipfile.ZipFile, spec: DatasetSpec) -> Iterator[Dict[str, Any]]:
    with zf.open(spec.member, "r") as raw:
        with io.TextIOWrapper(raw, encoding="utf-8-sig", newline="") as text:
            reader = csv.DictReader(text)
            if reader.fieldnames:
                reader.fieldnames = [(name or "").strip() for name in reader.fieldnames]
            for row_number, row in enumerate(reader, start=1):
                doc = spec.transform(row, row_number)
                parts = [doc.get(field) for field in spec.id_fields]
                doc_id = stable_id(spec.name, *parts, row_number)
                yield {"_op_type": "index", "_index": spec.index, "_id": doc_id, "_source": doc}


def import_dataset(
    client: Elasticsearch,
    zf: zipfile.ZipFile,
    spec: DatasetSpec,
    force: bool,
    recreate_on_change: bool,
    chunk_size: int,
) -> Dict[str, Any]:
    fingerprint = archive_fingerprint(zf, spec)
    state = get_state(client, spec.name)
    existing_count = index_count(client, spec.index)

    unchanged = bool(
        state
        and state.get("fingerprint") == fingerprint
        and state.get("schemaVersion") == SCHEMA_VERSION
        and state.get("status") == "completed"
        and existing_count > 0
        and existing_count == int(state.get("documents", -1))
    )
    if unchanged and not force:
        LOG.info("SKIP %-24s index=%s docs=%s (unchanged)", spec.name, spec.index, existing_count)
        return {"dataset": spec.name, "index": spec.index, "documents": existing_count, "errors": 0, "skipped": True}

    index_exists = bool(client.indices.exists(index=spec.index))
    changed = bool(state and state.get("fingerprint") != fingerprint)
    if index_exists and (force or (changed and recreate_on_change)):
        LOG.warning("Recreating index %s for dataset %s", spec.index, spec.name)
        client.indices.delete(index=spec.index)
        index_exists = False

    if not index_exists:
        create_target_index(client, spec)

    client.index(
        index=STATE_INDEX,
        id=spec.name,
        document={
            "dataset": spec.name,
            "targetIndex": spec.index,
            "fingerprint": fingerprint,
            "schemaVersion": SCHEMA_VERSION,
            "importedAt": utc_now(),
            "documents": 0,
            "errors": 0,
            "status": "running",
            "archiveMember": spec.member,
        },
        refresh=True,
    )

    LOG.info("IMPORT %-22s -> %s", spec.name, spec.index)
    ok_count = 0
    error_count = 0
    sample_errors: List[Any] = []
    for ok, item in helpers.streaming_bulk(
        client,
        action_stream(zf, spec),
        chunk_size=chunk_size,
        max_chunk_bytes=20 * 1024 * 1024,
        raise_on_error=False,
        raise_on_exception=False,
        request_timeout=180,
    ):
        if ok:
            ok_count += 1
        else:
            error_count += 1
            if len(sample_errors) < 5:
                sample_errors.append(item)
        if (ok_count + error_count) % 25_000 == 0:
            LOG.info("  progress dataset=%s indexed=%s errors=%s", spec.name, ok_count, error_count)

    client.indices.put_settings(index=spec.index, settings={"refresh_interval": "1s"})
    client.indices.refresh(index=spec.index)

    final_count = index_count(client, spec.index)
    state_doc = {
        "dataset": spec.name,
        "targetIndex": spec.index,
        "fingerprint": fingerprint,
        "schemaVersion": SCHEMA_VERSION,
        "importedAt": utc_now(),
        "documents": final_count,
        "errors": error_count,
        "status": "completed" if error_count == 0 else "failed",
        "archiveMember": spec.member,
    }
    client.index(index=STATE_INDEX, id=spec.name, document=state_doc, refresh=True)

    if sample_errors:
        LOG.error("Sample bulk errors for %s: %s", spec.name, json.dumps(sample_errors, ensure_ascii=False)[:4000])
    if error_count:
        raise RuntimeError(f"Dataset {spec.name} finished with {error_count} indexing errors")

    LOG.info("DONE %-24s docs=%s", spec.name, final_count)
    return {"dataset": spec.name, "index": spec.index, "documents": final_count, "errors": error_count, "skipped": False}


def dry_run(archive: Path, include_optional: bool) -> int:
    with zipfile.ZipFile(archive) as zf:
        names = set(zf.namelist())
        for spec in DATASETS:
            if spec.optional and not include_optional:
                continue
            if spec.member not in names:
                raise FileNotFoundError(f"Missing archive member: {spec.member}")
            info = zf.getinfo(spec.member)
            with zf.open(spec.member) as raw, io.TextIOWrapper(raw, encoding="utf-8-sig", newline="") as text:
                reader = csv.DictReader(text)
                first = next(reader, None)
                transformed = spec.transform(first or {}, 1)
            print(json.dumps({
                "dataset": spec.name,
                "member": spec.member,
                "index": spec.index,
                "uncompressedBytes": info.file_size,
                "fingerprint": archive_fingerprint(zf, spec)[:16],
                "sampleKeys": list(transformed.keys())[:12],
            }, ensure_ascii=False))
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Idempotent StuntLytics CSV.zip -> Elasticsearch importer")
    parser.add_argument("--dry-run", action="store_true", help="Validate archive and transformations without Elasticsearch")
    parser.add_argument("--force", action="store_true", help="Re-import even when archive fingerprint is unchanged")
    return parser.parse_args()


def main() -> int:
    logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"), format="%(asctime)s %(levelname)s %(message)s")
    args = parse_args()
    archive = Path(os.getenv("DATA_ARCHIVE", "data/Data.zip")).resolve()
    include_optional = env_bool("INGEST_INCLUDE_LEGACY_SAMPLE", True)
    if not archive.exists():
        LOG.error("Data archive not found: %s", archive)
        return 2

    if args.dry_run:
        return dry_run(archive, include_optional)

    es_url = os.getenv("ES_URL", "http://localhost:9200")
    if helpers is None:
        raise RuntimeError("Python package 'elasticsearch' is required for live ingestion")
    client = Elasticsearch(es_url, request_timeout=120, retry_on_timeout=True, max_retries=5)
    wait_for_elasticsearch(client, int(os.getenv("ES_WAIT_TIMEOUT", "180")))
    ensure_state_index(client)

    force = args.force or env_bool("INGEST_FORCE", False)
    recreate_on_change = env_bool("INGEST_RECREATE_ON_CHANGE", True)
    chunk_size = max(100, int(os.getenv("INGEST_CHUNK_SIZE", "2000")))

    results: List[Dict[str, Any]] = []
    with zipfile.ZipFile(archive) as zf:
        names = set(zf.namelist())
        for spec in DATASETS:
            if spec.optional and not include_optional:
                LOG.info("SKIP optional dataset %s", spec.name)
                continue
            if spec.member not in names:
                if spec.optional:
                    LOG.warning("Optional archive member missing: %s", spec.member)
                    continue
                raise FileNotFoundError(f"Required archive member missing: {spec.member}")
            results.append(import_dataset(client, zf, spec, force, recreate_on_change, chunk_size))

    summary = {"status": "ok", "completedAt": utc_now(), "results": results}
    LOG.info("IMPORT SUMMARY %s", json.dumps(summary, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except KeyboardInterrupt:
        raise SystemExit(130)
    except Exception as exc:  # noqa: BLE001
        LOG.exception("Automatic ingestion failed: %s", exc)
        raise SystemExit(1)
