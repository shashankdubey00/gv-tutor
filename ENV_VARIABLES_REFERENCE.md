# 🔐 Environment Variables Reference

Quick reference for all environment variables needed for deployment.

---

## 🖥️ Backend (Render) Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (Render sets this automatically) | `10000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | Secret key for JWT tokens (min 32 chars) | `your_super_secret_key_32_chars_min` |
| `CLIENT_URL` | Frontend URL (your Vercel app URL) | `https://your-app.vercel.app` |

### Optional Variables (Google OAuth)

| Variable | Description | Example |
|----------|-------------|---------|
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `123456789-abc.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `GOCSPX-xxxxxxxxxxxxx` |
| `GOOGLE_CALLBACK_URL` | OAuth callback URL | `https://your-backend.onrender.com/auth/google/callback` |

### Optional Variables (Email Service)

| Variable | Description | Example |
|----------|-------------|---------|
| `EMAIL_HOST` | SMTP server host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP server port | `587` |
| `EMAIL_USER` | Email address for sending | `your-email@gmail.com` |
| `EMAIL_PASS` | App password (not regular password) | `abcd efgh ijkl mnop` |
| `EMAIL_FROM` | From email address | `your-email@gmail.com` |

---

## 🎨 Frontend (Vercel) Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_BACKEND_URL` | Backend API URL (your Render app URL) | `https://your-backend.onrender.com` |

**Note**: Vite requires the `VITE_` prefix for environment variables to be exposed to the client.

---

## 📝 How to Set Environment Variables

### Render (Backend)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your web service
3. Click **"Environment"** tab
4. Click **"Add Environment Variable"**
5. Enter key and value
6. Click **"Save Changes"** (service will auto-redeploy)

### Vercel (Frontend)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **"Settings"** → **"Environment Variables"**
4. Click **"Add"**
5. Enter key and value
6. Select environments (Production, Preview, Development)
7. Click **"Save"**
8. Trigger a new deployment if needed

---

## 🔑 Generating Secure Values

### Generate JWT_SECRET

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

### MongoDB Atlas Connection String

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `<dbname>` with your database name

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gv-tutor?retryWrites=true&w=majority
```

### Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project (or select existing)
3. Enable **Google+ API**
4. Go to **APIs & Services** → **Credentials**
5. Create **OAuth 2.0 Client ID**
6. Choose **Web application**
7. Add authorized redirect URI:
   - Development: `http://localhost:5000/auth/google/callback`
   - Production: `https://your-backend.onrender.com/auth/google/callback`
8. Copy Client ID and Client Secret

### Gmail App Password (for Email)

1. Go to [Google Account Settings](https://myaccount.google.com)
2. Click **Security** → **2-Step Verification** (must be enabled)
3. Scroll down to **App passwords**
4. Select app: **Mail**
5. Select device: **Other (Custom name)**
6. Enter name: **GV Tutor**
7. Click **Generate**
8. Copy the 16-character password (spaces don't matter)

---

## ✅ Verification Checklist

After setting environment variables, verify:

- [ ] Backend starts without errors (check Render logs)
- [ ] Frontend builds successfully (check Vercel build logs)
- [ ] Backend health check works: `https://your-backend.onrender.com/health`
- [ ] Frontend can connect to backend (check browser console)
- [ ] Authentication works (login/signup)
- [ ] Google OAuth works (if configured)
- [ ] Email sending works (if configured)

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** to Git
2. **Use strong, random JWT_SECRET** (32+ characters)
3. **Use MongoDB Atlas** with authentication (not public databases)
4. **Rotate secrets regularly** in production
5. **Use different values** for development and production
6. **Restrict MongoDB IP whitelist** to Render's IPs (or use 0.0.0.0/0 for free tier)
7. **Use app passwords** for Gmail, not your regular password
8. **Keep secrets secret** - never share in screenshots or public channels

---

## 🆘 Troubleshooting

### "Missing required environment variable" error

- Check all required variables are set in Render/Vercel
- Verify variable names are exact (case-sensitive)
- Check for typos or extra spaces
- Restart service after adding variables

### "JWT_SECRET must be at least 32 characters"

- Generate a new secret using the command above
- Ensure it's at least 32 characters long
- Update in Render environment variables

### "MongoDB connection failed"

- Verify `MONGO_URI` is correct
- Check MongoDB Atlas Network Access (whitelist IPs)
- Verify database user has correct permissions
- Check connection string format

### Frontend can't connect to backend

- Verify `VITE_BACKEND_URL` in Vercel matches your Render URL
- Check CORS settings in backend (`CLIENT_URL` must match frontend URL)
- Ensure backend is running (check Render logs)
- On free tier, wait 30-60 seconds for cold start

---

**Last Updated**: Deployment setup


