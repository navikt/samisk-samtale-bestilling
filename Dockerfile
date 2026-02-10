FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim

# Create app directory
WORKDIR /app

COPY package*.json .env ./
COPY node_modules /app/node_modules/
COPY server/package*.json /app/server/
COPY server/dist /app/server/dist/
COPY server/node_modules* /app/server/node_modules/

ENV NODE_ENV=production

# Start app
EXPOSE 3006

CMD ["npm", "run", "start"]

# Use a non-root user to run the application
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Change ownership of the app directory to the new user
RUN chown -R appuser:appuser /app

# Switch to the non-root user as the last step
USER appuser