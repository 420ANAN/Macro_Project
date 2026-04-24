FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# We don't copy the source code here because we will use a bind mount
# in docker-compose.yml for live reloading during development.

EXPOSE 3000

# Start the backend server using nodemon for live reload
# If nodemon isn't installed locally, npx will run it
CMD ["npx", "nodemon", "server.js"]
