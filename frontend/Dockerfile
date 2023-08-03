# We're using the node base image
FROM node:14

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the root directory in your container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code into the working directory
COPY . .

# Make port 3000 available outside the container
EXPOSE 3000

# Start your app
CMD ["npm", "start"]
