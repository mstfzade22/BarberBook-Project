#!/bin/bash

# BarberBook Project - Quick Start Guide
# Software Engineering Final Project

clear

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║          💈 BarberBook Deployment Assistant 💈            ║"
echo "║                                                           ║"
echo "║     Software Engineering Final Project                   ║"
echo "║     Online Barber Appointment System                     ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "This script will help you deploy your project to Render."
echo ""

# Function to wait for user
wait_for_user() {
    echo ""
    read -p "Press Enter to continue..."
    echo ""
}

# Step 1: Check prerequisites
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 1: Checking Prerequisites"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js installed: $NODE_VERSION"
else
    echo "❌ Node.js not found!"
    echo "   Install from: https://nodejs.org/"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm installed: $NPM_VERSION"
else
    echo "❌ npm not found!"
    exit 1
fi

# Check git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version | cut -d' ' -f3)
    echo "✅ Git installed: $GIT_VERSION"
else
    echo "❌ Git not found!"
    echo "   Install from: https://git-scm.com/"
    exit 1
fi

wait_for_user

# Step 2: Test locally
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 2: Testing Application Locally"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "Installing backend dependencies..."
cd BarberBook-Backend
npm install

echo ""
echo "Running tests..."
if npm test; then
    echo ""
    echo "✅ All tests passed!"
else
    echo ""
    echo "❌ Some tests failed. Please fix before deploying."
    exit 1
fi

cd ..

wait_for_user

# Step 3: Prepare for deployment
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 3: Preparing for Deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "Generating JWT Secret for production..."
JWT_SECRET=$(openssl rand -base64 32)
echo ""
echo "🔐 Your JWT Secret (save this!):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "$JWT_SECRET"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  IMPORTANT: You'll need this for Render deployment!"
echo "   Copy it now or save to a secure location."

wait_for_user

# Step 4: GitHub instructions
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 4: Push to GitHub"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "1. Create a new repository on GitHub:"
echo "   → Go to: https://github.com/new"
echo "   → Repository name: BarberBook-Project"
echo "   → Description: Online Barber Appointment System - SE Final Project"
echo "   → Public or Private (as per course requirements)"
echo "   → Don't initialize with README (we already have code)"
echo ""
echo "2. After creating the repository, run these commands:"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "git init"
echo "git add ."
echo "git commit -m \"Initial commit - BarberBook SE Final Project\""
echo "git branch -M main"
echo "git remote add origin https://github.com/YOUR_USERNAME/BarberBook-Project.git"
echo "git push -u origin main"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

wait_for_user

# Step 5: Render deployment
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 5: Deploy to Render"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "1. Go to Render Dashboard:"
echo "   → https://dashboard.render.com"
echo ""
echo "2. Click 'New +' → 'Web Service'"
echo ""
echo "3. Connect your GitHub repository"
echo ""
echo "4. Configure with these EXACT settings:"
echo ""
echo "   ┌─────────────────────────────────────────────┐"
echo "   │ Name:          barberbook                   │"
echo "   │ Runtime:       Node                         │"
echo "   │ Branch:        main                         │"
echo "   │                                             │"
echo "   │ Build Command:                              │"
echo "   │ cd BarberBook-Backend && npm install &&     │"
echo "   │ mkdir -p public &&                          │"
echo "   │ cp -r ../BarberBook/* public/ &&            │"
echo "   │ rm -f public/app-local.js.backup            │"
echo "   │                                             │"
echo "   │ Start Command:                              │"
echo "   │ cd BarberBook-Backend && npm start          │"
echo "   └─────────────────────────────────────────────┘"
echo ""
echo "5. Add Environment Variables:"
echo ""
echo "   NODE_ENV     = production"
echo "   JWT_SECRET   = [Use the secret generated above]"
echo "   JWT_EXPIRE   = 7d"
echo ""
echo "6. Click 'Create Web Service' and wait 3-5 minutes"
echo ""
echo "7. Your app will be live at:"
echo "   https://barberbook-XXXX.onrender.com"

wait_for_user

# Step 6: Testing
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 6: Testing Deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "After deployment completes, test these URLs:"
echo ""
echo "✅ Homepage:     https://your-app.onrender.com"
echo "✅ Health Check: https://your-app.onrender.com/health"
echo "✅ API Barbers:  https://your-app.onrender.com/api/barbers"
echo ""
echo "Test the full application:"
echo ""
echo "1. Register a new account"
echo "2. Login with your credentials"
echo "3. Browse barbers"
echo "4. Book an appointment"
echo "5. Check customer dashboard"
echo "6. Login as barber (john@barberbook.com / password)"
echo "7. View barber calendar"

wait_for_user

# Final step
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 DEPLOYMENT COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "📚 Additional Resources:"
echo ""
echo "   README.md                      - Complete project documentation"
echo "   RENDER-UNIFIED-DEPLOYMENT.md   - Detailed deployment guide"
echo "   DEPLOYMENT-CHECKLIST-FINAL.md  - Submission checklist"
echo "   BarberBook-Backend/README.md   - API documentation"
echo ""
echo "📝 For Your Project Report, Include:"
echo ""
echo "   ✓ GitHub Repository URL"
echo "   ✓ Live Application URL (Render)"
echo "   ✓ API Documentation"
echo "   ✓ Test Results Screenshot"
echo "   ✓ Architecture Diagram"
echo "   ✓ Deployment Process"
echo ""
echo "⚠️  Important Notes:"
echo ""
echo "   • Free tier: App spins down after 15 min (30-60s wake time)"
echo "   • Data resets on restart (mention in report)"
echo "   • For production: upgrade to paid plan or use external DB"
echo ""
echo "🎓 Good luck with your Software Engineering final project!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
