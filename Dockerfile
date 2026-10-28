# ==============================================================================
# FoodBridge AI — Frontend Dockerfile (Production Multi-Stage Build)
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Build arguments for Vite injection at build time
ARG VITE_API_BASE_URL=""
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Nginx Production Stage
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

