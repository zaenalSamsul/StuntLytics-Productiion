# StuntLytics

Child-health intelligence workspace combining a Next.js medical dashboard, FastAPI data-science engine, Elasticsearch analytics, local scikit-learn screening, and an optional Gemini narrative layer.

## Fastest start: Docker

Requirements: Docker Desktop or Docker Engine with Compose v2.

```bash
cp .env.example .env
# optional: set GEMINI_API_KEY in .env
docker compose up --build
```

Open:

- Web: `http://localhost:3000`
- FastAPI docs: `http://localhost:8000/docs`
- Elasticsearch: `http://localhost:9200`
- Kibana: `http://localhost:5601`

The first startup automatically imports `data/Data.zip` before the API and web services become ready.

### Automatic Elasticsearch import

The one-shot `data-importer` service streams CSV files directly from the ZIP archive and creates these indices:

| Dataset | Elasticsearch index |
|---|---|
| `dummy_stunting_jabar_fixed_rules_CLEAN.csv` | `stunting-data` |
| `jml_tenaga_kesehatan_gizi__kabupatenkota.csv` | `jabar-tenaga-gizi` |
| `Jumlah Balita Berdasarkan DesaKelurahan di Jawa Barat.csv` | `jabar-balita-desa` |
| `data dummy stunting fix.csv` | `stunting-model-sample` |

The archive contains about 488k rows in total. Import is:

- streaming, so the 99 MB main CSV is not loaded fully into memory;
- bulk-indexed in configurable chunks;
- idempotent through deterministic IDs and `stuntlytics-ingest-state`;
- skipped automatically when the archive fingerprint is unchanged;
- recreated automatically when a dataset fingerprint changes, unless configured otherwise.

Check status:

```bash
curl http://localhost:8000/data/status
```

Force a re-import:

```bash
INGEST_FORCE=true docker compose up --build data-importer
```

Reset Elasticsearch and import from zero:

```bash
npm run docker:reset
npm run docker:up
```

> The bundled Compose stack disables Elasticsearch security for local development convenience. Do not expose it directly to the public internet or treat this configuration as a production deployment.

## Useful Docker commands

```bash
npm run docker:up
npm run docker:logs
npm run docker:down
npm run docker:reset
```

Importer-only logs:

```bash
docker compose logs -f data-importer
```

Run importer again without rebuilding the full stack:

```bash
docker compose run --rm data-importer
```

Validate the ZIP and transformations without Elasticsearch:

```bash
python scripts/ingest_elasticsearch.py --dry-run
```

## Local development without Docker

Requirements:

- Node.js 20.9+
- npm
- Python 3.10+
- optional local Elasticsearch

```bash
npm install
python -m venv .venv
```

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
copy .env.example .env
npm run dev
```

macOS/Linux:

```bash
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
cp .env.example .env
npm run dev
```

Services:

- Web UI: `http://127.0.0.1:3000`
- Data Science API: `http://127.0.0.1:8000`

Separate processes:

```bash
npm run dev:web
npm run dev:ds
```

## Data modes

`DS_DATA_MODE` supports:

- `elasticsearch`: require the indexed data;
- `auto`: use Elasticsearch when reachable, otherwise labelled deterministic fallback data;
- `demo`: always use deterministic fallback data.

Docker uses `elasticsearch` mode so data-source failures are visible rather than silently hidden.

## LLM layer

The optional narrative layer defaults to `gemini-2.5-flash-lite`.

```env
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash-lite
```

Without a key, quota, or provider availability, the application falls back to deterministic evidence summaries. Raw individual health records are not sent to the LLM; only aggregated evidence prepared by the local data-science engine is eligible for narrative generation.

## Important API endpoints

- `GET /health`
- `GET /data/status`
- `GET /model/status`
- `GET /llm/status`
- `GET /dashboard/summary`
- `GET /dashboard/risk-map`
- `GET /explorer`
- `GET /analysis/correlation`
- `POST /prediction/family`
- `POST /ai/insights`

The browser reaches these through the internal Next.js `/api/*` proxy.

## Documentation

Only two focused technical documents are kept:

- `docs/ARCHITECTURE.md`
- `docs/MODEL_CARD.md`

StuntLytics is decision support, not diagnosis.
