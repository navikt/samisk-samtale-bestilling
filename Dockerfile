FROM node:16-alpine

# Create app directory
WORKDIR /app

COPY package*.json /app/
COPY node_modules /app/node_modules/

# Copying build folders
COPY .next /app/.next/

# Copy necessary files
COPY next.config.js .env /app/

# Start app
EXPOSE 3006
CMD ["npm", "run", "start"]
