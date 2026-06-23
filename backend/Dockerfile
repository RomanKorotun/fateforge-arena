# BASE
FROM node:24-slim AS base
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# DEVELOPMENT
FROM base as development
COPY . ./
ENV NODE_ENV=development
ENTRYPOINT ["sh", "docker/entrypoint.sh"]
CMD ["yarn", "start:dev"]

# BUILD
FROM base AS build
COPY . ./
RUN npx prisma generate
RUN yarn build

# PRODUCTION API
FROM node:24-slim AS production
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma/generated ./dist/prisma/generated
COPY --from=build /app/prisma/seeds ./dist/prisma/seeds
ENV NODE_ENV=production
CMD ["yarn", "start:prod"]

# MIGRATION
FROM node:24-slim AS migration
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
ENV NODE_ENV=production
CMD ["yarn", "prisma:deploy"]
