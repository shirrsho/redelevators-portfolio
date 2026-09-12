# syntax=docker/dockerfile:1

# ---- Base image ---------------------------------------------------------
# Next.js 16 requires Node.js >= 20.9; use the current LTS.
FROM node:22-alpine AS base
WORKDIR /app

# ---- Dependencies --------------------------------------------------------
FROM base AS deps
# libc6-compat is recommended by Next.js for Alpine-based images.
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

# ---- Build -----------------------------------------------------------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Disable Next.js telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1
# Baked in at build time, not read at container runtime: every route here
# is static/SSG (see `next build`'s own output), so metadata and robots.txt
# are resolved once, during this build, not per-request. The dev/staging
# workflow passes --build-arg NOINDEX=true; production's build never sets
# it, so this defaults to false and production is unaffected.
ARG NOINDEX=false
ENV NOINDEX=$NOINDEX
RUN npm run build

# ---- Runtime ---------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Run as a non-root user.
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Standalone output already contains a pruned node_modules, so nothing
# from the deps/builder node_modules needs to be copied separately.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# The app listens on 3000 inside the container; the host maps this to
# 6000 (see docker-compose.prod.yml).
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
EXPOSE 3000

CMD ["node", "server.js"]
