FROM python:3.11-slim AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy requirements.txt from the backend directory
COPY requirements.txt .
# Install Python dependencies with size optimizations
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt && \
    find /install -type d -name "tests" -exec rm -rf {} + 2>/dev/null || true && \
    find /install -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true && \
    find /install -type f -name "*.pyc" -delete

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
    rm -rf /usr/local/share/doc /usr/local/share/man

# Set working directory to backend
WORKDIR /app/backend

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
