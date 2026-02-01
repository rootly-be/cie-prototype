# =============================================================================
# Multi-Stage Docker Build for CIE Website
# Story 8.1: Create Docker Multi-Stage Build
#
# Stages:
# 1. deps     - Install dependencies
# 2. builder  - Build Next.js application
# 3. runner   - Production runtime (minimal)
#
# Note: Using Debian slim instead of Alpine due to libsql native binding
#       compatibility issues with Alpine's musl libc.
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Dependencies
# Install all dependencies including devDependencies for build
# -----------------------------------------------------------------------------
FROM node:22-slim AS deps

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# -----------------------------------------------------------------------------
# Stage 2: Builder
# Build the Next.js application
# -----------------------------------------------------------------------------
FROM node:22-slim AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build-time environment variables (required for Next.js static generation)
# These are placeholder values - real values are provided at runtime
ARG AUTH_SECRET=build-time-placeholder
ENV AUTH_SECRET=$AUTH_SECRET

ARG DATABASE_URL=file:./placeholder.db
ENV DATABASE_URL=$DATABASE_URL

RUN npm run build

# -----------------------------------------------------------------------------
# Stage 3: Runner
# Minimal production image
# -----------------------------------------------------------------------------
FROM node:22-slim AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security (NFR8)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
# Public assets
COPY --from=builder /app/public ./public

# Standalone output (includes server and required node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma client (generated to src/generated/prisma) - with proper ownership (M2 fix)
COPY --from=builder --chown=nextjs:nodejs /app/src/generated ./src/generated
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@libsql ./node_modules/@libsql
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Copy entrypoint script (H1 fix: handles migrations)
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set hostname for container networking
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Health check (AC3)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

# Start the application via entrypoint (handles migrations)
CMD ["./docker-entrypoint.sh"]
