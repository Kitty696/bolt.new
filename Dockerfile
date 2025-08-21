# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Install system dependencies needed for building
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    curl

# Set working directory
WORKDIR /app

# Copy package files first (for better Docker layer caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S bolt -u 1001 -G nodejs

# Change ownership of the app directory
RUN chown -R bolt:nodejs /app

# Switch to non-root user
USER bolt

# Expose port 3000
EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "start"]
