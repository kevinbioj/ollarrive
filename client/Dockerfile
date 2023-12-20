ARG NGINX_VERSION=1.24.0
ARG NODE_VERSION=21.4.0-alpine

FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY public/ ./public/
COPY src/ ./src/
COPY index.html tsconfig.json tsconfig.node.json vite.config.ts ./
RUN npm run build

FROM nginx:${NGINX_VERSION}
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist ./
