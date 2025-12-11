# BarberBook - Render Deployment Guide

This guide will help you deploy both the **frontend** and **backend** of the BarberBook project to Render.

## 📋 Prerequisites

1. **GitHub Account**: Push your code to GitHub
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Environment Variables**: Prepare your JWT secret

---

## 🚀 Deployment Steps

### Step 1: Prepare Your GitHub Repository

1. **Create a GitHub repository** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/BarberBook-Project.git
   git push -u origin main
   ```

---

### Step 2: Deploy Backend to Render

#### 2.1 Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

   **Basic Settings:**

   - **Name**: `barberbook-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `BarberBook-Backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

   **Instance Type:**

   - Select **Free** tier (for testing) or **Starter** (for production)

#### 2.2 Add Environment Variables

In the **Environment** section, add:

| Key            | Value                                                                         |
| -------------- | ----------------------------------------------------------------------------- |
| `PORT`         | `10000` (Render default)                                                      |
| `NODE_ENV`     | `production`                                                                  |
| `JWT_SECRET`   | `your_super_secret_jwt_key_change_this!`                                      |
| `JWT_EXPIRE`   | `7d`                                                                          |
| `FRONTEND_URL` | `https://barberbook-frontend.onrender.com` (update after frontend deployment) |

#### 2.3 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (2-5 minutes)
3. **Copy the backend URL**: `https://barberbook-backend.onrender.com`

---

### Step 3: Deploy Frontend to Render

#### 3.1 Create Static Site

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository
4. Configure the site:

   **Basic Settings:**

   - **Name**: `barberbook-frontend`
   - **Branch**: `main`
   - **Root Directory**: `BarberBook`
   - **Build Command**: Leave empty (static HTML)
   - **Publish Directory**: `.` (current directory)

#### 3.2 Deploy

1. Click **"Create Static Site"**
2. Wait for deployment (1-2 minutes)
3. **Copy the frontend URL**: `https://barberbook-frontend.onrender.com`

---

### Step 4: Update Frontend API URL

After deploying the backend, you need to update the frontend to use the production API URL.

#### Option A: Environment-Based Configuration (Recommended)

Update `BarberBook/app.js`:

```javascript
// Replace the first line
const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5001/api"
    : "https://barberbook-backend.onrender.com/api";
```

#### Option B: Direct Update

Replace in `BarberBook/app.js`:

```javascript
// Change from:
const API_BASE_URL = "http://localhost:5001/api";

// To:
const API_BASE_URL = "https://barberbook-backend.onrender.com/api";
```

**Then commit and push:**

```bash
git add BarberBook/app.js
git commit -m "Update API URL for production"
git push origin main
```

Render will automatically redeploy the frontend.

---

### Step 5: Update Backend CORS Settings

Update the `FRONTEND_URL` environment variable in your backend on Render:

1. Go to your backend service on Render
2. Navigate to **Environment** tab
3. Update `FRONTEND_URL` to your actual frontend URL:
   ```
   https://barberbook-frontend.onrender.com
   ```
4. Save changes (this will trigger a redeploy)

---

## 🔧 Configuration Files

### Backend: `.env` (Local Development Only)

Create `BarberBook-Backend/.env`:

```env
PORT=5001
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:8000
```

**⚠️ Important**: Add `.env` to `.gitignore` - never commit secrets!

---

## 📝 Important Notes

### Free Tier Limitations

- **Backend (Web Service)**:

  - ⚠️ Spins down after 15 minutes of inactivity
  - First request after spin-down takes 30-60 seconds
  - 750 hours/month free (basically unlimited)

- **Frontend (Static Site)**:
  - ✅ Always available
  - ✅ No spin-down issues
  - Fast CDN delivery

### Data Persistence

Your current setup uses JSON files for data storage. On Render's free tier:

- ⚠️ **Data will be lost when the service restarts**
- Each deployment or spin-down/up cycle resets data files

**Solutions:**

1. **Upgrade to Paid Plan**: Persistent disk storage ($7/month)
2. **Use External Database**: MongoDB Atlas (free tier), PostgreSQL on Render
3. **For Demo Only**: Accept data loss (users will need to re-register)

---

## 🧪 Testing Your Deployment

### Test Backend

```bash
# Health check
curl https://barberbook-backend.onrender.com/api/barbers

# Should return list of barbers
```

### Test Frontend

1. Visit: `https://barberbook-frontend.onrender.com`
2. Test registration and login
3. Try booking an appointment

---

## 🐛 Troubleshooting

### Issue: CORS Errors

**Symptom**: Frontend can't connect to backend

**Fix**:

1. Verify `FRONTEND_URL` in backend environment variables
2. Check browser console for exact error
3. Ensure CORS is properly configured in `src/app.js`

### Issue: 404 on Backend

**Symptom**: API endpoints return 404

**Fix**:

1. Check **Root Directory** is set to `BarberBook-Backend`
2. Verify **Start Command** is `npm start`
3. Check logs in Render dashboard

### Issue: Service Unavailable (503)

**Symptom**: Backend not responding

**Fix**:

- Free tier spun down - wait 30-60 seconds for wake-up
- Check Render logs for startup errors
- Verify all environment variables are set

### Issue: Data Lost After Restart

**Symptom**: Users and appointments disappear

**Fix**:

- Expected behavior on free tier without persistent disk
- Upgrade to paid plan or migrate to database

---

## 🔄 Continuous Deployment

Render automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Render auto-deploys in 1-5 minutes
```

---

## 📊 Monitoring

### View Logs

1. Go to Render Dashboard
2. Select your service
3. Click **Logs** tab
4. Monitor real-time output

### Check Deployment Status

- **Deploy** tab shows deployment history
- Green checkmark = successful
- Red X = failed (check logs)

---

## 🔐 Security Checklist

- ✅ Use strong JWT_SECRET (random, 32+ characters)
- ✅ Set NODE_ENV to 'production'
- ✅ Never commit .env file
- ✅ Use HTTPS URLs (Render provides free SSL)
- ✅ Verify CORS settings restrict origins
- ✅ Keep dependencies updated (`npm audit`)

---

## 💡 Recommended Upgrades

### For Production Use:

1. **Persistent Storage** ($7/month):

   - Add persistent disk to backend
   - Or migrate to MongoDB Atlas (free tier available)

2. **Custom Domain**:

   - Link your domain: `www.barberbook.com`
   - Free SSL included

3. **Monitoring**:

   - Set up health checks
   - Configure alerts for downtime

4. **Performance**:
   - Upgrade to Starter plan (no spin-down)
   - Add Redis caching
   - Optimize API responses

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Status Page**: https://status.render.com

---

## 🎯 Quick Reference

### Your Deployed URLs

- **Frontend**: `https://barberbook-frontend.onrender.com`
- **Backend**: `https://barberbook-backend.onrender.com`
- **API Base**: `https://barberbook-backend.onrender.com/api`

### Demo Accounts (After First Deployment)

You'll need to register new users on the deployed site, or pre-populate data files.

---

**🎉 Congratulations! Your BarberBook app is now live!**

Share your frontend URL with users to start taking bookings!
