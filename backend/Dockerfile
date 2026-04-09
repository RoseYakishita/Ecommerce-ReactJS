FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies separately to cache the layer
COPY package*.json ./
RUN npm install

# Copy application files and build
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
