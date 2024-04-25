FROM mariadb:lts AS base
WORKDIR /app

COPY ./docker/testInit.sql /docker-entrypoint-initdb.d/init.sql

ENV MARIADB_ROOT_PASSWORD admin
ENV MARIADB_DATABASE eco-planner
# ENV MARIADB_USER test
# ENV MARIADB_PASSWORD test

EXPOSE 3306