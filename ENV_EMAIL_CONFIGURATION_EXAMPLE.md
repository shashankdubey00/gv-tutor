# Email Configuration - What to Write in Each Field

## 📝 Complete Example

Here's exactly what to write in your `backend/.env` file:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=dubeyshashank444@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
EMAIL_FROM=dubeyshashank444@gmail.com
```

---

## 🔍 Field-by-Field Explanation

### 1. `EMAIL_SERVICE=gmail`
**What to write:** `gmail` (exactly like this, lowercase)

**Explanation:** Tells the system to use Gmail's email service

**Example:**
```env
EMAIL_SERVICE=gmail
```

---

### 2. `EMAIL_USER=your-email@gmail.com`
**What to write:** **YOUR actual Gmail address**

**Explanation:** Your Gmail account that will send emails

**Example (using your email):**
```env
EMAIL_USER=dubeyshashank444@gmail.com
```

**Or if you have a different Gmail:**
```env
EMAIL_USER=admin@gvtutor.com
EMAIL_USER=yourname@gmail.com
```

**Important:** Use the **exact email address** you use to log into Gmail

---

### 3. `EMAIL_PASSWORD=abcdefghijklmnop`
**What to write:** **The 16-character App Password you generated**

**Explanation:** The App Password from Google (NOT your regular password)

**Steps to get it:**
1. Go to App Passwords page
2. Select "Mail" or "Other (Custom name)"
3. Click "Generate"
4. Copy the 16-character password
5. **Remove spaces** when adding to `.env`

**Example:**
If Google shows: `abcd efgh ijkl mnop`
Write in `.env`: `EMAIL_PASSWORD=abcdefghijklmnop` (no spaces)

**Real example:**
```env
EMAIL_PASSWORD=wxyz1234abcd5678
```

---

### 4. `EMAIL_FROM=your-email@gmail.com`
**What to write:** **Same as EMAIL_USER** (usually)

**Explanation:** What users see in "From:" field of email

**Example (using your email):**
```env
EMAIL_FROM=dubeyshashank444@gmail.com
```

**Or with a display name:**
```env
EMAIL_FROM=GV Tutor <dubeyshashank444@gmail.com>
```

**Usually:** Same as `EMAIL_USER`

---

## ✅ Complete Example for Your Account

Based on your email `dubeyshashank444@gmail.com`, here's what your `.env` should look like:

```env
# Database
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Email Configuration - YOUR Gmail Account
EMAIL_SERVICE=gmail
EMAIL_USER=dubeyshashank444@gmail.com
EMAIL_PASSWORD=wxyz1234abcd5678
EMAIL_FROM=dubeyshashank444@gmail.com
```

**Replace:**
- `wxyz1234abcd5678` → Your actual 16-character App Password (no spaces)

---

## 📋 Step-by-Step

### Step 1: Get App Password
1. Go to App Passwords page
2. Select "Mail" → Generate
3. Copy the password (e.g., `abcd efgh ijkl mnop`)

### Step 2: Open `backend/.env` File
1. Navigate to `backend` folder
2. Open `.env` file (create if doesn't exist)

### Step 3: Add These Lines
```env
EMAIL_SERVICE=gmail
EMAIL_USER=dubeyshashank444@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
EMAIL_FROM=dubeyshashank444@gmail.com
```

**Important:**
- Replace `dubeyshashank444@gmail.com` with your actual email (if different)
- Replace `abcdefghijklmnop` with your actual App Password (remove spaces)

### Step 4: Save and Restart
1. Save the `.env` file
2. Restart your backend server

### Step 5: Test
```bash
node scripts/testEmailConfig.js
```

---

## ⚠️ Important Notes

### EMAIL_PASSWORD:
- ✅ Use **App Password** (16 characters)
- ❌ NOT your regular Gmail password
- ✅ Remove spaces (Google shows with spaces, remove them)
- ✅ Copy exactly as shown (case-sensitive)

### EMAIL_USER and EMAIL_FROM:
- ✅ Use your **actual Gmail address**
- ✅ Usually the same for both
- ✅ Must be the email you own and control

---

## 🎯 Quick Template

Copy this and fill in your App Password:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=dubeyshashank444@gmail.com
EMAIL_PASSWORD=PASTE_YOUR_16_CHAR_APP_PASSWORD_HERE
EMAIL_FROM=dubeyshashank444@gmail.com
```

**Just replace `PASTE_YOUR_16_CHAR_APP_PASSWORD_HERE` with your actual App Password!**

---

**Need help?** After you add the App Password, run `node scripts/testEmailConfig.js` to verify it works!
















