#!/bin/sh
set -e

echo "Build prisma schema"
yarn prisma:build

echo "Generate prisma client"
npx prisma generate

echo "Apply migrations"
npx prisma migrate deploy

echo "Run seed"
yarn prisma:seed

echo "Start app via CMD"
exec "$@"