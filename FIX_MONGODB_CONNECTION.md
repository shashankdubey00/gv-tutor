# 🔧 Fix MongoDB Atlas Connection Error

## ❌ **Current Error:**
```
❌ MongoDB connection error: querySrv ECONNREFUSED _mongodb._tcp.cluster0.qttkeob.mongodb.net
```

This means your backend **cannot connect** to MongoDB Atlas. The server crashes before it can start.

---

## 🔍 **Possible Causes:**

### **1. Network Access (IP Whitelist) - Most Common**
Your IP address is not whitelisted in MongoDB Atlas.

**Fix:**
1. Go to: https://cloud.mongodb.com/
2. Click "Network Access" (left sidebar)
3. Click "Add IP Address"
4. Click "Allow Access from Anywhere" (0.0.0.0/0) for development
5. Click "Confirm"
6. Wait 1-2 minutes for changes to take effect

### **2. Internet Connection**
Your computer cannot reach MongoDB Atlas servers.

**Fix:**
- Check your internet connection
- Try accessing: https://cloud.mongodb.com/ in browser
- If you can access Atlas website, connection should work

### **3. Firewall/Antivirus Blocking**
Your firewall might be blocking the connection.

**Fix:**
- Temporarily disable firewall/antivirus
- Or add MongoDB Atlas to firewall exceptions
- MongoDB Atlas uses port 27017 (standard) or SRV records

### **4. DNS Resolution Issue**
Your computer cannot resolve the MongoDB Atlas hostname.

**Fix:**
- Try using a different DNS server (Google DNS: 8.8.8.8)
- Or restart your router/modem
- Or try connecting from a different network

### **5. Connection String Issue**
The connection string might be incorrect.

**Fix:**
- Verify connection string in `.env` file
- Make sure password is URL-encoded if it has special characters
- Check for extra spaces or typos

---

## ✅ **Step-by-Step Fix:**

### **Step 1: Check Network Access in Atlas**
1. Go to: https://cloud.mongodb.com/
2. Click "Network Access"
3. Check if your IP is listed OR if `0.0.0.0/0` is allowed
4. If not, add it (see above)

### **Step 2: Verify Connection String**
Check `backend/.env` file:
```env
MONGO_URI=mongodb+srv://dubeyshashank444_db_user:9mKt21cFZLGmuclr@cluster0.qttkeob.mongodb.net/gv_tutor?retryWrites=true&w=majority&appName=Cluster0
```

**Important:**
- No spaces before/after
- Password should be correct
- Database name (`gv_tutor`) should be correct

### **Step 3: Test Connection**
Try connecting from MongoDB Compass:
1. Open MongoDB Compass
2. New Connection
3. Paste your connection string
4. Click "Connect"
5. If it works in Compass, it should work in backend

### **Step 4: Restart Backend**
```bash
cd backend
npm run dev
```

Should see:
```
✅ MongoDB connected successfully
📊 Database: gv_tutor
🌐 Host: cluster0.qttkeob.mongodb.net
```

---

## 🐛 **If Still Not Working:**

### **Option 1: Use Local MongoDB Temporarily**
If you need to test immediately, use local MongoDB:

```env
# In backend/.env, temporarily use:
MONGO_URI=mongodb://127.0.0.1:27017/gv_tutor
```

**Note:** This is only for testing. Switch back to Atlas for production.

### **Option 2: Check MongoDB Atlas Status**
1. Go to: https://status.mongodb.com/
2. Check if there are any outages
3. Check your cluster status in Atlas dashboard

### **Option 3: Try Different Connection Method**
Instead of `mongodb+srv://`, try regular connection:
```env
MONGO_URI=mongodb://dubeyshashank444_db_user:9mKt21cFZLGmuclr@cluster0-shard-00-00.qttkeob.mongodb.net:27017,cluster0-shard-00-01.qttkeob.mongodb.net:27017,cluster0-shard-00-02.qttkeob.mongodb.net:27017/gv_tutor?ssl=true&replicaSet=atlas-xxxxx-shard-0&authSource=admin&retryWrites=true&w=majority
```

**Note:** You'll need to get the exact connection string from Atlas dashboard.

---

## 🎯 **Most Likely Fix:**

**90% of the time, it's the Network Access (IP Whitelist) issue.**

1. ✅ Go to Atlas → Network Access
2. ✅ Add `0.0.0.0/0` (allow all IPs for development)
3. ✅ Wait 1-2 minutes
4. ✅ Restart backend server

---

## 📝 **After Fixing:**

Once MongoDB connects, your backend should:
- ✅ Start successfully
- ✅ Set cookies properly
- ✅ Handle authentication correctly

The cookie issue (`Set-Cookie: null`) will be fixed once the backend is running properly!

