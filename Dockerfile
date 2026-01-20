# syntax=docker/dockerfile:1.6
FROM node:24-slim

# Install pnpm (pin it inside the image; GitHub Actions pnpm does not affect Docker build layers)
RUN corepack enable \
 && corepack prepare pnpm@10 --activate \
 && pnpm --version

# Create app directory
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .env ./
COPY server/package.json /app/server/
COPY server/dist /app/server/dist/

# Set up pnpm configuration once
RUN --mount=type=secret,id=NODE_AUTH_TOKEN sh -c \
  'pnpm --version && \
  pnpm config set //npm.pkg.github.com/:_authToken=$(cat /run/secrets/NODE_AUTH_TOKEN) && \
  pnpm config set @navikt:registry=https://npm.pkg.github.com && \
  pnpm install --frozen-lockfile --prod'

# Start app
EXPOSE 3006

CMD ["pnpm", "run", "start"]

# Use a non-root user to run the application
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Change ownership of the app directory to the new user
RUN chown -R appuser:appuser /app

# Switch to the non-root user as the last step
USER appuser