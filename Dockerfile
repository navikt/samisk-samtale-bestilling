FROM node:20-alpine

# Create app directory
WORKDIR /app

COPY package*.json .env ./

# Set up npm configuration once
RUN --mount=type=secret,id=NODE_AUTH_TOKEN sh -c \
  'npm config set //npm.pkg.github.com/:_authToken=$(cat /run/secrets/NODE_AUTH_TOKEN) && \
  npm config set @navikt:registry=https://npm.pkg.github.com && \
  npm ci --omit=dev'

COPY server/package*.json /app/server/
COPY server/dist /app/server/dist/

WORKDIR /app/server
RUN npm ci --omit=dev

WORKDIR /app

# Start app
EXPOSE 3006

CMD ["npm", "run", "start"]