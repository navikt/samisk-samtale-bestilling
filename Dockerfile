FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim

WORKDIR /app
ENV NODE_ENV=production

# package.json is needed because "type": "module" makes dist/*.js load as ESM
COPY package.json .env ./
COPY node_modules ./node_modules/
COPY static ./static/
COPY dist ./dist/

EXPOSE 3006

CMD ["node", "--env-file=.env", "dist/server.js"]
