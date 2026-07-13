FROM node:20-slim

WORKDIR /app

# Install Hermes Agent
RUN apt-get update && apt-get install -y curl python3 python3-pip && \
    curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash

# Install Python deps for Hermes
RUN pip3 install --break-system-packages mcp || true

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
