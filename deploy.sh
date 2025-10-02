#!/bin/bash

# Expense Tracker Deployment Script
echo "🚀 Expense Tracker Deployment Helper"
echo "====================================="

echo "📋 Available deployment options:"
echo "1. Frontend to Netlify"
echo "2. Backend to Heroku" 
echo "3. Full deployment guide"
echo "4. Test local build"

read -p "Choose an option (1-4): " choice

case $choice in
    1)
        echo "🌐 Deploying Frontend to Netlify..."
        echo "1. Go to https://netlify.com"
        echo "2. Click 'New site from Git'"
        echo "3. Connect your repository"
        echo "4. Set build command: cd frontend && npm run build"
        echo "5. Set publish directory: frontend/dist"
        echo "6. Add VITE_API_URL environment variable"
        echo "7. Deploy!"
        ;;
    2)
        echo "🔧 Deploying Backend to Heroku..."
        echo "1. Install Heroku CLI"
        echo "2. Run: heroku login"
        echo "3. Run: cd backend && heroku create your-app-name"
        echo "4. Run: git push heroku main"
        echo "5. Run: heroku run npx prisma db push"
        ;;
    3)
        echo "📖 See DEPLOYMENT.md for detailed instructions"
        ;;
    4)
        echo "🧪 Testing local build..."
        cd frontend && npm run build
        ;;
    *)
        echo "❌ Invalid option"
        ;;
esac