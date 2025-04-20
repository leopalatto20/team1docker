FROM node:18-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm@latest
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
