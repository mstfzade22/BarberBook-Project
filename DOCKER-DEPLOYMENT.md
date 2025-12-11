# 🐳 Docker Deployment Guide

Complete guide for deploying BarberBook backend using Docker on Render.

---

## 📋 Prerequisites

- Docker installed locally (for testing)
- GitHub account with your repository
- Render account
- Your code pushed to GitHub

---

## 🔧 Docker Configuration

Your backend is already configured with:

### Dockerfile

- **Base Image**: `node:20-alpine` (lightweight)
- **Port**: 10000 (configurable via PORT env var)
- **Health Check**: Built-in at `/health` endpoint
- **Production**: npm ci for faster, reliable builds

### .dockerignore

Excludes unnecessary files:

- `node_modules` (rebuilt in container)
- `.env` (use Render environment variables)
- `tests` (not needed in production)
- `.git` (reduces image size)

---

## 🚀 Deploy to Render with Docker

### Option 1: Using Render Blueprint (Recommended)

The `render.yaml` file is already configured for Docker deployment.

#### Step 1: Push to GitHub

```bash
git add .
git commit -m "Configure Docker deployment"
git push origin main
```

#### Step 2: Deploy via Blueprint

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New" → "Blueprint"**
3. Select your **BarberBook-Project** repository
4. Render detects `render.yaml` with Docker configuration
5. Click **"Apply"**

#### Step 3: Verify Deployment

Render will:

- ✅ Build Docker image from your Dockerfile
- ✅ Run container with environment variables
- ✅ Perform health checks
- ✅ Deploy to production

Your backend will be live at: `https://barberbook-backend.onrender.com`

---

### Option 2: Manual Docker Service Setup

If you prefer manual configuration:

#### Step 1: Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New" → "Web Service"**
3. Connect your GitHub repository

#### Step 2: Configure Service

**Basic Settings:**

- **Name**: `barberbook-backend`
- **Region**: Oregon (or closest to users)
- **Branch**: `main`
- **Environment**: `Docker`

**Docker Settings:**

- **Dockerfile Path**: `./BarberBook-Backend/Dockerfile`
- **Docker Context**: `./BarberBook-Backend`
- **Docker Command**: (leave empty, uses CMD from Dockerfile)

**Environment Variables:**

```
NODE_ENV=production
PORT=10000
JWT_SECRET=<auto-generate-or-provide-your-own>
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://barberbook-frontend.onrender.com
```

**Advanced:**

- **Health Check Path**: `/health`
- **Auto-Deploy**: Yes

#### Step 3: Deploy

Click **"Create Web Service"** and wait 3-5 minutes.

---

## 🧪 Test Docker Build Locally

Before deploying, test your Docker image locally:

### Build Image

```bash
cd BarberBook-Backend

# Build the image
docker build -t barberbook-backend .
```

### Run Container

```bash
# Run with environment variables
docker run -d \
  -p 5000:10000 \
  -e NODE_ENV=production \
  -e PORT=10000 \
  -e JWT_SECRET=your-local-test-secret \
  -e JWT_EXPIRES_IN=7d \
  --name barberbook-test \
  barberbook-backend
```

### Test Endpoints

```bash
# Health check
curl http://localhost:5000/health

# Expected response:
# {
#   "success": true,
#   "message": "BarberBook API is running",
#   "timestamp": "2025-12-11T..."
# }
```

### View Logs

```bash
docker logs barberbook-test
```

### Stop & Remove

```bash
docker stop barberbook-test
docker rm barberbook-test
```

---

## 📊 Docker Image Optimization

Your Dockerfile is already optimized with:

### Multi-stage Benefits

- ✅ Uses Alpine Linux (smaller image ~50MB vs 900MB)
- ✅ `npm ci --only=production` (no dev dependencies)
- ✅ `.dockerignore` excludes unnecessary files
- ✅ Layers cached for faster rebuilds

### Image Size

Expected final image: **~150-200 MB**

Check image size:

```bash
docker images barberbook-backend
```

---

## 🔄 Automatic CI/CD with Docker

Once deployed with Blueprint or auto-deploy enabled:

### Every Git Push Triggers:

1. 🔨 Docker image build from Dockerfile
2. 🏃 Container starts with environment variables
3. 🏥 Health check at `/health`
4. ✅ Deploy if healthy
5. 📧 Deployment notification

### Workflow

```bash
# Make changes
vim src/controllers/authController.js

# Commit and push
git add .
git commit -m "Update authentication logic"
git push origin main

# Render automatically:
# - Detects push
# - Builds new Docker image
# - Deploys new container
# - Runs health checks
```

---

## 🔍 Monitoring & Debugging

### View Logs on Render

1. Go to your service dashboard
2. Click **"Logs"** tab
3. See real-time container logs

### Health Check Monitoring

Render automatically checks: `https://barberbook-backend.onrender.com/health`

If health check fails 3 times, Render won't deploy the new version.

### Common Issues

**Build fails:**

```bash
# Check Dockerfile syntax
docker build -t test .

# Review build logs in Render dashboard
```

**Container starts but crashes:**

```bash
# Check environment variables are set
# Review logs for missing dependencies
# Verify PORT is correctly used
```

**Health check fails:**

```bash
# Test locally:
curl http://localhost:10000/health

# Ensure /health endpoint returns 200 status
# Check if app is listening on correct port
```

---

## 🔐 Environment Variables in Docker

### On Render

Set in Dashboard → Service → Environment:

- `NODE_ENV=production`
- `PORT=10000` (auto-set)
- `JWT_SECRET` (generate secure value)
- `JWT_EXPIRES_IN=7d`
- `FRONTEND_URL=https://your-frontend-url`

### Locally (for testing)

Create `.env` file (already gitignored):

```env
NODE_ENV=development
PORT=5000
JWT_SECRET=local-dev-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:8000
```

**Never commit `.env` to git!**

---

## 📦 Docker Compose (Local Development)

For local multi-container setup, check if you have `docker-compose.yml`:

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
```

---

## 🎯 Deployment Checklist

### Before Deploying

- [ ] Dockerfile tested locally
- [ ] `.dockerignore` configured
- [ ] Environment variables prepared
- [ ] Health endpoint working (`/health`)
- [ ] Code pushed to GitHub

### After Deploying

- [ ] Build completes successfully
- [ ] Container starts without errors
- [ ] Health check passes
- [ ] API endpoints accessible
- [ ] Frontend can connect to backend

---

## 🔄 Updating Your Docker Deployment

### Change Dockerfile

```bash
# Edit Dockerfile
vim BarberBook-Backend/Dockerfile

# Test locally
cd BarberBook-Backend
docker build -t test .

# Push to trigger rebuild
git add Dockerfile
git commit -m "Update Dockerfile configuration"
git push origin main
```

### Change Environment Variables

1. Go to Render Dashboard
2. Select your service
3. Go to **"Environment"** tab
4. Update variables
5. Service auto-restarts

---

## 📚 Additional Resources

- [Render Docker Deployment](https://render.com/docs/deploy-docker)
- [Dockerfile Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Node.js Guide](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Alpine Linux](https://alpinelinux.org/) (base image)

---

## 🆚 Docker vs Node Deployment

### Why Docker?

**Advantages:**

- ✅ **Consistency**: Same environment everywhere
- ✅ **Isolation**: Dependencies contained
- ✅ **Reproducible**: Exact image versioning
- ✅ **Flexibility**: Easy to switch hosting platforms
- ✅ **Control**: Full control over environment

**Disadvantages:**

- ⚠️ Slightly larger build size
- ⚠️ Longer build time (first build)

### Why Node (native)?

**Advantages:**

- ✅ Faster cold starts
- ✅ Smaller disk footprint
- ✅ Simpler configuration

**Disadvantages:**

- ⚠️ Platform-dependent builds
- ⚠️ Less control over environment

**Recommendation**: Use Docker for production deployments!

---

## 🎓 Learning More

### View Running Container

```bash
# List containers
docker ps

# Inspect container
docker inspect barberbook-backend

# Enter container shell
docker exec -it barberbook-backend sh
```

### Docker Commands Cheat Sheet

```bash
# Build
docker build -t name .

# Run
docker run -p 5000:10000 name

# Logs
docker logs container-name

# Stop
docker stop container-name

# Remove
docker rm container-name

# Remove image
docker rmi image-name

# Clean up
docker system prune -a
```

---

## ✅ Success!

Your backend is now deployed with Docker on Render! 🎉

**Test it:**

```bash
curl https://barberbook-backend.onrender.com/health
```

**Next steps:**

1. Update frontend to use production API URL
2. Test all endpoints
3. Monitor logs
4. Enjoy automatic deployments! 🚀
