# ---------- BUILD ----------
FROM node:24-alpine AS build

WORKDIR /app

# pnpm
RUN npm install -g pnpm

# deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# source
COPY . .

# build Next.js
RUN pnpm build


# ---------- RUNNER ----------
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# usuário não-root
RUN addgroup -g 1001 nodejs \
  && adduser -u 1001 -G nodejs -s /bin/sh -D nextjs

# 🔹 Next.js (artefatos de runtime)
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# 🔥 Drizzle
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=build /app/app/_db ./app/_db

# permissões (Next + Drizzle)
RUN mkdir -p /app/.next/cache/images \
 && chown -R nextjs:nodejs /app/.next /app/app/_db

USER nextjs

EXPOSE 3000

# start correto para produção
CMD ["node", "node_modules/next/dist/bin/next", "start", "-H", "0.0.0.0", "-p", "3000"]

