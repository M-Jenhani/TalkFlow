FROM python:3.11-alpine AS builder

# Install build dependencies
RUN apk add --no-cache build-base

# Set the working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Final runtime image
FROM python:3.11-alpine

# Set the working directory
WORKDIR /app

# Copy installed dependencies from the builder stage
COPY --from=builder /install /usr/local

# Copy application files
COPY . .

# Command to run the application
CMD ["./start.sh"]
