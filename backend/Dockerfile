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

# PRODUCTION
FROM node:24-slim AS production
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./dist/prisma
COPY --from=build /app/dist/prisma.config.js ./dist/prisma.config.js

ENV NODE_ENV=production
CMD ["yarn", "start:prod"]
