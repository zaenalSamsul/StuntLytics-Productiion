FROM node:22-bookworm-slim AS deps
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm config set registry https://registry.npmjs.org/ \
    && npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm config set fetch-timeout 600000

RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

FROM node:22-bookworm-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json next.config.mjs next-env.d.ts tsconfig.json postcss.config.mjs components.json ./
COPY app ./app
COPY components ./components
COPY lib ./lib
COPY public ./public
COPY scripts/cleanup-legacy-routes.mjs scripts/validate-routes.mjs ./scripts/
RUN npm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
EXPOSE 3000
CMD ["./node_modules/.bin/next", "start", "-H", "0.0.0.0", "-p", "3000"]
