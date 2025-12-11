# 🐳 Backend Docker Deployment Guide

Quick guide to deploy your BarberBook backend using Docker.

## 📦 What You Have

✅ **Dockerfile** - Already configured in `BarberBook-Backend/`
✅ **.dockerignore** - Optimizes build process
✅ **Health Check** - Built into Docker image

---

## 🚀 Quick Start

### Local Deployment (Test First)

```bash
cd BarberBook-Backend

# Build the image
docker build -t barberbook-backend .

# Run the container
docker run -d \
  -p 5001:5000 \
  -e JWT_SECRET="your_secret_key_here" \
  -e NODE_ENV=production \
  -e FRONTEND_URL=http://localhost:8000 \
  --name barberbook-backend \
  barberbook-backend

# Check if it's running
docker ps

# View logs
docker logs -f barberbook-backend

# Test the API
curl http://localhost:5001/health
curl http://localhost:5001/api/barbers
```

### Stop and Clean Up

```bash
# Stop container
docker stop barberbook-backend

# Remove container
docker rm barberbook-backend

# Remove image (optional)
docker rmi barberbook-backend
```

---

## ☁️ Deploy to Cloud Platforms

### Option 1: Render.com (Easiest)

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Add Docker deployment"
   git push origin main
   ```

2. **Create Web Service on Render**
   - Go to https://dashboard.render.com
   - Click **"New +" → "Web Service"**
   - Connect your GitHub repository
   - Configure:
     - **Name**: `barberbook-backend`
     - **Runtime**: **Docker** (Important!)
     - **Dockerfile Path**: `BarberBook-Backend/Dockerfile`
     - **Docker Context**: `BarberBook-Backend`
3. **Environment Variables**
   | Key | Value |
   |-----|-------|
   | `JWT_SECRET` | Generate: `openssl rand -base64 32` |
   | `NODE_ENV` | `production` |
   | `JWT_EXPIRE` | `7d` |
   | `FRONTEND_URL` | Your frontend URL |

4. **Deploy!**
   - Click "Create Web Service"
   - Get your URL: `https://barberbook-backend.onrender.com`

---

### Option 2: DigitalOcean App Platform

1. **Connect GitHub Repository**

   - Go to https://cloud.digitalocean.com/apps
   - Click "Create App"
   - Select your repository

2. **Configure Component**

   - **Type**: Web Service
   - **Source Directory**: `BarberBook-Backend`
   - **Resource Type**: Docker
   - **Dockerfile**: `Dockerfile`
   - **HTTP Port**: `5000`

3. **Add Environment Variables**

   ```
   JWT_SECRET=<your-secret>
   NODE_ENV=production
   JWT_EXPIRE=7d
   ```

4. **Deploy** - Takes 2-5 minutes

---

### Option 3: AWS ECS (Advanced)

1. **Create ECR Repository**

   ```bash
   aws ecr create-repository --repository-name barberbook-backend
   ```

2. **Build and Push Image**

   ```bash
   # Login to ECR
   aws ecr get-login-password --region us-east-1 | \
     docker login --username AWS --password-stdin \
     YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com

   # Build image
   cd BarberBook-Backend
   docker build -t barberbook-backend .

   # Tag image
   docker tag barberbook-backend:latest \
     YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/barberbook-backend:latest

   # Push image
   docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/barberbook-backend:latest
   ```

3. **Create ECS Task Definition**

   - Use AWS Console or CLI
   - Set container port: 5000
   - Add environment variables
   - Set memory/CPU limits

4. **Create ECS Service**
   - Configure load balancer
   - Set desired task count
   - Configure auto-scaling (optional)

---

### Option 4: VPS with Docker (Ubuntu)

1. **Connect to VPS**

   ```bash
   ssh user@your-server-ip
   ```

2. **Install Docker**

   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   # Logout and login again
   ```

3. **Clone Repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/BarberBook-Project.git
   cd BarberBook-Project/BarberBook-Backend
   ```

4. **Create .env file**

   ```bash
   nano .env
   ```

   Add:

   ```env
   JWT_SECRET=your_super_secret_key_here
   NODE_ENV=production
   JWT_EXPIRE=7d
   FRONTEND_URL=https://yourdomain.com
   ```

5. **Build and Run**

   ```bash
   docker build -t barberbook-backend .
   docker run -d \
     -p 5001:5000 \
     --env-file .env \
     --restart unless-stopped \
     --name barberbook-backend \
     -v barberbook-data:/app/src/data \
     barberbook-backend
   ```

6. **Set Up Nginx Reverse Proxy**

   ```bash
   sudo apt install nginx -y
   sudo nano /etc/nginx/sites-available/barberbook-api
   ```

   Add:

   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:5001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

   Enable:

   ```bash
   sudo ln -s /etc/nginx/sites-available/barberbook-api /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. **Install SSL Certificate**

   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d api.yourdomain.com
   ```

8. **Set Up Auto-Start**
   ```bash
   # Docker container already has --restart unless-stopped
   # Verify:
   docker ps
   ```

---

## 🔧 Docker Commands Reference

### Build & Run

```bash
# Build image
docker build -t barberbook-backend .

# Run with environment variables
docker run -d \
  -p 5001:5000 \
  -e JWT_SECRET="secret" \
  -e NODE_ENV=production \
  --name barberbook-backend \
  barberbook-backend

# Run with .env file
docker run -d \
  -p 5001:5000 \
  --env-file .env \
  --name barberbook-backend \
  barberbook-backend

# Run with volume for data persistence
docker run -d \
  -p 5001:5000 \
  --env-file .env \
  -v barberbook-data:/app/src/data \
  --name barberbook-backend \
  barberbook-backend
```

### Management

```bash
# List running containers
docker ps

# List all containers
docker ps -a

# View logs
docker logs barberbook-backend

# Follow logs (real-time)
docker logs -f barberbook-backend

# Stop container
docker stop barberbook-backend

# Start container
docker start barberbook-backend

# Restart container
docker restart barberbook-backend

# Remove container
docker rm barberbook-backend

# Remove container (force)
docker rm -f barberbook-backend

# Execute command inside container
docker exec -it barberbook-backend sh

# Inspect container
docker inspect barberbook-backend

# Check container stats
docker stats barberbook-backend
```

### Images

```bash
# List images
docker images

# Remove image
docker rmi barberbook-backend

# Remove unused images
docker image prune

# Build without cache
docker build --no-cache -t barberbook-backend .

# Tag image
docker tag barberbook-backend:latest barberbook-backend:v1.0

# Save image to file
docker save barberbook-backend > barberbook-backend.tar

# Load image from file
docker load < barberbook-backend.tar
```

### Data & Volumes

```bash
# List volumes
docker volume ls

# Create volume
docker volume create barberbook-data

# Inspect volume
docker volume inspect barberbook-data

# Remove volume
docker volume rm barberbook-data

# Backup volume
docker run --rm \
  -v barberbook-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/backup.tar.gz /data

# Restore volume
docker run --rm \
  -v barberbook-data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/backup.tar.gz -C /
```

---

## 🧪 Testing Your Deployment

### Health Check

```bash
# Test health endpoint
curl http://localhost:5001/health

# Expected response:
# {"success":true,"message":"BarberBook API is running","timestamp":"..."}
```

### API Endpoints

```bash
# Get all barbers
curl http://localhost:5001/api/barbers

# Register user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "+1234567890"
  }'

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs barberbook-backend

# Common issues:
# - Missing JWT_SECRET environment variable
# - Port 5000 already in use
# - Syntax error in code
```

### Port Already in Use

```bash
# Find what's using port 5001
lsof -i :5001

# Kill the process
kill -9 PID

# Or use different port
docker run -d -p 5002:5000 ...
```

### Can't Connect to Container

```bash
# Check if container is running
docker ps

# Check port mapping
docker port barberbook-backend

# Check container IP
docker inspect barberbook-backend | grep IPAddress

# Test from host
curl http://localhost:5001/health
```

### Data Lost After Restart

```bash
# Use volume for persistence
docker run -d \
  -v barberbook-data:/app/src/data \
  ...
```

### Build Fails

```bash
# Check .dockerignore file
# Clear cache and rebuild
docker build --no-cache -t barberbook-backend .

# Check for errors in package.json
# Verify Node.js version compatibility
```

---

## 🔒 Security Best Practices

1. **Use Strong JWT Secret**

   ```bash
   openssl rand -base64 32
   ```

2. **Don't Expose Internal Ports**

   ```bash
   # Good (only accessible via reverse proxy)
   docker run -d -p 127.0.0.1:5001:5000 ...

   # Bad (accessible from anywhere)
   docker run -d -p 5001:5000 ...
   ```

3. **Run as Non-Root User**

   - Already configured in Dockerfile

4. **Keep Images Updated**

   ```bash
   docker pull node:20-alpine
   docker build -t barberbook-backend .
   ```

5. **Scan for Vulnerabilities**

   ```bash
   docker scan barberbook-backend
   ```

6. **Use Secrets Management**
   ```bash
   # Use Docker secrets (Swarm mode)
   echo "my_secret" | docker secret create jwt_secret -
   ```

---

## 📊 Monitoring

### Container Health

```bash
# Check health status
docker inspect --format='{{.State.Health.Status}}' barberbook-backend

# View health check logs
docker inspect barberbook-backend | grep -A 10 Health
```

### Resource Usage

```bash
# Live stats
docker stats barberbook-backend

# Limit resources
docker run -d \
  --memory="512m" \
  --cpus="1.0" \
  ...
```

### Logs

```bash
# View last 100 lines
docker logs --tail 100 barberbook-backend

# Follow logs with timestamps
docker logs -f --timestamps barberbook-backend

# Filter logs
docker logs barberbook-backend 2>&1 | grep ERROR
```

---

## 🚀 Production Deployment Checklist

- [ ] Strong JWT_SECRET generated
- [ ] Environment variables configured
- [ ] Docker image built successfully
- [ ] Container runs without errors
- [ ] Health check passes
- [ ] API endpoints respond correctly
- [ ] Data persistence configured (volume)
- [ ] Reverse proxy set up (Nginx)
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Monitoring set up
- [ ] Backup strategy implemented
- [ ] Auto-restart configured
- [ ] Logs being collected
- [ ] Security scan performed

---

## 📝 Quick Reference

```bash
# Build
docker build -t barberbook-backend .

# Run
docker run -d -p 5001:5000 --env-file .env --name barberbook-backend barberbook-backend

# Logs
docker logs -f barberbook-backend

# Stop
docker stop barberbook-backend

# Remove
docker rm barberbook-backend

# Update & Redeploy
git pull
docker build -t barberbook-backend .
docker stop barberbook-backend
docker rm barberbook-backend
docker run -d -p 5001:5000 --env-file .env --restart unless-stopped --name barberbook-backend barberbook-backend
```

---

**🎉 Your backend is now ready for Docker deployment!**

Choose your deployment platform and follow the corresponding section above.
