FROM node:24-slim

# Create app directory
WORKDIR /app

COPY package*.json .env ./
COPY server/package*.json /app/server/
COPY server/dist /app/server/dist/

# Set up npm configuration once
RUN --mount=type=secret,id=NODE_AUTH_TOKEN sh -c \
  'npm config set //npm.pkg.github.com/:_authToken=$(cat /run/secrets/NODE_AUTH_TOKEN) && \
  npm config set @navikt:registry=https://npm.pkg.github.com && \
  npm ci --omit=dev \'

# Start app
EXPOSE 3006

CMD ["npm", "run", "start"]

# Use a non-root user to run the application
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Change ownership of the app directory to the new user
RUN chown -R appuser:appuser /app

# Switch to the non-root user as the last step
USER appuser