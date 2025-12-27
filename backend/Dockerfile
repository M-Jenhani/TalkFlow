FROM python:3.11-slim AS builder

# Install minimal build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /install

# Copy requirements.txt from the backend directory
COPY backend/requirements.txt .

# Install dependencies with aggressive optimization
RUN pip install --no-cache-dir \
    --prefix /install \
    --no-deps \
    --disable-pip-version-check \
    -r requirements.txt && \
    # Remove unnecessary files
    find /install -type d -name "tests" -exec rm -rf {} + 2>/dev/null || true && \
    find /install -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true && \
    find /install -name "*.pyc" -delete && \
    find /install -name "*.dist-info/top_level.txt" -delete && \
    find /install -type f -name "*.so" -exec strip {} \; 2>/dev/null || true

# Final runtime image
FROM python:3.11-slim

WORKDIR /app

# Install only essential runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy installed dependencies from the builder stage
COPY --from=builder /install /usr/local

# Copy only necessary application files
COPY backend/app /app/backend/app
COPY backend/requirements.txt /app/backend/
COPY backend/.env* /app/backend/ 2>/dev/null || true

WORKDIR /app/backend

# Disable Python bytecode compilation and buffering
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
