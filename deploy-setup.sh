#!/bin/bash

# BarberBook Deployment Setup Script
# This script helps prepare your project for deployment to Render

echo "🚀 BarberBook Deployment Setup"
echo "================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - BarberBook project ready for deployment"
    echo "✅ Git initialized"
else
    echo "✅ Git repository already initialized"
fi

echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Create a GitHub repository:"
echo "   - Go to https://github.com/new"
echo "   - Create a new repository named 'BarberBook-Project'"
echo "   - Don't initialize with README (we already have code)"
echo ""
echo "2. Push your code to GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/BarberBook-Project.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Deploy Backend on Render:"
echo "   - Go to https://dashboard.render.com"
echo "   - Click 'New +' → 'Web Service'"
echo "   - Connect your GitHub repo"
echo "   - Root Directory: BarberBook-Backend"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "   - Add environment variables (see DEPLOYMENT.md)"
echo ""
echo "4. Deploy Frontend on Render:"
echo "   - Click 'New +' → 'Static Site'"
echo "   - Root Directory: BarberBook"
echo "   - Leave build command empty"
echo "   - Publish Directory: ."
echo ""
echo "5. Update URLs:"
echo "   - Copy your backend URL from Render"
echo "   - Update BarberBook/app.js with the actual backend URL"
echo "   - Update backend FRONTEND_URL environment variable"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo ""
