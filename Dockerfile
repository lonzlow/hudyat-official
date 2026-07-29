# syntax=docker/dockerfile:1
ARG NODE_VERSION=24.7.0

# Stage 1: Base image setup
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app
# Reduce memory usage issues during Next.js builds on restricted environments
RUN apk add --no-cache libc6-compat

# Stage 2: Install dependencies based on the preferred package manager
FROM base AS deps
COPY package*.json ./
# Use npm ci to ensure exact dependency lock matches local development
RUN --mount=type=cache,target=/root/.npm \
    npm ci --legacy-peer-deps

# Stage 3: Rebuild the source code only when needed
FROM base AS builder
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 4: Production runner stage
FROM base AS final
WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a secure, isolated service account to run the application
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Only pull the exact standalone build outputs required to execute the server
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Execute the entry point directly via Node instead of an npm script wrapper
CMD ["node", "server.js"]