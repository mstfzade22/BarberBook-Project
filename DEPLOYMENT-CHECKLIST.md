# BarberBook Deployment Checklist

## Pre-Deployment ✅

- [ ] All code is working locally
- [ ] Backend runs on `http://localhost:5001`
- [ ] Frontend runs on `http://localhost:8000` or similar
- [ ] All tests pass (`cd BarberBook-Backend && npm test`)
- [ ] `.gitignore` file exists and includes `.env`
- [ ] Environment variables are documented in `.env.example`

## GitHub Setup 📦

- [ ] Create GitHub repository at https://github.com/new
- [ ] Repository name: `BarberBook-Project`
- [ ] Push code to GitHub:
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/BarberBook-Project.git
  git branch -M main
  git push -u origin main
  ```

## Backend Deployment (Render) 🔧

- [ ] Sign up/login to [Render](https://dashboard.render.com)
- [ ] Create new **Web Service**
- [ ] Connect GitHub repository
- [ ] Configure service:
  - [ ] Name: `barberbook-backend`
  - [ ] Root Directory: `BarberBook-Backend`
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `npm start`
- [ ] Add environment variables:
  - [ ] `PORT` = `10000`
  - [ ] `NODE_ENV` = `production`
  - [ ] `JWT_SECRET` = (generate strong secret)
  - [ ] `JWT_EXPIRE` = `7d`
  - [ ] `FRONTEND_URL` = (will update after frontend deployment)
- [ ] Click "Create Web Service"
- [ ] Wait for deployment to complete
- [ ] **Copy backend URL**: `https://barberbook-backend.onrender.com`

## Frontend Deployment (Render) 🎨

- [ ] Create new **Static Site** on Render
- [ ] Connect same GitHub repository
- [ ] Configure site:
  - [ ] Name: `barberbook-frontend`
  - [ ] Root Directory: `BarberBook`
  - [ ] Build Command: (leave empty)
  - [ ] Publish Directory: `.`
- [ ] Click "Create Static Site"
- [ ] Wait for deployment to complete
- [ ] **Copy frontend URL**: `https://barberbook-frontend.onrender.com`

## Post-Deployment Configuration 🔄

- [ ] Update `BarberBook/app.js` with actual backend URL:
  ```javascript
  const API_BASE_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
      ? "http://localhost:5001/api"
      : "https://YOUR-ACTUAL-BACKEND.onrender.com/api";
  ```
- [ ] Commit and push changes:
  ```bash
  git add BarberBook/app.js
  git commit -m "Update production API URL"
  git push origin main
  ```
- [ ] Update backend `FRONTEND_URL` environment variable on Render
- [ ] Set to your actual frontend URL: `https://YOUR-FRONTEND.onrender.com`
- [ ] Save (triggers redeploy)

## Testing 🧪

- [ ] Visit frontend URL
- [ ] Test user registration
- [ ] Test user login
- [ ] Browse barbers list
- [ ] Create an appointment
- [ ] Check barber dashboard
- [ ] Check customer dashboard
- [ ] Test logout

## Common Issues & Solutions 🐛

### CORS Errors

- Check `FRONTEND_URL` in backend environment variables
- Ensure no trailing slash in URL

### 503 Service Unavailable

- Free tier spinning up (wait 30-60 seconds)
- Check Render logs for errors

### API Not Found (404)

- Verify backend Root Directory is `BarberBook-Backend`
- Check Start Command is `npm start`

### Data Lost After Restart

- Expected on free tier without persistent disk
- Consider upgrading or using external database

## Optional Enhancements 🚀

- [ ] Set up custom domain
- [ ] Enable persistent disk (paid plan)
- [ ] Add health check endpoints
- [ ] Set up monitoring alerts
- [ ] Migrate to database (MongoDB Atlas)
- [ ] Add SSL certificate (automatic on Render)

## URLs to Save 📝

- **GitHub Repo**: `https://github.com/YOUR_USERNAME/BarberBook-Project`
- **Frontend**: `https://_____.onrender.com`
- **Backend**: `https://_____.onrender.com`
- **Backend API**: `https://_____.onrender.com/api`

---

**🎉 Deployment Complete!**

Your BarberBook application is now live and accessible worldwide!
