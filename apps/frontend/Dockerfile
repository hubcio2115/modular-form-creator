FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
WORKDIR /app

FROM base AS pruner
COPY . .
RUN pnpx turbo@"$(node -p "require('./package.json').devDependencies.turbo")" prune modular-form-creator-frontend --docker

FROM base AS installer
COPY --from=pruner /app/out/json/ ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ ./
ARG VITE_API_URL=http://localhost:5001
RUN echo "VITE_API_URL=${VITE_API_URL}" > apps/frontend/.env
RUN pnpm turbo run build --filter=modular-form-creator-frontend

FROM nginx:1.27-alpine AS runner
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=installer /app/apps/frontend/dist /usr/share/nginx/html
EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
