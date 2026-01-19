# Email Configuration for Password Reset

## 📧 Setting Up Email Service

The password reset feature requires email configuration. Choose one of the following options:

### Option 1: Gmail (Easiest for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account → Security
   - Under "2-Step Verification", click "App passwords"
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Add to `.env` file**:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=your-email@gmail.com
```

### Option 2: Custom SMTP (Any Email Provider)

Works with most email providers (Outlook, Yahoo, custom domains, etc.)

**Add to `.env` file**:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-password
EMAIL_FROM=your-email@gmail.com
```

**Common SMTP Settings:**
- **Gmail**: `smtp.gmail.com:587`
- **Outlook**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`

### Option 3: Development Testing (Ethereal Email)

If you don't configure email, the system will use **Ethereal Email** in development mode:
- Creates a test email account
- Logs the email preview URL to console
- **Doesn't send real emails** - use for testing only

**No configuration needed** - works automatically in development mode.

## 🔧 Environment Variables

Add these to your `backend/.env` file:

```env
# Email Configuration (Choose one method above)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com

# OR use SMTP
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASSWORD=your-password
# EMAIL_FROM=your-email@gmail.com
```

## 🚀 How It Works

1. **User requests password reset** → Enters email
2. **System generates secure token** → Valid for 1 hour
3. **Email sent with reset link** → Contains token
4. **User clicks link** → Opens reset password page
5. **User enters new password** → Token validated
6. **Password updated** → User can login

## 📝 Email Template

The email includes:
- Professional HTML design
- Reset button
- Plain text fallback
- Security message (1 hour expiration)
- Branding

## 🔒 Security Features

- ✅ **Token hashing** - Stored as SHA-256 hash in database
- ✅ **Expiration** - Tokens expire after 1 hour
- ✅ **One-time use** - Token cleared after password reset
- ✅ **Secure generation** - Crypto.randomBytes for tokens

## 🧪 Testing

### Test with Ethereal Email (Development)
1. Don't configure email settings
2. Request password reset
3. Check console for: `📧 Email sent! Preview URL: https://ethereal.email/...`
4. Click the preview URL to see the email

### Test with Real Email
1. Configure Gmail or SMTP
2. Request password reset
3. Check your email inbox
4. Click the reset link
5. Set new password

## ⚠️ Troubleshooting

### "Email service not configured"
- Add email configuration to `.env` file
- Restart backend server

### "Failed to send email"
- Check email credentials
- Verify SMTP settings
- Check firewall/network restrictions
- For Gmail: Use app password, not regular password

### Email not received
- Check spam folder
- Verify email address is correct
- Check email service logs
- Try Ethereal Email for testing

## 📚 Production Recommendations

For production, use a professional email service:

1. **SendGrid** - Free tier: 100 emails/day
2. **Mailgun** - Free tier: 5,000 emails/month
3. **AWS SES** - Very affordable, pay per email
4. **Postmark** - Great deliverability

These services provide:
- Better deliverability
- Email analytics
- Bounce handling
- Higher sending limits

---

**Ready to use!** Configure your email settings and restart the server.
















