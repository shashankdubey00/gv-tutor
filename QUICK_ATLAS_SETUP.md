# ⚡ Quick MongoDB Atlas Setup (5 Minutes)

## 🎯 **Super Quick Steps**

### 1. **Sign Up** (1 minute)

- Go to: https://www.mongodb.com/cloud/atlas/register
- Sign up with email

### 2. **Create Free Cluster** (2 minutes)

- Click "Build a Database"
- Choose **M0 FREE**
- Choose region closest to you
- Click "Create"
- Wait 2-3 minutes for cluster to be ready

### 3. **Create Database User** (1 minute)

- Username: `gvtutor-admin`
- Password: Click "Autogenerate" OR create your own
- **COPY THE PASSWORD!** (you'll need it)
- Click "Create User"

### 4. **Allow Network Access** (30 seconds)

- Click "Network Access" (left sidebar)
- Click "Add IP Address"
- Click "Allow Access from Anywhere" (0.0.0.0/0)
- Click "Confirm"

### 5. **Get Connection String** (30 seconds)

- Click "Database" → "Connect"
- Choose "Drivers"
- Select "Node.js"
- Copy the connection string

### 6. **Update .env File**

Open `backend/.env` and replace:

```env
# OLD
MONGO_URI=mongodb://127.0.0.1:27017/gv_tutor

# NEW (replace with your actual connection string)
MONGO_URI=mongodb+srv://gvtutor-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/gv_tutor?retryWrites=true&w=majority
```

**Important:**

- Replace `YOUR_PASSWORD` with your actual password
- Replace `cluster0.xxxxx` with your actual cluster name
- If password has special characters, URL-encode them:
  - `@` → `%40`
  - `#` → `%23`
  - `%` → `%25`

### 7. **Test Connection**

```bash
cd backend
npm run dev
```

You should see: `✅ MongoDB connected successfully`

---

## 🎉 **Done!**

Your app is now using MongoDB Atlas (cloud database)!

---

## 📚 **Need More Details?**

See `MONGODB_ATLAS_SETUP.md` for complete guide with troubleshooting.
