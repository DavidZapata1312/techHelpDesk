# Stage 1: build
FROM node:18-alpine AS builder

WORKDIR /app

# Instalar dependencias (se usa package.json)
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm ci --silent

# Copiar el resto del código y compilar
COPY . .
RUN npm run build

# Eliminar dependencias de dev para la imagen final
RUN npm prune --production --silent || true

# Stage 2: runtime
FROM node:18-alpine
WORKDIR /app

ENV NODE_ENV=production

# Copiar los artefactos compilados y node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

EXPOSE 3000

# Ejecutar la app en modo producción
CMD ["node", "dist/main"]

