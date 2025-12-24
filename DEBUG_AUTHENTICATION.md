# 🐛 Debugging Authentication Issues

## ✅ **What I've Added**

1. **Extensive Console Logging** - Now you can see exactly what's happening
2. **Better Error Messages** - More detailed error information
3. **Cookie Debugging** - Logs when cookies are set/verified

---

## 🔍 **How to Debug**

### **Step 1: Open Browser Console**
1. Press `F12` in your browser
2. Go to "Console" tab
3. Clear the console (click 🚫 icon)

### **Step 2: Try Login**
1. Go to `/login`
2. Enter email and password
3. Click "Login"
4. **Watch the console** - You should see:
   ```
   🔐 Attempting login for: your@email.com
   ✅ Login API response: {success: true, ...}
   🔍 Verifying authentication...
   ✅ Auth verification result: {success: true, user: {...}}
   ✅ Login successful, user role: student/tutor/admin
   ➡️ Redirecting...
   ```

### **Step 3: Check Backend Terminal**
You should see:
```
🔐 Setting login cookie for user: your@email.com Role: student
✅ Login cookie set successfully
✅ protect middleware: Token verified for user: ... Role: student
```

### **Step 4: Check Navbar**
After login, the Navbar should log:
```
🔍 Navbar: Checking authentication...
✅ Navbar: Auth data: {success: true, user: {...}}
👤 Navbar: User logged in: your@email.com Role: student
```

---

## 🐛 **Common Issues & Solutions**

### **Issue 1: "Login successful but session verification failed"**

**Symptoms:**
- Login API succeeds
- But verifyAuth fails

**Possible Causes:**
1. Cookie not being set (check backend logs)
2. Cookie not being sent (check browser DevTools → Application → Cookies)
3. CORS issue (check browser console for CORS errors)

**Solution:**
1. Check backend terminal - should see "✅ Login cookie set successfully"
2. Check browser DevTools → Application → Cookies → Should see `token` cookie
3. Check browser console for CORS errors
4. Verify `CLIENT_URL` in backend `.env` matches your frontend URL

---

### **Issue 2: "Navbar shows login/signup buttons after login"**

**Symptoms:**
- Login succeeds
- Redirects to home page
- But Navbar still shows login/signup buttons

**Possible Causes:**
1. `verifyAuth()` failing in Navbar
2. Cookie not accessible to Navbar
3. User state not updating

**Solution:**
1. Check browser console - should see Navbar auth logs
2. Check if `token` cookie exists in DevTools → Application → Cookies
3. Check backend terminal - should see "✅ protect middleware: Token verified"
4. Try refreshing the page

---

### **Issue 3: "All users are tutors"**

**Symptoms:**
- New signups are being created as tutors
- Should be students

**Solution:**
1. Check backend terminal when signing up - should see:
   ```
   📝 Creating user with role: student from provided role: undefined
   ```
2. Check MongoDB Atlas - verify `role` field in `users` collection
3. If role is wrong, update it manually in Atlas:
   ```javascript
   // In MongoDB Atlas, update user:
   { role: "student" }
   ```

---

### **Issue 4: "Backend connection error on Apply as Tutor page"**

**Symptoms:**
- Error: "Cannot connect to server"
- "Request timed out"

**Solution:**
1. **Check if backend is running:**
   ```bash
   cd backend
   npm run dev
   ```
   Should see: `Server running` and `✅ MongoDB connected successfully`

2. **Check backend URL:**
   - Frontend `.env`: `VITE_BACKEND_URL=http://localhost:5000`
   - Backend `.env`: `PORT=5000`

3. **Test backend directly:**
   - Open: http://localhost:5000/api/auth/verify
   - Should return JSON (even if error, connection works)

4. **Check CORS:**
   - Backend should allow `http://localhost:5173`
   - Check `CLIENT_URL` in backend `.env`

---

## 🔧 **Quick Fixes**

### **Fix 1: Clear Everything and Retry**
```bash
# 1. Stop backend (Ctrl+C)
# 2. Clear browser cookies (F12 → Application → Cookies → Delete all)
# 3. Restart backend
cd backend
npm run dev

# 4. In browser: Hard refresh (Ctrl+Shift+R)
# 5. Try login again
```

### **Fix 2: Check Cookie Settings**
1. Open DevTools → Application → Cookies
2. Look for `token` cookie
3. Should have:
   - Name: `token`
   - Value: (long JWT string)
   - Domain: `localhost`
   - Path: `/`
   - HttpOnly: ✅
   - SameSite: `Lax`

### **Fix 3: Verify Environment Variables**
**Backend `.env`:**
```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-here
PORT=5000
CLIENT_URL=http://localhost:5173
```

**Frontend `.env`:**
```env
VITE_BACKEND_URL=http://localhost:5000
```

---

## 📊 **What to Check in Console**

### **Successful Login Flow:**
```
🔐 Attempting login for: user@example.com
✅ Login API response: {success: true, message: "Login successful"}
🔍 Verifying authentication...
✅ Auth verification result: {success: true, user: {email: "...", role: "student"}}
✅ Login successful, user role: student
➡️ Redirecting student to home
🔍 Navbar: Checking authentication...
✅ Navbar: Auth data: {success: true, user: {...}}
👤 Navbar: User logged in: user@example.com Role: student
```

### **Failed Login Flow:**
```
🔐 Attempting login for: user@example.com
❌ Login error: Invalid credentials
```

### **Cookie Not Set:**
```
✅ Login API response: {success: true}
🔍 Verifying authentication...
❌ API Request Failed: /auth/verify (timeout)
❌ Auth verification failed after login
```

---

## 🎯 **Next Steps**

1. ✅ **Open browser console** (F12)
2. ✅ **Try logging in** with email/password
3. ✅ **Copy all console logs** and share them
4. ✅ **Check backend terminal** logs
5. ✅ **Check if cookie exists** in DevTools → Application → Cookies

**Share the console logs and I'll help you fix the exact issue!**

