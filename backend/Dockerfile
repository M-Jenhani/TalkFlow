FROM python:3.11-slim AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy requirements.txt from the backend directory
COPY backend/requirements.txt .

# Install Python dependencies (CPU-only PyTorch to reduce size)
RUN pip install --no-cache-dir --prefix=/install \
    torch==2.1.2 torchvision==0.16.2 \
    && pip install --no-cache-dir --prefix=/install -r requirements.txt \
    && strip /install/lib/*/site-packages/torch/**/*.so 2>/dev/null || true \
    && strip /install/lib/*/site-packages/torchvision/**/*.so 2>/dev/null || true \
    && find /install -type d -name "tests" -exec rm -rf {} + 2>/dev/null || true \
    && find /install -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true \
    && find /install -type f -name "*.pyc" -delete \
    && find /install -type d -name "*.dist-info" -exec rm -rf {} + 2>/dev/null || true \
    && find /install -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true \
    && find /install/lib -type d -name "examples" -exec rm -rf {} + 2>/dev/null || true \
    && find /install/lib -type d -name "test*" -exec rm -rf {} + 2>/dev/null || true

# Final runtime image
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Copy installed dependencies from the builder stage
COPY --from=builder /install /usr/local

# Copy application files (exclude large unnecessary files)
COPY . .

# Copy .env file if it exists
COPY .env* ./

# Clean up unnecessary files
RUN find /usr/local -type d -name "tests" -exec rm -rf {} + 2>/dev/null || true && \
    find /usr/local -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true && \
    find /usr/local -type f -name "*.pyc" -delete && \
    find /usr/local -type d -name "*.dist-info" -exec rm -rf {} + 2>/dev/null || true && \
    find /usr/local -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true && \
    rm -rf /usr/local/share/doc /usr/local/share/man /usr/local/share/info && \
    find /usr/local/lib -type d -name "examples" -exec rm -rf {} + 2>/dev/null || true && \
    find /usr/local/lib -type d -name "test*" -exec rm -rf {} + 2>/dev/null || true && \
    python3 -m compileall -b -q /usr/local 2>/dev/null || true

# Set working directory to backend
WORKDIR /app/backend

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
