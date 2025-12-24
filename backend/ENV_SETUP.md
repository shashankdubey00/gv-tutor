# Environment Variables Setup

## Required Variables for Backend

Add these to your `backend/.env` file:

```env
# Database
MONGO_URI=mongodb://127.0.0.1:27017/gv_tutor

# JWT Secret (use a strong random string, at least 32 characters)
JWT_SECRET=c7e74fc4d00253c4bc4d9453dead7c28c21441c94793f2d416ed42e29fabb470

# Server
PORT=5000
NODE_ENV=development

# Client URL (frontend URL)
CLIENT_URL=http://localhost:5173

# Google OAuth (get these from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
```

## Quick Fix for Missing JWT_SECRET

**Option 1: Use the generated secret above**

- Copy the JWT_SECRET value from above
- Add it to your `backend/.env` file

**Option 2: Generate your own**
Run this command in terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then copy the output and add to your `.env` file as:

```
JWT_SECRET=<paste-generated-value-here>
```

## Important Notes

1. **Never commit `.env` file to git** - it contains secrets!
2. **JWT_SECRET** should be at least 32 characters (longer is better)
3. **For production**, use an even stronger secret (64+ characters)
4. **Google OAuth** - You need to set up OAuth credentials in Google Cloud Console if you want Google login to work

## Current Status

Based on your error, you're missing:

- ✅ JWT_SECRET (add this now!)

After adding JWT_SECRET, your server should start. If you're not using Google OAuth yet, you can use placeholder values for:

- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_CALLBACK_URL

But the validation will still require them. You can temporarily comment out the validation if needed for testing email/password auth only.
