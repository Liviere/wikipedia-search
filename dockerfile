FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "node", "./src/server.js" ]