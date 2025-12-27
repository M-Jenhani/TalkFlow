FROM python:3.11-slim AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy requirements.txt from the backend directory
COPY requirements.txt .

# Install Python dependencies (CPU-only PyTorch to reduce size)
RUN pip install --no-cache-dir --prefix=/install \
    torch==2.1.2 torchvision==0.16.2 \
    && pip install --no-cache-dir --prefix=/install -r requirements.txt \
    && find /install -type f -name "*.so" -exec strip -s {} \; 2>/dev/null || true \
    && find /install -type d \( -name "tests" -o -name "__pycache__" -o -name "*.dist-info" -o -name "*.egg-info" -o -name "examples" -o -name "test" -o -name ".pytest_cache" \) -exec rm -rf {} + 2>/dev/null || true \
    && find /install -type f -name "*.pyc" -delete \
    && find /install -type f -name "*.pyo" -delete \
    && find /install -type f -name "*.pyd" -delete \
    && find /install -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true

# Final runtime image
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Copy installed dependencies from the builder stage
COPY --from=builder /install /usr/local

# Copy only the backend application (not frontend, docs, etc.)
COPY backend/app ./app
COPY backend/.env* ./

# Minimal cleanup of installed dependencies
RUN find /usr/local -type f -name "*.so" -exec strip -s {} \; 2>/dev/null || true && \
    find /usr/local -type d \( -name "tests" -o -name "__pycache__" -o -name "*.dist-info" -o -name "*.egg-info" -o -name "examples" -o -name "test" -o -name ".pytest_cache" -o -name "docs" \) -exec rm -rf {} + 2>/dev/null || true && \
    find /usr/local -type f \( -name "*.pyc" -o -name "*.pyo" -o -name "*.pyd" \) -delete && \
    rm -rf /usr/local/share/doc /usr/local/share/man /usr/local/share/info && \
    rm -rf /usr/local/lib/python*/site-packages/torch/test* && \
    rm -rf /usr/local/lib/python*/site-packages/torchvision/test* && \
    rm -rf /usr/local/lib/python*/site-packages/*/tests && \
    rm -rf /usr/local/include && \
    find /usr/local -name "*.a" -delete && \
    find /usr/local -name "*.la" -delete

# Set working directory to backend
WORKDIR /app/backend

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
