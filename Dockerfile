FROM node:24-slim

# Enable corepack for pnpm support
RUN corepack enable

# Create app directory
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc .env ./
COPY server/package.json /app/server/
COPY server/dist /app/server/dist/

# Set up registry authentication and install production dependencies
RUN --mount=type=secret,id=NODE_AUTH_TOKEN \
  NODE_AUTH_TOKEN=$(cat /run/secrets/NODE_AUTH_TOKEN) \
  pnpm install --frozen-lockfile --prod

# Use a non-root user to run the application
RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 3006
WORKDIR /app/server

CMD ["node", "dist/server/src/server.js"]