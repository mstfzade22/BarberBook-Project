# 🚀 Single Render Project Deployment Guide - BarberBook

Deploy both frontend and backend as a **single unified Render Web Service**. The backend serves both the API and static frontend files.

## 📋 Architecture

```
┌─────────────────────────────────┐
│   Render Web Service (Node.js)  │
├─────────────────────────────────┤
│  ┌──────────────────────────┐  │
│  │   Express Backend        │  │
│  │   - API Routes (/api/*)  │  │
│  │   - Health Check         │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │   Static Frontend        │  │
│  │   - HTML/CSS/JS          │  │
│  │   - Served from root (/) │  │
│  └──────────────────────────┘  │
└─────────────────────────────────┘
```

**Benefits:**

- ✅ Single deployment
- ✅ No CORS issues (same origin)
- ✅ Simpler configuration
- ✅ One URL for everything
- ✅ Lower cost (one service instead of two)

---

## 🚀 Deployment Steps

### Step 1: Push to GitHub

```bash
cd "/Users/ayxanmirzayev/Documents/React Projects/BarberBook-Project"

# Initialize git if needed
git init
git add .
git commit -m "Unified Render deployment setup"

# Create GitHub repository at https://github.com/new
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/BarberBook-Project.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository**

   - Authorize Render to access your GitHub
   - Select `BarberBook-Project` repository

4. **Configure the service:**

   **Basic Settings:**

   - **Name**: `barberbook` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty (uses project root)
   - **Runtime**: `Node`

   **Build & Deploy:**

   - **Build Command**:

     ```bash
     cd BarberBook-Backend && npm install && mkdir -p public && cp -r ../BarberBook/* public/ && rm -f public/app-local.js.backup
     ```

   - **Start Command**:
     ```bash
     cd BarberBook-Backend && npm start
     ```

   **Instance Type:**

   - Select **Free** tier (or Starter for production)

5. **Add Environment Variables:**

   Click "Advanced" → "Add Environment Variable":

   | Key            | Value                               |
   | -------------- | ----------------------------------- |
   | `PORT`         | `10000` (Render provides this)      |
   | `NODE_ENV`     | `production`                        |
   | `JWT_SECRET`   | Generate strong secret (see below)  |
   | `JWT_EXPIRE`   | `7d`                                |
   | `FRONTEND_URL` | Leave empty or use your service URL |

   **Generate JWT_SECRET:**

   ```bash
   # On Mac/Linux
   openssl rand -base64 32

   # Or use any strong random string (32+ characters)
   ```

6. **Health Check Path** (optional but recommended):

   - Set to: `/health`

7. **Click "Create Web Service"**

### Step 3: Wait for Deployment

- Render will build and deploy (2-5 minutes)
- Watch the logs for any errors
- Once deployed, you'll get a URL like: `https://barberbook.onrender.com`

### Step 4: Test Your Application

1. **Visit your Render URL**: `https://your-app.onrender.com`
2. You should see the BarberBook homepage
3. Test the features:
   - Register a new account
   - Login
   - Browse barbers
   - Book an appointment

---

## 📁 Project Structure for Deployment

The deployment works like this:

```
BarberBook-Project/
├── render.yaml                    # Render configuration (optional)
├── BarberBook/                    # Frontend files
│   ├── index.html
│   ├── app.js                     # Updated to use /api
│   ├── styles.css
│   └── ...
└── BarberBook-Backend/            # Backend
    ├── package.json
    ├── src/
    │   ├── app.js                 # Serves frontend from /public
    │   └── ...
    └── public/                    # Frontend copied here during build
        └── (frontend files)
```

---

## 🔧 Alternative: Using render.yaml (Blueprint)

If you want Infrastructure as Code, use the included `render.yaml`:

1. **The file is already created** in your project root

2. **Deploy via Blueprint:**

   - In Render Dashboard, click "New +" → "Blueprint"
   - Connect your repository
   - Render will automatically detect `render.yaml`
   - Click "Apply"

3. **Benefits:**
   - Version controlled configuration
   - Easy redeployment
   - Consistent environments

---

## ⚙️ Configuration Details

### Backend Changes (Already Applied)

The backend (`BarberBook-Backend/src/app.js`) now:

1. **Serves static files** from `/public` directory
2. **Routes `/api/*`** to backend API
3. **Routes everything else** to `index.html` (SPA support)

```javascript
// In production, serve static files
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../../public");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}
```

### Frontend Changes (Already Applied)

The frontend (`BarberBook/app.js`) now uses:

```javascript
// Relative API path for production (same domain)
const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5001/api" // Local development
    : "/api"; // Production (same server)
```

---

## 🔄 Updating Your Deployment

When you make changes:

```bash
# Make your changes to code
git add .
git commit -m "Update feature"
git push origin main

# Render automatically redeploys!
```

**Auto-Deploy:**

- Render watches your `main` branch
- Every push triggers a new deployment
- Takes 2-5 minutes

---

## 🧪 Testing Locally (Before Deployment)

### Option 1: Simulate Production Locally

```bash
# Build production setup locally
cd BarberBook-Backend
npm install
mkdir -p public
cp -r ../BarberBook/* public/
rm -f public/app-local.js.backup

# Set environment
export NODE_ENV=production
export JWT_SECRET=test_secret_key
export PORT=5001

# Start server
npm start

# Visit http://localhost:5001
```

### Option 2: Regular Development Mode

**Terminal 1 - Backend:**

```bash
cd BarberBook-Backend
npm run dev
# Runs on http://localhost:5001
```

**Terminal 2 - Frontend:**

```bash
cd BarberBook
# Serve with any static server
python3 -m http.server 8000
# Or
npx http-server -p 8000
```

Visit `http://localhost:8000`

---

## 📊 Environment Variables Reference

| Variable       | Purpose          | Example          | Required           |
| -------------- | ---------------- | ---------------- | ------------------ |
| `NODE_ENV`     | Environment mode | `production`     | Yes                |
| `PORT`         | Server port      | `10000`          | Auto-set by Render |
| `JWT_SECRET`   | JWT signing key  | `abc123...`      | **Yes**            |
| `JWT_EXPIRE`   | Token lifetime   | `7d`             | No (default: 7d)   |
| `FRONTEND_URL` | CORS origin      | Your service URL | Optional           |

---

## ⚠️ Important Notes

### Free Tier Limitations

- **Spin Down**: Service sleeps after 15 minutes of inactivity
- **Wake Up**: First request takes 30-60 seconds
- **Data Loss**: JSON files reset on restart (no persistent disk on free tier)

### Solutions:

1. **Upgrade to Starter Plan** ($7/month):

   - No spin-down
   - Persistent disk available

2. **Use External Database**:

   - MongoDB Atlas (free tier)
   - PostgreSQL on Render (free tier available)

3. **Accept Data Loss** (demo/testing only)

### CORS Configuration

Since frontend and backend are on the same domain, CORS is simplified:

- Same-origin requests don't trigger CORS
- API calls from `/` to `/api` work automatically
- No complex CORS configuration needed

---

## 🐛 Troubleshooting

### Issue: 404 on API Calls

**Check:**

1. Backend logs in Render dashboard
2. API routes are prefixed with `/api`
3. Frontend uses `/api` in production

**Fix:**

```javascript
// Verify in BarberBook/app.js
const API_BASE_URL = "/api"; // In production
```

### Issue: Frontend Shows Directory Listing

**Cause:** Frontend files not copied to `public/`

**Fix:**

1. Check build logs in Render
2. Verify build command includes:
   ```bash
   mkdir -p public && cp -r ../BarberBook/* public/
   ```

### Issue: Environment Variables Not Set

**Check:**

1. Go to Render Dashboard → Your Service
2. Click "Environment" tab
3. Verify all variables are set
4. Trigger manual redeploy

### Issue: Service Won't Start

**Common Causes:**

1. Missing `JWT_SECRET` environment variable
2. Wrong start command
3. Port mismatch

**Check Logs:**

- Render Dashboard → Your Service → Logs
- Look for error messages

### Issue: "Cannot find module 'path'"

**Fix:** Already handled - `path` is a Node.js built-in module

---

## 📈 Production Checklist

Before going live:

- [ ] Strong `JWT_SECRET` set (32+ random characters)
- [ ] `NODE_ENV` set to `production`
- [ ] All API endpoints tested
- [ ] User registration/login works
- [ ] Appointments can be created
- [ ] Health check responds: `https://your-app.onrender.com/health`
- [ ] No console errors in browser
- [ ] Mobile responsive design tested
- [ ] Consider upgrading from free tier (if needed)
- [ ] Set up custom domain (optional)
- [ ] Configure monitoring/alerts

---

## 🔒 Security Best Practices

1. **Strong JWT Secret**:

   ```bash
   # Generate secure secret
   openssl rand -base64 32
   ```

2. **Environment Variables**:

   - Never commit `.env` files
   - Use Render's environment variable manager
   - Regenerate secrets periodically

3. **HTTPS**:

   - Render provides free SSL automatically
   - All traffic is encrypted

4. **Regular Updates**:
   ```bash
   cd BarberBook-Backend
   npm audit
   npm audit fix
   ```

---

## 💰 Cost Breakdown

### Free Tier

- **Cost**: $0/month
- **Limits**:
  - Spins down after 15 min inactivity
  - 750 hours/month (essentially unlimited)
  - No persistent disk

### Starter Tier ($7/month)

- **Benefits**:
  - No spin-down
  - Persistent disk (512 MB free, more available)
  - Better performance
  - Professional for real users

---

## 🎯 Quick Commands

```bash
# Deploy
git add .
git commit -m "Deploy to Render"
git push origin main

# View logs
# (Go to Render Dashboard → Logs)

# Manual redeploy
# (Render Dashboard → Manual Deploy)

# Check health
curl https://your-app.onrender.com/health

# Test API
curl https://your-app.onrender.com/api/barbers
```

---

## 🔗 Your Deployment URLs

After deployment, save these:

- **App URL**: `https://barberbook.onrender.com` (or your custom name)
- **API Base**: `https://barberbook.onrender.com/api`
- **Health Check**: `https://barberbook.onrender.com/health`
- **GitHub Repo**: `https://github.com/YOUR_USERNAME/BarberBook-Project`

---

## 📚 Additional Resources

- **Render Docs**: https://render.com/docs
- **Node.js Deployment**: https://render.com/docs/deploy-node-express-app
- **Environment Variables**: https://render.com/docs/environment-variables
- **Custom Domains**: https://render.com/docs/custom-domains

---

**🎉 You're Ready to Deploy!**

Follow the steps above, and your BarberBook app will be live in minutes!

**Single command to get started:**

```bash
git add . && git commit -m "Ready for Render" && git push origin main
```

Then create the Web Service on Render with the configuration above.
