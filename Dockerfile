FROM node:16-alpine3.17

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY . .

# Bundle app source
RUN npm install
RUN npm run build

# Expose port 3000
EXPOSE 8080

# Run app
CMD ["npm", "run","start:prod"]

