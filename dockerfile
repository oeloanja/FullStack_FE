# Base image
FROM node:18 as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies using npm
RUN npm install

# Copy all project files
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port that the Next.js app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]