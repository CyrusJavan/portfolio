# Base image to build the container from
FROM node:8

# Create the app directory
WORKDIR /usr/src/app

# Install the app dependencies
# copy over package.json and package-lock.json
COPY package*.json ./

RUN npm install
# For production use 
# RUN npm install --only=production

# Bundle app source
COPY . .

# Expose the port we want to listen on
EXPOSE 8080

# Define the command to run the application
CMD [ "npm", "start" ]