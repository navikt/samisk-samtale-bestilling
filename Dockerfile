FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim

# Create app directory
WORKDIR /app

COPY package*.json .env /app/
COPY server/package*.json /app/server/
COPY server/dist /app/server/dist/

ENV NODE_ENV=production

# Start app
EXPOSE 3006

# Use a non-root user to run the application
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Change ownership of the app directory to the new user
RUN chown -R appuser:appuser /app

# Switch to the non-root user as the last step
USER appuser

ENTRYPOINT ["node"]
CMD ["server/dist/server/src/server.js"]