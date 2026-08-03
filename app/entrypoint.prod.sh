#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

# staticfiles/ and mediafiles/ are mounted from named volumes, whose on-disk
# ownership can drift from the image (e.g. leftover root ownership from an
# older deploy). Re-assert it on every boot before dropping to the
# unprivileged app user.
chown -R app:app "$APP_HOME/staticfiles" "$APP_HOME/mediafiles"

exec su-exec app "$@"