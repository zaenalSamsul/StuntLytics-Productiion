FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY docker/importer/requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt

COPY scripts/ingest_elasticsearch.py /app/ingest_elasticsearch.py
COPY data/Data.zip /data/Data.zip

CMD ["python", "/app/ingest_elasticsearch.py"]
