#!/bin/bash
set -e

is_debug_enabled() {
    case "${DJANGO_DEBUG:-False}" in
        [Tt][Rr][Uu][Ee]|1|[Yy][Ee][Ss]) return 0 ;;
        *) return 1 ;;
    esac
}

# Применение миграций
python manage.py migrate --noinput

# В dev режиме запускаем runserver, чтобы он раздавал статику.
if is_debug_enabled; then
    exec python manage.py runserver 0.0.0.0:8000
fi

# Prod режим
# Сбор статики для prod
python manage.py collectstatic --noinput

# Запуск gunicorn
exec gunicorn GrapeLabStd.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 2 \
    --threads 4 \
    --worker-class gthread \
    --access-logfile - \
    --error-logfile -
