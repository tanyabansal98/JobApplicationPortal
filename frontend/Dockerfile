# --- Stage 1: Build ---
# We use Node 20 to build the static assets.
FROM --platform=linux/amd64 node:20-alpine AS build

WORKDIR /app

# STEP A: Cache Dependencies
# Just like the backend, we copy package files first to save time on 'npm install'.
COPY package*.json ./
RUN npm install

# STEP B: Build the App
# We define an ARG so the backend URL can be 'baked in' during the build.
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copy the rest of the source code and run the build script.
COPY . .
RUN npm run build

# --- Stage 2: Serve ---
# We switch to the Nginx Alpine image, which is extremely lightweight (~5MB).
FROM --platform=linux/amd64 nginx:stable-alpine

# STEP C: Deploy to Nginx
# We copy the result of Stage 1 (the 'dist' folder) into Nginx's HTML folder.
# This folder is where Nginx looks for files to serve to the web.
COPY --from=build /app/dist /usr/share/nginx/html

# Inform Docker that the container will listen on port 80 (standard HTTP port).
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
