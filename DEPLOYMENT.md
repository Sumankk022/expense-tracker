# Expense Tracker - Deployment Guide

## 🚀 Frontend Deployment (Netlify)

### Prerequisites
- GitHub repository with your code
- Netlify account (free tier available)
- Backend deployed and accessible via HTTPS

### Step 1: Prepare Your Repository

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Ensure your repository structure**:
   ```
   expense-tracker/
   ├── frontend/
   │   ├── src/
   │   ├── package.json
   │   ├── vite.config.js
   │   └── dist/ (will be created during build)
   ├── backend/
   ├── netlify.toml
   └── README.md
   ```

### Step 2: Deploy to Netlify

1. **Go to [Netlify](https://netlify.com)** and sign in
2. **Click "New site from Git"**
3. **Connect your GitHub repository**
4. **Configure build settings**:
   - **Build command**: `cd frontend && npm run build`
   - **Publish directory**: `frontend/dist`
   - **Node version**: `18`

5. **Set Environment Variables** (in Site Settings > Environment Variables):
   ```
   VITE_API_URL = https://your-backend-url.herokuapp.com/api
   VITE_NODE_ENV = production
   ```

6. **Deploy**: Click "Deploy site"

### Step 3: Configure Custom Domain (Optional)
- Go to Site Settings > Domain Management
- Add your custom domain
- Configure DNS settings

---

## 🔧 Backend Deployment Options

### Option 1: Heroku (Recommended for beginners)

#### Prerequisites
- Heroku CLI installed
- Git repository

#### Steps:
1. **Install Heroku CLI**:
   ```bash
   # macOS
   brew install heroku/brew/heroku
   
   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**:
   ```bash
   heroku login
   ```

3. **Create Heroku App**:
   ```bash
   cd backend
   heroku create your-expense-tracker-api
   ```

4. **Configure Environment Variables**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set PORT=3001
   ```

5. **Deploy**:
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

6. **Initialize Database**:
   ```bash
   heroku run npx prisma db push
   heroku run npx prisma db seed
   ```

### Option 2: Railway

1. **Go to [Railway](https://railway.app)**
2. **Connect GitHub repository**
3. **Select backend folder**
4. **Configure environment variables**
5. **Deploy automatically**

### Option 3: Render

1. **Go to [Render](https://render.com)**
2. **Create new Web Service**
3. **Connect GitHub repository**
4. **Configure build settings**:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Set environment variables**
6. **Deploy**

---

## 🔗 Connecting Frontend to Backend

### After Backend Deployment:

1. **Get your backend URL** (e.g., `https://your-app.herokuapp.com`)

2. **Update Netlify Environment Variables**:
   ```
   VITE_API_URL = https://your-app.herokuapp.com/api
   ```

3. **Redeploy frontend** (triggered automatically or manually)

---

## 📋 Environment Variables Reference

### Frontend (Netlify)
```
VITE_API_URL = https://your-backend-url.herokuapp.com/api
VITE_NODE_ENV = production
```

### Backend (Heroku/Railway/Render)
```
NODE_ENV = production
PORT = 3001
DATABASE_URL = your-database-url (if using external DB)
```

---

## 🛠️ Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Ensure backend CORS is configured for your frontend domain
   - Check environment variables are set correctly

2. **API Not Found**:
   - Verify `VITE_API_URL` is correct
   - Check backend is running and accessible

3. **Database Issues**:
   - Run database migrations: `npx prisma db push`
   - Seed database: `npx prisma db seed`

4. **Build Failures**:
   - Check Node.js version (use 18)
   - Verify all dependencies are in package.json
   - Check build logs in Netlify dashboard

---

## 🔄 Continuous Deployment

### Automatic Deployments:
- **Frontend**: Netlify automatically deploys on git push
- **Backend**: Configure auto-deploy in your hosting platform

### Manual Deployments:
- **Frontend**: Trigger deploy in Netlify dashboard
- **Backend**: Push to main branch or use platform CLI

---

## 📊 Monitoring & Maintenance

### Health Checks:
- Frontend: Check Netlify status page
- Backend: Monitor logs in hosting platform
- Database: Regular backups recommended

### Updates:
1. Make changes locally
2. Test thoroughly
3. Push to GitHub
4. Monitor deployment logs
5. Test production environment

---

## 💡 Pro Tips

1. **Use staging environment** for testing before production
2. **Set up monitoring** for both frontend and backend
3. **Regular backups** of your database
4. **Environment-specific configurations** for different stages
5. **Performance optimization** for production builds

---

## 🆘 Support

If you encounter issues:
1. Check deployment logs
2. Verify environment variables
3. Test API endpoints manually
4. Check CORS configuration
5. Review this guide for common solutions
