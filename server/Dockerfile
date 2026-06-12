# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm — pinned to 10.x: pnpm 11 changed the build-script allowlist
# format, so @latest broke onlyBuiltDependencies (ERR_PNPM_IGNORED_BUILDS)
RUN corepack enable && corepack prepare pnpm@10.34.3 --activate

# Copy package files (pnpm-workspace.yaml carries the build-script allowlist for pnpm 10)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install all dependencies (รวม devDependencies สำหรับ build)
RUN pnpm install --frozen-lockfile

# Copy source code + prisma schema
COPY . .

# Generate Prisma Client
RUN pnpm exec prisma generate

# Compile TypeScript
RUN pnpm build

# Stage 2: Production
FROM node:22-alpine AS runner

WORKDIR /app

# Install pnpm (pinned — see builder stage)
RUN corepack enable && corepack prepare pnpm@10.34.3 --activate

# Copy package files (pnpm-workspace.yaml carries the build-script allowlist for pnpm 10)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Full install (ไม่ใช้ --prod): runtime ต้องใช้ prisma CLI (devDependency) สำหรับ `migrate deploy`
RUN pnpm install --frozen-lockfile

# Copy built output — Prisma 7 client ถูก generate ไปที่ generated/prisma แล้ว
# tsc compile รวมเข้า dist (dist/src = app, dist/generated/prisma = client)
COPY --from=builder /app/dist ./dist

# Prisma schema + migrations + config (migrate deploy ต้องใช้ทั้งสามอย่าง)
COPY prisma ./prisma
COPY prisma.config.ts ./

EXPOSE 3000

# รัน migrate แล้ว start server
CMD ["sh", "-c", "pnpm exec prisma migrate deploy && node dist/src/index.js"]
