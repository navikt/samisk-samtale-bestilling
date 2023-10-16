FROM node:20-alpine

# Create app directory
WORKDIR /app

COPY package*.json .env /app/
COPY node_modules /app/node_modules/

COPY server/package*.json /app/server/
COPY server/dist  /app/server/dist/
COPY server/node_modules /app/server/node_modules/

# Start app
EXPOSE 3006
CMD ["npm", "run", "start"]
