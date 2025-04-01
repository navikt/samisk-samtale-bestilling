FROM gcr.io/distroless/nodejs20-debian12
# FROM node:20-alpine

WORKDIR /app

COPY package*.json .env /app/
COPY .env /app/server/dist/server/src/.env
COPY node_modules /app/node_modules/

COPY server/package*.json /app/server/
COPY server/dist /app/server/dist/
COPY server/node_modules /app/server/node_modules/


# Start app
ENV NODE_ENV=production
EXPOSE 3006
CMD ["./server/dist/server/src/server.js"]
