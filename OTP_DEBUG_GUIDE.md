# OTP Debugging Guide

## 🔍 Why You're Not Getting OTP

If you're not receiving the OTP email, check these:

### Step 1: Check Backend Console

When you click "Send OTP", check your **backend terminal/console** (where `npm run dev` is running).

You should see:
```
📧 Forgot password request for: your-email@gmail.com
✅ User found with password. Generating OTP...
🔢 Generated OTP: 123456
💾 OTP saved to database
📤 Attempting to send email to: your-email@gmail.com
```

### Step 2: Find the OTP

**The OTP is now printed in your backend console!** Look for:
```
🔑 =========================================
🔑 OTP FOR TESTING: 123456
🔑 Email: your-email@gmail.com
🔑 Valid for 10 minutes
🔑 =========================================
```

**You can use this OTP to test!** Just copy it from the console and paste it in the verification page.

### Step 3: Check Email Status

#### If Email is Configured (Gmail):
You should see:
```
✅ Password reset OTP sent successfully to: your-email@gmail.com
```
- Check your email inbox
- Check spam/junk folder
- Wait a few minutes

#### If Email is NOT Configured (Ethereal):
You should see:
```
⚠️  NO EMAIL CONFIGURATION FOUND!
📧 Using Ethereal Email (TEST MODE)
📧 Preview URL: https://ethereal.email/message/...
```
- **Click the preview URL** to see the email
- The OTP will be in that email
- **Ethereal doesn't send real emails** - it's for testing only

### Step 4: Common Issues

#### Issue 1: "User not found" or "User found but no password"
```
ℹ️ User not found: your-email@gmail.com
```
**Solution:** 
- Make sure you're using the email you signed up with
- Make sure you signed up with email/password (not just Google)

#### Issue 2: Email sending failed
```
❌ Failed to send email: [error message]
🔑 OTP GENERATED BUT EMAIL FAILED: 123456
```
**Solution:**
- The OTP is still shown in console - use it to test
- Configure email in `backend/.env` (see EMAIL_SETUP.md)
- Check error message for details

#### Issue 3: No logs in backend console
**Solution:**
- Make sure backend server is running
- Check if request is reaching backend
- Check network tab in browser console

## 🚀 Quick Test

1. **Open backend console** (terminal where server runs)
2. **Go to forgot password page**
3. **Enter your email**
4. **Click "Send OTP"**
5. **Check backend console** - you'll see the OTP!
6. **Copy the OTP** from console
7. **Paste it** in the verification page

## 📧 To Get Real Emails

Configure Gmail in `backend/.env`:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
```

See `QUICK_EMAIL_SETUP.md` for detailed instructions.

---

**The OTP is always shown in backend console for debugging!**













