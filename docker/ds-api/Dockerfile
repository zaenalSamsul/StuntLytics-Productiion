FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

COPY requirements.api.txt /tmp/requirements.api.txt
RUN pip install --no-cache-dir -r /tmp/requirements.api.txt

COPY ds_api /app/ds_api
COPY src /app/src
COPY models /app/models
COPY .env.example /app/.env.example

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "ds_api.main:app", "--host", "0.0.0.0", "--port", "8000"]
