FROM python:3.11-slim

WORKDIR /app

# Install system deps + Hermes
RUN apt-get update && apt-get install -y curl git xz-utils ca-certificates && \
    curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy skills
COPY skills/ /root/.hermes/skills/

# Copy config only (NO .env — Railway injects vars at runtime)
COPY config.yaml /root/.hermes/config.yaml

# Create an empty .env so Hermes doesn't complain
RUN touch /root/.hermes/.env

# Gateway + Telegram webhook
EXPOSE 3000 8443

CMD ["hermes", "gateway"]
