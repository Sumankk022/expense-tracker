# 🚀 Quick Deployment Checklist

## ✅ Pre-Deployment Checklist

### Frontend (Netlify)
- [ ] Code pushed to GitHub repository
- [ ] `netlify.toml` configuration file created
- [ ] `vite.config.js` updated for production builds
- [ ] Environment variables prepared
- [ ] Build tested locally (`npm run build`)

### Backend (Heroku/Railway/Render)
- [ ] `package.json` updated with production scripts
- [ ] `Procfile` created (for Heroku)
- [ ] Environment variables configured
- [ ] Database migration strategy planned
- [ ] CORS configured for production domain

---

## 🌐 Netlify Deployment Steps

### 1. Connect Repository
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub account
4. Select your expense-tracker repository

### 2. Configure Build Settings
```
Build command: cd frontend && npm run build
Publish directory: frontend/dist
Node version: 18
```

### 3. Set Environment Variables
```
VITE_API_URL = https://your-backend-url.herokuapp.com/api
VITE_NODE_ENV = production
```

### 4. Deploy
- Click "Deploy site"
- Wait for build to complete
- Test your live site

---

## 🔧 Backend Deployment (Heroku)

### 1. Install Heroku CLI
```bash
# macOS
brew install heroku/brew/heroku

# Windows - Download from heroku.com
```

### 2. Deploy Backend
```bash
cd backend
heroku login
heroku create your-expense-tracker-api
heroku config:set NODE_ENV=production
git push heroku main
```

### 3. Setup Database
```bash
heroku run npx prisma db push
heroku run npx prisma db seed
```

### 4. Get Backend URL
```bash
heroku info
# Copy the web URL for frontend configuration
```

---

## 🔗 Connect Frontend to Backend

### 1. Update Netlify Environment Variables
```
VITE_API_URL = https://your-app-name.herokuapp.com/api
```

### 2. Redeploy Frontend
- Trigger redeploy in Netlify dashboard
- Or push a new commit to trigger auto-deploy

---

## 🧪 Testing Deployment

### Frontend Tests
- [ ] Site loads correctly
- [ ] All pages navigate properly
- [ ] API calls work (check browser console)
- [ ] User profile loads
- [ ] Budget tracking works

### Backend Tests
- [ ] Health check endpoint responds
- [ ] API endpoints return data
- [ ] Database operations work
- [ ] CORS headers are correct

---

## 🆘 Common Issues & Solutions

### CORS Errors
- **Problem**: Frontend can't connect to backend
- **Solution**: Update backend CORS to include your Netlify domain

### Environment Variables
- **Problem**: API calls fail
- **Solution**: Check `VITE_API_URL` is set correctly in Netlify

### Database Issues
- **Problem**: Data not loading
- **Solution**: Run `npx prisma db push` and `npx prisma db seed`

### Build Failures
- **Problem**: Netlify build fails
- **Solution**: Check Node version (use 18) and build logs

---

## 📊 Post-Deployment

### Monitor
- [ ] Check Netlify build logs
- [ ] Monitor Heroku logs
- [ ] Test all functionality
- [ ] Check performance

### Update
- [ ] Set up custom domain (optional)
- [ ] Configure SSL certificates
- [ ] Set up monitoring/alerts
- [ ] Plan backup strategy

---

## 🎉 Success!

Once deployed, your expense tracker will be live at:
- **Frontend**: `https://your-site-name.netlify.app`
- **Backend**: `https://your-app-name.herokuapp.com`

### Next Steps
1. Test all features thoroughly
2. Share with users
3. Monitor usage and performance
4. Plan for scaling if needed
