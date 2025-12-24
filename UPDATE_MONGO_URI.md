# 🔄 Update MongoDB URI to Atlas

## ✅ Your MongoDB Atlas Connection String

You provided:
```
mongodb+srv://dubeyshashank444_db_user:9mKt21cFZLGmuclr@cluster0.qttkeob.mongodb.net/?appName=Cluster0
```

## 📝 Formatted Connection String (with database name)

Add `/gv_tutor` before the `?` to specify your database name:

```
mongodb+srv://dubeyshashank444_db_user:9mKt21cFZLGmuclr@cluster0.qttkeob.mongodb.net/gv_tutor?retryWrites=true&w=majority&appName=Cluster0
```

---

## 🔧 Steps to Update

### 1. Open your `.env` file
Location: `backend/.env`

### 2. Find this line:
```env
MONGO_URI=mongodb://127.0.0.1:27017/gv_tutor
```

### 3. Replace it with:
```env
MONGO_URI=mongodb+srv://dubeyshashank444_db_user:9mKt21cFZLGmuclr@cluster0.qttkeob.mongodb.net/gv_tutor?retryWrites=true&w=majority&appName=Cluster0
```

### 4. Save the file

### 5. Restart your backend server
```bash
# Stop current server (Ctrl+C if running)
# Then restart:
cd backend
npm run dev
```

---

## ✅ Expected Output

After restarting, you should see:
```
✅ MongoDB connected successfully
📊 Database: gv_tutor
🌐 Host: cluster0.qttkeob.mongodb.net
```

**Notice:** The host changed from `127.0.0.1` to `cluster0.qttkeob.mongodb.net` - that means you're now using MongoDB Atlas! 🎉

---

## ⚠️ Important Notes

1. **Network Access**: Make sure you've added your IP address to MongoDB Atlas Network Access whitelist
   - Go to Atlas Dashboard → Network Access
   - Add your current IP or allow `0.0.0.0/0` for development

2. **Database Name**: The connection string uses `/gv_tutor` as the database name
   - If you want a different name, change `gv_tutor` in the connection string

3. **Security**: Never commit your `.env` file to git (it contains your password!)

---

## 🐛 Troubleshooting

### If you see "Authentication failed":
- ✅ Check username and password are correct
- ✅ Make sure password doesn't have special characters that need encoding

### If you see "IP not whitelisted":
- ✅ Go to Atlas Dashboard → Network Access
- ✅ Add your IP address or allow `0.0.0.0/0` for development

### If you see "Connection timeout":
- ✅ Check your internet connection
- ✅ Verify cluster is running (not paused) in Atlas dashboard

---

## 🎯 Quick Copy-Paste

Just copy this entire line into your `backend/.env` file:

```env
MONGO_URI=mongodb+srv://dubeyshashank444_db_user:9mKt21cFZLGmuclr@cluster0.qttkeob.mongodb.net/gv_tutor?retryWrites=true&w=majority&appName=Cluster0
```

