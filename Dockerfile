FROM node:20-alpine

# Create app directory
WORKDIR /app

COPY package*.json .env ./

# Install app dependencies only (not dev deps)
RUN npm ci --omit=dev

COPY server/package*.json /app/server/
COPY server/dist /app/server/dist/

WORKDIR /app/server
RUN npm ci --omit=dev

WORKDIR /app

# Start app
EXPOSE 3006