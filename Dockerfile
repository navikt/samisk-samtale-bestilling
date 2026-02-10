FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim

# Create app directory
WORKDIR /app

COPY package*.json .env /app/
COPY server/package*.json /app/server/
COPY server/dist /app/server/dist/

ENV NODE_ENV=production

# Start app
EXPOSE 3006
ENTRYPOINT ["node"]
CMD ["server/dist/server/src/server.js"]