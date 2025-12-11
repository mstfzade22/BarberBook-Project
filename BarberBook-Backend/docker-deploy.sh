#!/bin/bash

# Quick Docker deployment script for BarberBook Backend
# Usage: ./docker-deploy.sh

set -e

echo "🐳 BarberBook Backend - Docker Deployment"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed!"
    echo "   Install from: https://docs.docker.com/get-docker/"
    exit 1
fi

echo "✅ Docker is installed"

# Navigate to backend directory
cd "$(dirname "$0")"

# Check if .env file exists
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    
    # Generate JWT secret
    if command -v openssl &> /dev/null; then
        JWT_SECRET=$(openssl rand -base64 32)
    else
        JWT_SECRET="your_secret_key_$(date +%s)"
    fi
    
    cat > .env << EOF
# Generated on $(date)
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=http://localhost:8000
PORT=5000
EOF
    
    echo "✅ Created .env file"
    echo "   You can edit it: nano .env"
else
    echo "✅ .env file exists"
fi

echo ""
echo "🔨 Building Docker image..."
docker build -t barberbook-backend .

echo ""
echo "🧹 Removing old container (if exists)..."
docker rm -f barberbook-backend 2>/dev/null || true

echo ""
echo "🚀 Starting container..."
docker run -d \
  -p 5001:5000 \
  --env-file .env \
  --restart unless-stopped \
  -v barberbook-data:/app/src/data \
  --name barberbook-backend \
  barberbook-backend

echo ""
echo "⏳ Waiting for service to start..."
sleep 3

# Check if container is running
if docker ps | grep -q barberbook-backend; then
    echo ""
    echo "✅ Backend is running!"
    echo ""
    echo "📱 Access your API:"
    echo "   Health:     http://localhost:5001/health"
    echo "   API Base:   http://localhost:5001/api"
    echo "   Barbers:    http://localhost:5001/api/barbers"
    echo ""
    echo "📊 View logs:"
    echo "   docker logs -f barberbook-backend"
    echo ""
    echo "🛑 Stop service:"
    echo "   docker stop barberbook-backend"
    echo ""
    echo "🔄 Restart service:"
    echo "   docker restart barberbook-backend"
    echo ""
    
    # Test health endpoint
    echo "🧪 Testing health endpoint..."
    sleep 2
    if curl -s http://localhost:5001/health > /dev/null; then
        echo "✅ Health check passed!"
    else
        echo "⚠️  Health check failed, check logs"
    fi
    
    echo ""
    echo "🎉 Deployment successful!"
else
    echo ""
    echo "❌ Container failed to start!"
    echo "   Check logs: docker logs barberbook-backend"
    exit 1
fi
