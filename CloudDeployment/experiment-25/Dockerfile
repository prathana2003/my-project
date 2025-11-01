# ---------- Stage 1: Build ----------
FROM node:18-alpine AS builder

# Create app directory
WORKDIR /app

# Copy package manifests and install only dependencies (faster caching)
COPY package.json package-lock.json* ./

# Use npm ci if package-lock.json exists for reproducible install
RUN if [ -f package-lock.json ]; then npm ci --silent; else npm install --silent; fi

# Copy app source
COPY . .

# Build the app for production
ARG REACT_APP_API_URL=""
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

RUN npm run build

# ---------- Stage 2: Serve with nginx ----------
FROM nginx:stable-alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx config (if you created one). If not present this step will be skipped.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Use the default nginx entrypoint/cmd
CMD ["nginx", "-g", "daemon off;"]