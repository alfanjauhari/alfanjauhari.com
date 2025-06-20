FROM postgres:17 AS db

RUN apt-get update && apt-get install -y postgresql-17-cron

COPY ./setup-pg-cron.sh /docker-entrypoint-initdb.d/