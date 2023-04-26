#!/usr/bin/env sh

DIR=$(dirname "$0")

docker-compose -f $DIR/../docker-compose-test.yml up -d

echo "${WAIT_FOR_URL}"

echo '🟡 - Waiting for database to be ready...'

$DIR/wait-for-it.sh "${WAIT_FOR_URL}" -- echo '🟢 - Database is ready!'

npx prisma migrate dev
