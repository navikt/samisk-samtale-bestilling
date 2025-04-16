FROM node:20-alpine

# Create app directory
WORKDIR /app

COPY package*.json .env ./

# Install app dependencies only (not dev deps)
RUN --mount=type=secret,id=NODE_AUTH_TOKEN \
    npm config set //npm.pkg.github.com/:_authToken=$(cat /run/secrets/NODE_AUTH_TOKEN)
RUN npm config set @navikt:registry=https://npm.pkg.github.com

RUN npm ci --omit=dev

COPY server/package*.json /app/server/
COPY server/dist /app/server/dist/

WORKDIR /app/server
RUN npm ci --omit=dev

WORKDIR /app

# Start app
EXPOSE 3006