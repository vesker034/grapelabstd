# syntax=docker/dockerfile:1

FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Системные зависимости для mysqlclient
RUN apt-get update && apt-get install -y --no-install-recommends \
    pkg-config \
    default-libmysqlclient-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Создание non-root пользователя для безопасности
RUN useradd --create-home --shell /bin/bash appuser

# Зависимости Python (отдельный слой для кэширования)
COPY requirements.txt .
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r requirements.txt

# Код приложения
COPY --chown=appuser:appuser . .

# Права на entrypoint
RUN chmod +x /app/entrypoint.sh

# Переключение на non-root пользователя
USER appuser

EXPOSE 8000

ENTRYPOINT ["/app/entrypoint.sh"]
