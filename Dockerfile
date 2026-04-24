FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# We don't copy the source code here because we will use a bind mount
# in docker-compose.yml for live reloading during development.

EXPOSE 5173

# Start the Vite development server and expose to the network
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
