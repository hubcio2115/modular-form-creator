FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
WORKDIR /app

FROM base AS pruner
COPY . .
RUN pnpx turbo@"$(node -p "require('./package.json').devDependencies.turbo")" prune modular-form-creator-backend --docker

FROM base AS installer
COPY --from=pruner /app/out/json/ ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ ./
RUN pnpm turbo run build --filter=modular-form-creator-backend

FROM base AS runner
COPY --from=pruner /app/out/json/ ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --prod --frozen-lockfile

COPY --from=installer /app/apps/backend/dist ./apps/backend/dist

WORKDIR /app/apps/backend
EXPOSE 5001
CMD ["node", "dist/server.js"]
