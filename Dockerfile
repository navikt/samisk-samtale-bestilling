# syntax=docker/dockerfile:1.6
FROM node:24-slim

ENV NODE_ENV=production

# Install pnpm (pin it, don’t trust whatever the base image feels like today)
RUN corepack enable \
 && corepack prepare pnpm@10 --activate \
 && pnpm --version

WORKDIR /app

# 1) Copy only manifests first (better cache + deterministic install)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY server/package.json ./server/package.json

RUN --mount=type=secret,id=NODE_AUTH_TOKEN sh -c \
'pnpm config set //npm.pkg.github.com/:_authToken=$(cat /run/secrets/NODE_AUTH_TOKEN) && \
 pnpm config set @navikt:registry=https://npm.pkg.github.com && \
 pnpm install --frozen-lockfile --prod'

COPY server/dist ./server/dist

EXPOSE 3006


CMD ["node", "server/dist/server/src/server.js"]