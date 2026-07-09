# Architecture

## Runtime topology

```text
Browser
  |
  v
Next.js Web :3000
  | /api/* proxy
  v
FastAPI Data Science Engine :8000
  |                     |
  |                     +--> local stunting_pipeline.joblib
  |
  +--> Elasticsearch :9200
          ^
          |
    one-shot data-importer
          ^
          |
      data/Data.zip

Kibana :5601 ---> Elasticsearch
```

## Docker startup order

```text
Elasticsearch healthy
        |
        v
Automatic data-importer completes successfully
        |
        v
FastAPI becomes healthy in DS_DATA_MODE=elasticsearch
        |
        v
Next.js web starts
```

Kibana starts after Elasticsearch is healthy and is independent of the application readiness chain.

## Automatic ingestion

`scripts/ingest_elasticsearch.py` reads CSV members directly from `data/Data.zip` using Python streaming I/O. It does not extract the 99 MB main CSV to disk and does not build the entire dataset in memory.

The importer:

1. waits for Elasticsearch;
2. creates `stuntlytics-ingest-state`;
3. fingerprints each ZIP member using archive metadata plus an ingestion schema version;
4. creates explicit mappings for dates, numerics, and aggregation fields;
5. normalises compatibility aliases used by the existing analytics queries;
6. streams actions through the Elasticsearch bulk helper;
7. refreshes the index;
8. records document counts and fingerprint state;
9. skips unchanged datasets on later starts.

The main dataset maps to `stunting-data`. Workforce data maps to `jabar-tenaga-gizi`. Village child counts and the older model sample remain separate so they do not contaminate primary dashboard aggregations.

## Data-source boundary

`DS_DATA_MODE=elasticsearch` is used by Docker. The API reads live indexed data and exposes source metadata in responses.

`DS_DATA_MODE=auto` is useful for local development: it tries Elasticsearch first and otherwise uses a deterministic, explicitly labelled fallback dataset.

## Machine-learning boundary

The local serialized model is loaded from:

```text
models/stunting_pipeline.joblib
```

Family screening sends validated structured features to FastAPI. The inference result is a prioritisation signal and must not be presented as diagnosis.

## LLM boundary

The optional Gemini layer receives aggregated evidence only. Raw CSV rows, household records, Elasticsearch documents, and serialized model feature rows are intentionally excluded from the LLM payload.

If Gemini is unavailable, deterministic evidence summaries remain active.

## Local-development security

The bundled Docker Compose configuration disables Elasticsearch security to keep local setup automatic. It is not a production deployment profile. A public or production deployment should enable authentication, TLS, secrets management, network restrictions, backups, and a multi-node availability strategy as appropriate.
