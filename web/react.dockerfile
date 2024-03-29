# Use an official Node runtime as the base image
FROM node:latest

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle the app source inside the Docker image
COPY . .

# Make port   3000 available outside the container
EXPOSE   3000

# Run the app when the container launches
CMD ["npm", "run", "dev"]