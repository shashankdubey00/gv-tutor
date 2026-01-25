# 🚀 Deployment Guide: Backend (Render) + Frontend (Vercel)

This guide will help you deploy your GV Tutor application:
- **Backend**: Deploy to Render
- **Frontend**: Deploy to Vercel

---

## 📋 Prerequisites

Before deploying, make sure you have:

- ✅ GitHub account (or GitLab/Bitbucket)
- ✅ Render account (sign up at [render.com](https://render.com))
- ✅ Vercel account (sign up at [vercel.com](https://vercel.com))
- ✅ MongoDB Atlas account (or your MongoDB connection string)
- ✅ All environment variables ready

---

## 🔧 Step 1: Prepare Your Repository

### 1.1 Push Your Code to GitHub

```bash
# If you haven't already, initialize git and push to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/gv-tutor.git
git push -u origin main
```

### 1.2 Verify File Structure

Make sure your repository has:
- ✅ `render.yaml` (for Render deployment)
- ✅ `vercel.json` (for Vercel deployment)
- ✅ `backend/` directory with `package.json`
- ✅ `frontend/` directory with `package.json`

---

## 🖥️ Step 2: Deploy Backend to Render

### 2.1 Create a New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your repository: `gv-tutor`

### 2.2 Configure Render Service

**Basic Settings:**
- **Name**: `gv-tutor-backend` (or any name you prefer)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**OR use the render.yaml file:**
- If you have `render.yaml` in your root, Render will auto-detect it
- You can still override settings in the dashboard if needed

### 2.3 Set Environment Variables in Render

Go to **Environment** tab and add these variables:

#### Required Variables:

```env
NODE_ENV=production
PORT=10000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
CLIENT_URL=https://your-frontend-app.vercel.app
```

#### Optional Variables (if using Google OAuth):

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-backend-app.onrender.com/auth/google/callback
```

#### Optional Variables (if using Email):

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com
```

### 2.4 Important Notes for Render

- **Free Tier**: Services spin down after 15 minutes of inactivity
- **First Deploy**: May take 5-10 minutes
- **Health Check**: Render checks `/health` endpoint automatically
- **Custom Domain**: Available on paid plans

### 2.5 Get Your Backend URL

After deployment, Render will provide a URL like:
```
https://gv-tutor-backend.onrender.com
```

**Save this URL** - you'll need it for frontend configuration!

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `gv-tutor`
4. Vercel will auto-detect it's a Vite project

### 3.2 Configure Vercel Project

**Framework Preset**: Vite (auto-detected)
**Root Directory**: `frontend`
**Build Command**: `npm run build` (auto-detected)
**Output Directory**: `dist` (auto-detected)
**Install Command**: `npm install` (auto-detected)

**OR** Vercel will use `vercel.json` if present in your repo.

### 3.3 Set Environment Variables in Vercel

Go to **Settings** → **Environment Variables** and add:

```env
VITE_BACKEND_URL=https://your-backend-app.onrender.com
```

**Important**: 
- Vite requires `VITE_` prefix for environment variables
- Replace `your-backend-app.onrender.com` with your actual Render backend URL

### 3.4 Deploy

Click **"Deploy"** and wait for the build to complete (usually 2-3 minutes).

### 3.5 Get Your Frontend URL

After deployment, Vercel will provide a URL like:
```
https://gv-tutor.vercel.app
```

**Save this URL** - you'll need it to update backend CORS settings!

---

## 🔄 Step 4: Update Configuration

### 4.1 Update Backend CORS (Render)

1. Go back to Render Dashboard
2. Navigate to your backend service
3. Go to **Environment** tab
4. Update `CLIENT_URL` to your Vercel frontend URL:
   ```
   CLIENT_URL=https://your-frontend-app.vercel.app
   ```
5. Click **"Save Changes"** - Render will automatically redeploy

### 4.2 Update Google OAuth Callback URL

If you're using Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add authorized redirect URI:
   ```
   https://your-backend-app.onrender.com/auth/google/callback
   ```
5. Update `GOOGLE_CALLBACK_URL` in Render environment variables

### 4.3 Verify Frontend Environment Variable

1. Go to Vercel Dashboard
2. Navigate to your project → **Settings** → **Environment Variables**
3. Verify `VITE_BACKEND_URL` points to your Render backend URL
4. If you changed it, trigger a new deployment

---

## ✅ Step 5: Verify Deployment

### 5.1 Test Backend

1. Visit your backend health check:
   ```
   https://your-backend-app.onrender.com/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. Test an API endpoint:
   ```
   https://your-backend-app.onrender.com/api/auth/verify
   ```

### 5.2 Test Frontend

1. Visit your Vercel frontend URL
2. Try logging in/signing up
3. Check browser console for any errors
4. Verify API calls are going to the correct backend URL

### 5.3 Common Issues

**Issue**: CORS errors in browser console
- **Solution**: Verify `CLIENT_URL` in Render matches your Vercel URL exactly (including `https://`)

**Issue**: "Cannot connect to server"
- **Solution**: 
  - Check `VITE_BACKEND_URL` in Vercel environment variables
  - Verify backend is running (check Render logs)
  - On free tier, backend may be "spinning up" (wait 30-60 seconds)

**Issue**: 401 Unauthorized errors
- **Solution**: 
  - Check cookies are being set (browser DevTools → Application → Cookies)
  - Verify CORS allows credentials
  - Check backend logs for JWT errors

**Issue**: MongoDB connection errors
- **Solution**:
  - Verify `MONGO_URI` is correct in Render
  - For MongoDB Atlas: Add Render's IP (0.0.0.0/0) to Network Access whitelist
  - Check MongoDB Atlas connection string format

---

## 🔒 Step 6: Security Checklist

Before going live, ensure:

- [ ] `NODE_ENV=production` in Render
- [ ] `JWT_SECRET` is at least 32 characters (strong random string)
- [ ] `MONGO_URI` uses secure connection (MongoDB Atlas with authentication)
- [ ] `CLIENT_URL` matches your production frontend URL exactly
- [ ] Google OAuth callback URLs updated for production
- [ ] All sensitive data in environment variables (never in code)
- [ ] HTTPS enabled (automatic on Render and Vercel)
- [ ] CORS configured correctly (only your frontend domain)

---

## 📊 Step 7: Monitoring & Logs

### Render Logs

1. Go to Render Dashboard → Your Service
2. Click **"Logs"** tab
3. View real-time logs and errors

### Vercel Logs

1. Go to Vercel Dashboard → Your Project
2. Click **"Deployments"** → Select a deployment
3. View build logs and runtime logs

### MongoDB Atlas Monitoring

1. Go to MongoDB Atlas Dashboard
2. Monitor connection metrics, database usage
3. Set up alerts for unusual activity

---

## 🚀 Step 8: Custom Domains (Optional)

### Render Custom Domain

1. Go to Render Dashboard → Your Service
2. Click **"Settings"** → **"Custom Domains"**
3. Add your domain (requires paid plan)

### Vercel Custom Domain

1. Go to Vercel Dashboard → Your Project
2. Click **"Settings"** → **"Domains"**
3. Add your domain (free tier supports custom domains)
4. Update DNS records as instructed

**After adding custom domain:**
- Update `CLIENT_URL` in Render to new domain
- Update `VITE_BACKEND_URL` in Vercel to new backend domain
- Update Google OAuth callback URLs

---

## 🔄 Step 9: Continuous Deployment

Both Render and Vercel automatically deploy when you push to your main branch:

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main

# Render and Vercel will automatically deploy!
```

---

## 💰 Pricing Notes

### Render Free Tier
- ✅ 750 hours/month (enough for 1 service running 24/7)
- ⚠️ Services spin down after 15 min inactivity (cold starts)
- ⚠️ Limited to 1 web service
- 💰 Paid plans start at $7/month (no spin-down)

### Vercel Free Tier
- ✅ Unlimited deployments
- ✅ Custom domains
- ✅ 100GB bandwidth/month
- ✅ Perfect for most projects

---

## 📝 Quick Reference

### Backend URL (Render)
```
https://your-backend-app.onrender.com
```

### Frontend URL (Vercel)
```
https://your-frontend-app.vercel.app
```

### Environment Variables Checklist

**Render (Backend):**
- `NODE_ENV=production`
- `PORT=10000`
- `MONGO_URI=...`
- `JWT_SECRET=...`
- `CLIENT_URL=https://your-frontend.vercel.app`
- `GOOGLE_CLIENT_ID=...` (optional)
- `GOOGLE_CLIENT_SECRET=...` (optional)
- `GOOGLE_CALLBACK_URL=...` (optional)

**Vercel (Frontend):**
- `VITE_BACKEND_URL=https://your-backend.onrender.com`

---

## 🆘 Need Help?

### Common Commands

```bash
# Check backend logs (Render Dashboard)
# View in Render Dashboard → Logs tab

# Check frontend build (Vercel Dashboard)
# View in Vercel Dashboard → Deployments → Build Logs

# Test backend locally
cd backend
npm start

# Test frontend locally
cd frontend
npm run dev
```

### Support Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] All environment variables set
- [ ] Backend health check working
- [ ] Frontend can connect to backend
- [ ] Authentication flow working
- [ ] CORS configured correctly
- [ ] Google OAuth updated (if using)
- [ ] Custom domains configured (optional)
- [ ] Monitoring set up

---

**🎉 Congratulations! Your app is now live!**

Your website is accessible at:
- Frontend: `https://your-frontend-app.vercel.app`
- Backend API: `https://your-backend-app.onrender.com`






