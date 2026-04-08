# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

# Build the app to "dist" directory
COPY . .
# Note: Since Docker doesn't have your local .env, build-time variables (like VITE_API_URL)
# should ideally be passed in as ARG. For standard NGINX proxy setup, we proxy /api.
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
