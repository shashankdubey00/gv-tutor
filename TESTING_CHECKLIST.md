# Testing Checklist: Login & Signup Integration

## Prerequisites
1. ✅ Backend server running on port 5000 (or your configured PORT)
2. ✅ Frontend running (usually port 5173 for Vite)
3. ✅ MongoDB running and connected
4. ✅ Environment variables configured in both frontend and backend

## Environment Variables Check

### Backend (.env)
- [ ] `MONGO_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - At least 32 characters
- [ ] `CLIENT_URL` - Frontend URL (e.g., http://localhost:5173)
- [ ] `PORT` - Backend port (default: 5000)
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
- [ ] `GOOGLE_CALLBACK_URL` - e.g., http://localhost:5000/auth/google/callback

### Frontend (.env)
- [ ] `VITE_BACKEND_URL` - Backend URL (e.g., http://localhost:5000)

## Test 1: Email/Password Signup

1. **Navigate to Signup page**
   - [ ] Page loads correctly
   - [ ] Form fields are visible

2. **Test Invalid Inputs**
   - [ ] Try empty email/password → Should show error
   - [ ] Try invalid email format → Should show "Invalid email format"
   - [ ] Try weak password (less than 8 chars) → Should show password requirements
   - [ ] Try password without uppercase → Should show error
   - [ ] Try password without number → Should show error

3. **Test Valid Signup**
   - [ ] Enter valid email (e.g., test@example.com)
   - [ ] Enter strong password (e.g., Test1234)
   - [ ] Submit form
   - [ ] Should redirect to `/login` page
   - [ ] Should show success (no error message)

4. **Test Duplicate Signup**
   - [ ] Try signing up with same email again
   - [ ] Should show "User already exists" error

## Test 2: Email/Password Login

1. **Navigate to Login page**
   - [ ] Page loads correctly
   - [ ] Form fields are visible

2. **Test Invalid Login**
   - [ ] Try wrong email → Should show "Invalid credentials"
   - [ ] Try wrong password → Should show "Invalid credentials"
   - [ ] Try empty fields → Should show "Email and password required"
   - [ ] Try invalid email format → Should show "Invalid email format"

3. **Test Valid Login**
   - [ ] Enter correct email and password
   - [ ] Submit form
   - [ ] Should redirect to home page (`/`)
   - [ ] Cookie should be set (check browser DevTools → Application → Cookies)

4. **Test Remember Me**
   - [ ] Login with "Remember me" checked
   - [ ] Cookie should have 7-day expiration
   - [ ] Login without "Remember me"
   - [ ] Cookie should have 1-day expiration

## Test 3: Google OAuth

1. **Test Google Login Button**
   - [ ] Click "Login with Google" on Login page
   - [ ] Should redirect to Google OAuth page
   - [ ] After Google authentication, should redirect back to home page
   - [ ] Cookie should be set

2. **Test Google Signup Button**
   - [ ] Click "Sign up with Google" on Signup page
   - [ ] Should redirect to Google OAuth page
   - [ ] After Google authentication, should create account and redirect to home page
   - [ ] Cookie should be set

3. **Test Google OAuth Error Handling**
   - [ ] If Google auth fails, should redirect to login with error message
   - [ ] Error should be displayed on login page

## Test 4: Integration Checks

1. **CORS Configuration**
   - [ ] Frontend can make requests to backend
   - [ ] Cookies are sent with requests (check Network tab)
   - [ ] No CORS errors in browser console

2. **Cookie Settings**
   - [ ] Cookie is `httpOnly` (check in DevTools)
   - [ ] Cookie has correct `sameSite` setting
   - [ ] Cookie is sent with subsequent requests

3. **Error Messages**
   - [ ] All error messages display correctly on frontend
   - [ ] Error messages are user-friendly
   - [ ] Network errors are handled gracefully

## Common Issues & Solutions

### Issue: CORS Error
**Solution:** Check that `CLIENT_URL` in backend matches your frontend URL exactly (including port)

### Issue: Cookie Not Set
**Solution:** 
- Check CORS `credentials: true` is set
- Check cookie `sameSite` setting (should be "lax" for development)
- Check that frontend uses `credentials: "include"` in fetch

### Issue: Google OAuth Not Working
**Solution:**
- Verify Google OAuth credentials in Google Cloud Console
- Check `GOOGLE_CALLBACK_URL` matches exactly what's configured in Google Console
- Ensure authorized redirect URIs include your callback URL

### Issue: "Invalid credentials" on correct login
**Solution:**
- Check MongoDB connection
- Verify user exists in database
- Check password hashing is working

### Issue: Rate Limiting Too Strict
**Solution:** Adjust rate limiter settings in `backend/src/middleware/rateLimiter.js`

## Browser DevTools Checks

1. **Network Tab**
   - [ ] Requests to `/auth/login` return 200 status
   - [ ] Requests to `/auth/signup` return 201 status
   - [ ] Response includes `Set-Cookie` header
   - [ ] No 429 (rate limit) errors unless testing rate limiting

2. **Application Tab → Cookies**
   - [ ] Cookie named "token" exists after login
   - [ ] Cookie has correct domain
   - [ ] Cookie is httpOnly

3. **Console Tab**
   - [ ] No JavaScript errors
   - [ ] No CORS errors
   - [ ] No network errors

## Next Steps After Testing

Once all tests pass:
1. ✅ Authentication flow is working
2. ✅ Ready to add protected routes
3. ✅ Ready to add user profile features
4. ✅ Ready to add logout functionality

