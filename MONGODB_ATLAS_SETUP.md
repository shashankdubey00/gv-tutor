# 🚀 MongoDB Atlas Setup Guide

Complete guide to migrate from local MongoDB to MongoDB Atlas (cloud database).

---

## 📋 **Step 1: Create MongoDB Atlas Account**

1. **Go to MongoDB Atlas**

   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Click "Try Free" or "Sign Up"

2. **Sign Up**
   - Use your email (Google account works too)
   - Create a password
   - Verify your email

---

## 📋 **Step 2: Create a Free Cluster**

1. **After Login:**

   - Click "Build a Database"
   - Choose "M0 FREE" (Free tier - perfect for development)
   - Click "Create"

2. **Choose Cloud Provider & Region:**

   - **AWS** (recommended) or Google Cloud or Azure
   - **Region**: Choose closest to you (e.g., `Mumbai (ap-south-1)` for India)
   - Click "Create Cluster"

3. **Wait for Cluster Creation** (2-3 minutes)
   - You'll see "Creating..." status
   - Wait until it shows "Running"

---

## 📋 **Step 3: Create Database User**

1. **In the Atlas Dashboard:**

   - You'll see a security popup
   - **Username**: Enter `gvtutor-admin` (or any username)
   - **Password**: Click "Autogenerate Secure Password" OR create your own
   - **IMPORTANT**: Copy the password! You'll need it later
   - Click "Create User"

2. **Save Credentials:**
   ```
   Username: gvtutor-admin
   Password: [the password you just created]
   ```

---

## 📋 **Step 4: Configure Network Access (Whitelist IP)**

1. **In the Security Section:**

   - Click "Network Access" (left sidebar)
   - Click "Add IP Address"

2. **For Development:**

   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - ⚠️ **Note**: This is OK for development, but for production, use specific IPs
   - Click "Confirm"

3. **For Production (Later):**
   - Add your server's IP address
   - Or add your hosting provider's IP ranges

---

## 📋 **Step 5: Get Connection String**

1. **In Atlas Dashboard:**

   - Click "Database" (left sidebar)
   - Click "Connect" button on your cluster

2. **Choose Connection Method:**

   - Select "Drivers" (for Node.js)

3. **Get Connection String:**

   - Select "Node.js" and version "5.5 or later"
   - Copy the connection string (looks like this):

   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

4. **Replace Placeholders:**

   - Replace `<username>` with your database username (e.g., `gvtutor-admin`)
   - Replace `<password>` with your database password
   - Add your database name at the end:

   ```
   mongodb+srv://gvtutor-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/gv_tutor?retryWrites=true&w=majority
   ```

5. **Final Connection String Format:**
   ```
   mongodb+srv://gvtutor-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/gv_tutor?retryWrites=true&w=majority
   ```

---

## 📋 **Step 6: Update Your Backend .env File**

1. **Open your `.env` file:**

   ```
   backend/.env
   ```

2. **Replace the MONGO_URI:**

   ```env
   # OLD (Local MongoDB)
   # MONGO_URI=mongodb://127.0.0.1:27017/gv_tutor

   # NEW (MongoDB Atlas)
   MONGO_URI=mongodb+srv://gvtutor-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/gv_tutor?retryWrites=true&w=majority
   ```

3. **Important:**
   - Replace `YOUR_PASSWORD` with your actual database password
   - Replace `cluster0.xxxxx` with your actual cluster name
   - Keep `gv_tutor` as your database name (or change it if you want)

---

## 📋 **Step 7: Test the Connection**

1. **Start your backend server:**

   ```bash
   cd backend
   npm run dev
   ```

2. **Check Console:**
   - You should see: `✅ mongodb connected`
   - If you see an error, check:
     - Password is correct (no special characters need URL encoding)
     - Network access is configured (IP whitelist)
     - Connection string is correct

---

## 📋 **Step 8: Handle Special Characters in Password**

If your password has special characters (`@`, `#`, `%`, etc.), you need to URL-encode them:

**Special Characters → URL Encoded:**

- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `/` → `%2F`
- `=` → `%3D`
- `?` → `%3F`

**Example:**

```
Password: MyP@ss#123
Encoded:  MyP%40ss%23123

Connection String:
mongodb+srv://gvtutor-admin:MyP%40ss%23123@cluster0.xxxxx.mongodb.net/gv_tutor?retryWrites=true&w=majority
```

**Or use this online tool:**

- https://www.urlencoder.org/
- Paste your password → Copy encoded version

---

## 📋 **Step 9: Verify It's Working**

1. **Check Atlas Dashboard:**

   - Go to "Database" → "Browse Collections"
   - You should see your collections (users, tutorProfiles, etc.)

2. **Test Your App:**
   - Try signing up a new user
   - Check if data appears in Atlas
   - Try logging in

---

## 📋 **Step 10: (Optional) Migrate Existing Data**

If you have data in your local MongoDB and want to migrate it:

### **Option 1: Using MongoDB Compass (GUI Tool)**

1. **Download MongoDB Compass:**

   - https://www.mongodb.com/try/download/compass

2. **Connect to Local MongoDB:**

   - Connection string: `mongodb://127.0.0.1:27017/gv_tutor`

3. **Export Collections:**

   - Right-click each collection → Export Collection → JSON
   - Save files

4. **Connect to Atlas:**
   - Use your Atlas connection string
   - Import the JSON files

### **Option 2: Using mongodump/mongorestore**

```bash
# Export from local
mongodump --uri="mongodb://127.0.0.1:27017/gv_tutor" --out=./backup

# Import to Atlas
mongorestore --uri="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gv_tutor" ./backup/gv_tutor
```

---

## 🔒 **Security Best Practices**

### **For Development:**

- ✅ Using `0.0.0.0/0` (allow all IPs) is OK
- ✅ Free tier is perfect for learning

### **For Production:**

- ❌ **NEVER** use `0.0.0.0/0` (allow all IPs)
- ✅ Add specific IP addresses only
- ✅ Use strong database passwords
- ✅ Enable MongoDB Atlas authentication
- ✅ Use environment variables (never hardcode passwords)
- ✅ Enable MongoDB Atlas monitoring/alerts

---

## 🐛 **Troubleshooting**

### **Error: "Authentication failed"**

- ✅ Check username and password are correct
- ✅ Make sure password is URL-encoded if it has special characters
- ✅ Verify database user exists in Atlas

### **Error: "IP not whitelisted"**

- ✅ Go to Network Access in Atlas
- ✅ Add your current IP address
- ✅ Or temporarily allow `0.0.0.0/0` for testing

### **Error: "Connection timeout"**

- ✅ Check your internet connection
- ✅ Verify cluster is running (not paused)
- ✅ Check firewall settings

### **Error: "Invalid connection string"**

- ✅ Make sure connection string starts with `mongodb+srv://`
- ✅ Verify no extra spaces in the connection string
- ✅ Check all placeholders are replaced

---

## 📊 **MongoDB Atlas Features (Free Tier)**

- ✅ **512 MB storage** (enough for thousands of users)
- ✅ **Shared RAM** (sufficient for development)
- ✅ **No credit card required**
- ✅ **Automatic backups** (daily snapshots)
- ✅ **Monitoring dashboard**
- ✅ **Database browser** (view/edit data in browser)

---

## 🎯 **Next Steps**

1. ✅ Update `.env` file with Atlas connection string
2. ✅ Test connection
3. ✅ Verify data is being saved
4. ✅ (Optional) Migrate existing local data
5. ✅ Update production environment variables when deploying

---

## 📝 **Quick Reference**

**Your Connection String Template:**

```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
```

**Example:**

```
mongodb+srv://gvtutor-admin:MySecurePass123@cluster0.abc123.mongodb.net/gv_tutor?retryWrites=true&w=majority
```

---

## 🆘 **Need Help?**

- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- MongoDB Community: https://community.mongodb.com/
- Atlas Status: https://status.mongodb.com/

---

**🎉 Congratulations!** You're now using MongoDB Atlas (cloud database)!

Your database is now:

- ✅ Accessible from anywhere
- ✅ Automatically backed up
- ✅ Scalable (can upgrade when needed)
- ✅ Production-ready
