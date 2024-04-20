FROM node:20 AS base

FROM base as dependencies

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

FROM base as builder

WORKDIR /app

COPY package.json tsconfig.json ./
COPY src/ ./
COPY --from=dependencies /app/node_modules ./node_modules

RUN npm run build

FROM builder as runner

WORKDIR /app

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/index.js"]