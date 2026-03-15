# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy shared packages first for local linking
COPY backend/shared /backend/shared

# Build shared packages
WORKDIR /backend/shared/logger
RUN npm install && npm run build

WORKDIR /backend/shared/middlewares
RUN npm install && npm run build

# Build the service
WORKDIR /app
COPY backend/academy-service/package*.json ./
RUN npm install

COPY backend/academy-service/ ./
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /backend/shared /backend/shared
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 8002

CMD ["node", "dist/index.js"]
