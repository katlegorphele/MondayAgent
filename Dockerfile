FROM node:20-slim

WORKDIR /app

# Copy and install Next.js app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm install --frozen-lockfile || pnpm install

COPY . .

# Build Next.js
RUN pnpm build

# Expose web UI port
EXPOSE 3000

# Start Next.js (Hermes will be started separately or as a sidecar)
CMD ["pnpm", "start"]
