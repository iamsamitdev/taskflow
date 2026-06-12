# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm — pinned to 10.x (pnpm 11 broke the build-script allowlist config)
RUN corepack enable && corepack prepare pnpm@10.34.3 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the app
RUN pnpm build

# Stage 2: Serve with Nginx
FROM nginx:alpine AS runner

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]