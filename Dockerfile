FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc .env /app/
COPY node_modules /app/node_modules/
COPY server/dist /app/server/dist/
COPY server/package.json /app/server/
COPY server/node_modules /app/server/node_modules/

ENV NODE_ENV=production

EXPOSE 3006

ENTRYPOINT ["node"]
CMD ["server/dist/server/src/server.js"]
