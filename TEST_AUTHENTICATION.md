# ✅ Authentication Testing Checklist

## 🎯 **What to Test**

### **1. Backend Server Connection**
- ✅ Check terminal shows: `✅ MongoDB connected successfully`
- ✅ Host should be: `cluster0.qttkeob.mongodb.net` (not `127.0.0.1`)

### **2. User Signup**
- ✅ Go to `/signup`
- ✅ Create a new account
- ✅ Check if user appears in Atlas `users` collection

### **3. User Login**
- ✅ Go to `/login`
- ✅ Login with existing account (from migrated data)
- ✅ Should redirect based on role:
  - **Student** → Home page
  - **Tutor (profile incomplete)** → `/complete-profile`
  - **Tutor (profile complete)** → `/apply-tutor`
  - **Admin** → `/admin/dashboard`

### **4. Google OAuth Login**
- ✅ Click "Login with Google"
- ✅ Complete Google authentication
- ✅ Should redirect correctly based on role

### **5. Session Persistence**
- ✅ After login, refresh page
- ✅ Should stay logged in (cookie working)
- ✅ Navbar should show user info

### **6. Logout**
- ✅ Click logout
- ✅ Should clear session
- ✅ Should redirect to login/home

### **7. Protected Routes**
- ✅ Try accessing `/apply-tutor` without login
- ✅ Should redirect to `/login`
- ✅ Try accessing `/admin/dashboard` without admin login
- ✅ Should redirect to `/admin/login`

### **8. Admin Login**
- ✅ Go to `/admin/login`
- ✅ Login with admin credentials
- ✅ Should redirect to `/admin/dashboard`
- ✅ Should see admin profile icon

---

## 🔍 **How to Verify Data in Atlas**

1. **Go to Atlas Dashboard:**
   - https://cloud.mongodb.com/
   - Click "Database" → "Browse Collections"

2. **Check `users` collection:**
   - Should see all your users
   - New signups should appear here

3. **Check `tutorprofiles` collection:**
   - Should see tutor profiles
   - New profiles should appear here

4. **Check `tutorrequests` collection:**
   - Should see tutor requests
   - New requests should appear here

---

## 🐛 **Common Issues & Fixes**

### **Issue: "Authentication failed"**
- ✅ Check username/password in connection string
- ✅ Verify IP is whitelisted in Atlas Network Access
- ✅ Check backend terminal for error messages

### **Issue: "User not found" after login**
- ✅ Verify data was migrated correctly
- ✅ Check `users` collection in Atlas has your users
- ✅ Verify email matches exactly (case-sensitive)

### **Issue: "Cannot connect to server"**
- ✅ Check backend server is running
- ✅ Verify `.env` has correct Atlas connection string
- ✅ Check internet connection

### **Issue: "Redirect loops"**
- ✅ Clear browser cookies
- ✅ Check `isTutorProfileComplete` field in user document
- ✅ Verify redirect logic in frontend

---

## 📊 **Expected Behavior**

### **For Students:**
- Login → Home page
- Can browse tutors
- Can submit tutor requests

### **For Tutors:**
- Login (no profile) → `/complete-profile`
- Login (with profile) → `/apply-tutor`
- Can view profile at `/profile`
- Can see available positions

### **For Admins:**
- Login → `/admin/dashboard`
- Can see all applications
- Can manage tutor requests
- Can view tutor members

---

## ✅ **Success Indicators**

- ✅ Backend connects to Atlas (not localhost)
- ✅ Can signup new users
- ✅ Can login with existing accounts
- ✅ Data appears in Atlas collections
- ✅ Sessions persist (stay logged in)
- ✅ Role-based redirects work
- ✅ Protected routes work
- ✅ Logout works

---

## 🎉 **You're Done When:**

1. ✅ All authentication flows work
2. ✅ Data is saved in Atlas (not local)
3. ✅ Can see data in Atlas dashboard
4. ✅ No errors in browser console
5. ✅ No errors in backend terminal

---

**Good luck with testing! 🚀**

