# Solana/Anchor Build Environment with Agave 2.x
# This provides a proper Linux environment with newer Rust toolchain

FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    pkg-config \
    libssl-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install Solana/Agave 2.2.20 (latest stable with Rust 1.79+)
RUN sh -c "$(curl -sSfL https://release.anza.xyz/v2.2.20/install)"
ENV PATH="/root/.local/share/solana/install/active_release/bin:${PATH}"

# Install Anchor CLI
RUN cargo install --git https://github.com/coral-xyz/anchor --tag v0.30.1 anchor-cli

# Set working directory
WORKDIR /workspace

# Default command
CMD ["anchor", "build"]
