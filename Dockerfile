FROM node:16-alpine AS base
ENV CI=true

RUN npm install -g pnpm
WORKDIR /root/monorepo

FROM base as dev
COPY ./pnpm-lock.yaml .
RUN pnpm fetch

COPY . .

RUN pnpm install --filter . --frozen-lockfile
RUN pnpm install --filter "@aglio/api..." --frozen-lockfile --unsafe-perm
RUN pnpm --filter "@aglio/api" run build
RUN pnpm --filter "@aglio/api" run gen

WORKDIR /root/monorepo/apps/api
EXPOSE 3001
ENV NODE_ENV=production
ENTRYPOINT ["pnpm", "start"]
