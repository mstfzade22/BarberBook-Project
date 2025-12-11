# 🚀 Quick Deployment Reference

## Files Created for CI/CD

### 1. `render.yaml` - Blueprint Configuration

Defines infrastructure as code for both services:

- **Backend**: Docker container with health checks and auto-deploy
- **Frontend**: Static site with automatic routing

### 2. `DEPLOYMENT.md` - Complete Deployment Guide

Step-by-step instructions for deploying to Render with CI/CD

### 3. `DOCKER-DEPLOYMENT.md` - Docker-Specific Guide

Complete guide for Docker deployment on Render or any platform

### 4. `BarberBook/config.js` - Environment Configuration

Auto-detects local vs production and sets correct API URLs

---

## 🎯 Deploy Now (3 Steps)

### Step 1: Commit & Push

```bash
git add .
git commit -m "Add Render CI/CD configuration"
git push origin main
```

### Step 2: Deploy on Render

1. Go to https://dashboard.render.com
2. Click **"New" → "Blueprint"**
3. Select your **BarberBook-Project** repository
4. Click **"Apply"**

### Step 3: Set Environment Variables

Render will prompt for:

- `JWT_SECRET` - Auto-generated (or provide your own)

That's it! ✅

---

## 📡 Automatic Deployments

After initial setup, every `git push` will:

1. Trigger automatic deployment
2. Build both services
3. Run health checks
4. Deploy if successful
5. Send you notifications

---

## 🔗 Your URLs

After deployment:

- **Frontend**: `https://barberbook-frontend.onrender.com`
- **Backend API**: `https://barberbook-backend.onrender.com`
- **Health Check**: `https://barberbook-backend.onrender.com/health`

---

## 📝 What Each Service Does

### Backend Service (barberbook-backend)

- **Type**: Web Service (Docker Container)
- **Build**: Docker builds from `BarberBook-Backend/Dockerfile`
- **Image**: Node.js 20 Alpine Linux (~150MB)
- **Port**: 10000
- **Health**: `/health` endpoint with auto-checks

### Frontend Service (barberbook-frontend)

- **Type**: Static Site
- **Publishes**: `BarberBook/` directory
- **Routes**: SPA routing configured
- **API**: Auto-connects to backend

---

## 🐳 Docker Deployment

Your backend now deploys using Docker:

**Benefits:**

- ✅ Consistent environment everywhere
- ✅ Production-optimized Alpine image
- ✅ Built-in health checks
- ✅ Easy to test locally

**Test locally:**

```bash
cd BarberBook-Backend
docker build -t barberbook-backend .
docker run -p 5000:10000 -e PORT=10000 barberbook-backend
```

**See full guide:** `DOCKER-DEPLOYMENT.md`

---

## 🔧 Update Frontend for Production

Your frontend is already configured! The `config.js` file automatically:

- Uses `localhost:5000` when running locally
- Uses `https://barberbook-backend.onrender.com` in production

Just include it in your HTML:

```html
<script src="config.js"></script>
<script src="app.js"></script>
```

Then use `API_ENDPOINTS` in your JavaScript:

```javascript
// Instead of hardcoded URLs
fetch(API_ENDPOINTS.LOGIN, {
  method: "POST",
  // ...
});
```

---

## 🐛 Troubleshooting

### Backend not starting?

- Check logs in Render dashboard
- Verify environment variables are set
- Ensure `package.json` has correct start script

### Frontend can't reach API?

- Check `config.js` is loaded before `app.js`
- Verify backend URL in production
- Check browser console for CORS errors

### Free tier sleeping?

- Free services sleep after 15 min inactivity
- First request takes 30-60 seconds to wake up
- Consider upgrading for production use

---

## 📚 Full Documentation

- **Detailed Guide**: See `DEPLOYMENT.md`
- **Render Docs**: https://render.com/docs
- **Blueprint Spec**: https://render.com/docs/blueprint-spec

---

## ✅ Checklist

Before deploying:

- [ ] Code pushed to GitHub
- [ ] `render.yaml` in repository root
- [ ] Backend has health check at `/health`
- [ ] Frontend `config.js` included in HTML files
- [ ] Environment variables ready (JWT_SECRET)

After deploying:

- [ ] Test health endpoint
- [ ] Test API endpoints
- [ ] Test frontend loads
- [ ] Test full booking flow
- [ ] Check deployment logs

---

**Need help?** See `DEPLOYMENT.md` or Render support at https://render.com/support
