FROM node:18-alpine

# Create app directory
WORKDIR /app

COPY package*.json /app/
COPY node_modules /app/node_modules/

# Copying build folders
COPY server /app/server/
COPY index.html /app/
COPY .env /app/server/dist/

# Start app
EXPOSE 3006
CMD ["npm", "run", "start"]
