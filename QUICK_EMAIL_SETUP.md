# Quick Email Setup Guide

## 🚨 You're Not Getting Emails Because...

If you're not receiving emails, it's likely because:

1. **No email configuration** - System is using Ethereal Email (test mode)
2. **Check your console** - Look for "📧 Email sent! Preview URL:" message
3. **Ethereal doesn't send real emails** - It only creates preview URLs

## ✅ Quick Fix: Set Up Gmail (5 Minutes)

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "2-Step Verification" if not already enabled

### Step 2: Generate App Password
1. Still in Security settings, find "App passwords"
2. Click "App passwords" (you may need to sign in again)
3. Select "Mail" as the app
4. Select "Other (Custom name)" and type "GV Tutor"
5. Click "Generate"
6. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

### Step 3: Add to .env File
Open `backend/.env` and add:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
EMAIL_FROM=your-email@gmail.com
```

**Important:**
- Replace `your-email@gmail.com` with your actual Gmail
- Replace `abcdefghijklmnop` with the 16-character app password (remove spaces)
- Use the **app password**, NOT your regular Gmail password

### Step 4: Restart Server
```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### Step 5: Test
1. Go to forgot password page
2. Enter your email
3. Check your inbox (and spam folder)
4. You should receive the email!

## 🔍 How to Check What's Happening

### Check Console Output

**If using Ethereal (no config):**
```
⚠️  NO EMAIL CONFIGURATION FOUND!
📧 Using Ethereal Email (TEST MODE)
📧 Preview URL: https://ethereal.email/...
```
→ Click the preview URL to see the email (not sent to real inbox)

**If using Gmail (configured):**
```
✅ PASSWORD RESET EMAIL SENT
✅ To: your-email@gmail.com
```
→ Check your inbox!

**If there's an error:**
```
❌ ERROR SENDING EMAIL
❌ Authentication failed!
```
→ Check your credentials

## 🎯 Alternative: Use SMTP (Any Email Provider)

If you don't want to use Gmail, use SMTP:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
```

**Common SMTP Settings:**
- **Gmail**: `smtp.gmail.com:587`
- **Outlook**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`

## ⚠️ Troubleshooting

### "Authentication failed"
- ✅ Use **App Password**, not regular password
- ✅ Make sure 2FA is enabled
- ✅ Check for typos in .env file

### "Connection failed"
- ✅ Check internet connection
- ✅ Verify SMTP host and port
- ✅ Check firewall settings

### Email not in inbox
- ✅ Check spam/junk folder
- ✅ Wait a few minutes
- ✅ Verify email address is correct
- ✅ Check console for errors

### Still using Ethereal
- ✅ Make sure .env file is in `backend/` folder
- ✅ Restart server after adding config
- ✅ Check for typos in variable names

## 📝 Example .env File

```env
# Database
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Email (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=your-email@gmail.com
```

---

**Need help?** Check the console output - it will tell you exactly what's happening!

