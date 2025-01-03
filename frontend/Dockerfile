FROM node:16

# Set the working directory
WORKDIR /home/app/baseball-server/frontend

# Copy only package.json and package-lock.json for installing dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . . 

# Build and expose the application
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
