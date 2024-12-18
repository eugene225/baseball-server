# Use Node.js base image for frontend
FROM node:16

# Set working directory for frontend
WORKDIR /home/app/frontend

# Copy package.json and install dependencies
COPY frontend/package*.json ./
RUN npm install

# Build the frontend app
RUN npm run build

# Expose the port for frontend
EXPOSE 5000

# Command to serve the app #
CMD ["serve", "-s", "build"]
