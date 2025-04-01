# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json .env ./
COPY server/package*.json ./server/

# Install dependencies
RUN npm ci --omit=dev && \
    cd server && npm ci --omit=dev && \
    cd ..

COPY . .

# Final stage
FROM gcr.io/distroless/nodejs20

WORKDIR /app

COPY --from=builder /app .

EXPOSE 3006
CMD ["npm", "run", "start"]
