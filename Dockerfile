FROM --platform=linux/amd64 node:22-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=development

RUN apk update && apk upgrade && \
    apk add --no-cache libc6-compat dumb-init python3 make g++

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY package.json ./

RUN npm install --include=dev --no-package-lock

COPY . .

ENV MONGO_CONNECTION_URL=mongodb://localhost:27017
ENV MONGONAUT_READONLY=false
ENV MONGONAUT_TIMEOUT=5000

ENV NODE_ENV=production

RUN npm run build

FROM --platform=linux/amd64 node:22-alpine
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN apk update && apk upgrade && apk add --no-cache libc6-compat dumb-init

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

EXPOSE 80
ENV PORT=80
ENV HOSTNAME="0.0.0.0"

USER nextjs

CMD ["dumb-init", "node", "server.js"]