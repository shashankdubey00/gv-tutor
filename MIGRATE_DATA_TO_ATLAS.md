# 📦 Migrate Data from Local MongoDB to MongoDB Atlas

## 🔍 **The Problem**

You have data in:

- ✅ **Local MongoDB** (localhost:27017) - Shows data in Compass
- ❌ **MongoDB Atlas** (cloud) - Empty

These are **two separate databases**. You need to migrate your data from local to Atlas.

---

## 🎯 **Solution: Migrate Your Data**

### **Option 1: Using MongoDB Compass (Easiest - Recommended)**

#### **Step 1: Export from Local MongoDB**

1. **Open MongoDB Compass**
2. **Connect to Local MongoDB:**

   - Connection string: `mongodb://127.0.0.1:27017`
   - Click "Connect"

3. **Select `gv_tutor` database**

4. **For each collection (`users`, `tutorprofiles`, `tutorrequests`):**
   - Click on the collection
   - Click "Export Collection" (top right)
   - Choose format: **JSON**
   - Save the file (e.g., `users.json`, `tutorprofiles.json`, `tutorrequests.json`)

#### **Step 2: Import to MongoDB Atlas**

1. **In MongoDB Compass, connect to Atlas:**

   - Click "New Connection"
   - Paste your Atlas connection string:
     ```
     mongodb+srv://dubeyshashank444_db_user:9mKt21cFZLGmuclr@cluster0.qttkeob.mongodb.net/gv_tutor?retryWrites=true&w=majority
     ```
   - Click "Connect"

2. **Select `gv_tutor` database**

3. **For each collection:**
   - Click "Add Data" → "Import File"
   - Select the JSON file you exported
   - Choose "JSON or CSV file"
   - Click "Import"

---

### **Option 2: Using mongodump/mongorestore (Command Line)**

#### **Step 1: Export from Local**

```bash
# Export entire database
mongodump --uri="mongodb://127.0.0.1:27017/gv_tutor" --out=./backup

# Or export specific collections
mongodump --uri="mongodb://127.0.0.1:27017/gv_tutor" --collection=users --out=./backup
mongodump --uri="mongodb://127.0.0.1:27017/gv_tutor" --collection=tutorprofiles --out=./backup
mongodump --uri="mongodb://127.0.0.1:27017/gv_tutor" --collection=tutorrequests --out=./backup
```

#### **Step 2: Import to Atlas**

```bash
# Import entire database
mongorestore --uri="mongodb+srv://dubeyshashank444_db_user:9mKt21cFZLGmuclr@cluster0.qttkeob.mongodb.net/gv_tutor" ./backup/gv_tutor

# Or import specific collections
mongorestore --uri="mongodb+srv://dubeyshashank444_db_user:9mKt21cFZLGmuclr@cluster0.qttkeob.mongodb.net/gv_tutor" --collection=users ./backup/gv_tutor/users.bson
mongorestore --uri="mongodb+srv://dubeyshashank444_db_user:9mKt21cFZLGmuclr@cluster0.qttkeob.mongodb.net/gv_tutor" --collection=tutorprofiles ./backup/gv_tutor/tutorprofiles.bson
mongorestore --uri="mongodb+srv://dubeyshashank444_db_user:9mKt21cFZLGmuclr@cluster0.qttkeob.mongodb.net/gv_tutor" --collection=tutorrequests ./backup/gv_tutor/tutorrequests.bson
```

---

### **Option 3: Using MongoDB Atlas Web Interface**

1. **Go to Atlas Dashboard:**

   - https://cloud.mongodb.com/
   - Click "Database" → "Browse Collections"

2. **For each collection:**
   - Click on the collection (e.g., `users`)
   - Click "Add Data" → "Insert Document"
   - Manually copy data from Compass (not recommended for large datasets)

---

## ✅ **After Migration: Verify**

1. **Check Atlas Dashboard:**

   - Go to "Browse Collections"
   - You should see your data in `users`, `tutorprofiles`, `tutorrequests`

2. **Test Your App:**
   - Make sure your backend `.env` has Atlas connection string
   - Restart your backend server
   - Try logging in with existing accounts
   - Data should work from Atlas now

---

## 🔄 **Important: Update Backend Connection**

**Make sure your `backend/.env` file has:**

```env
MONGO_URI=mongodb+srv://dubeyshashank444_db_user:9mKt21cFZLGmuclr@cluster0.qttkeob.mongodb.net/gv_tutor?retryWrites=true&w=majority&appName=Cluster0
```

**NOT:**

```env
MONGO_URI=mongodb://127.0.0.1:27017/gv_tutor  ❌ (This is local)
```

---

## 🎯 **Quick Steps Summary**

1. ✅ Export data from local MongoDB (Compass)
2. ✅ Import data to Atlas (Compass or command line)
3. ✅ Verify data appears in Atlas
4. ✅ Update backend `.env` to use Atlas connection string
5. ✅ Restart backend server
6. ✅ Test your app

---

## 💡 **Why This Happened**

- **Local MongoDB** (`localhost:27017`) = Database on your computer
- **MongoDB Atlas** = Cloud database (separate, empty by default)
- They are **completely separate** - data doesn't automatically sync
- You need to **manually migrate** data from local to Atlas

---

## 🚀 **After Migration**

Once data is in Atlas:

- ✅ Your app will use cloud database
- ✅ Data accessible from anywhere
- ✅ Automatic backups
- ✅ No need for local MongoDB running

You can keep local MongoDB for development, but your production app will use Atlas.
