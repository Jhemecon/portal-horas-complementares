# Build stage
FROM node:20-alpine AS builder

# Install build dependencies for native modules (better-sqlite3)
RUN apk add --no-cache python3 make g++

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

WORKDIR /app

# Copy package files first (better cache)
COPY package.json pnpm-lock.yaml ./

# Install ALL dependencies (including dev) for building
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build with optimizations using the docker-specific build command
ENV NODE_ENV=production
RUN pnpm run build:docker

# Install only production dependencies in a separate step (after build)
# This ensures native modules are compiled correctly
RUN rm -rf node_modules && \
    pnpm install --prod --frozen-lockfile

# Production stage
FROM node:20-alpine AS production

# Install runtime dependencies only (no build tools needed since we copy pre-built node_modules)
RUN apk add --no-cache ca-certificates

# Criar usuário não-privilegiado para segurança
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs appuser

WORKDIR /app

# Create data directory for SQLite database with proper permissions
RUN mkdir -p /app/data && chown -R appuser:nodejs /app

# Copy pre-built node_modules from builder (includes compiled better-sqlite3)
COPY --chown=appuser:nodejs --from=builder /app/node_modules ./node_modules

# Copy package.json for reference
COPY --chown=appuser:nodejs package.json ./

# Copy built files from builder stage
COPY --chown=appuser:nodejs --from=builder /app/dist ./dist

# Switch to non-privileged user
USER appuser

# Expose port (Easypanel typically uses port 80)
EXPOSE 80

# Set environment variables
ENV NODE_ENV=production
ENV PORT=80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start the application
CMD ["node", "dist/main.mjs"]
