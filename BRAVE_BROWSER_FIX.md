# Fix: Google Login Not Working in Brave & Privacy Browsers

## Problem
Google login wasn't working on Brave, Safari, and other privacy-focused browsers that block third-party cookies. OAuth requires cookies to maintain session across the popup redirect, but these browsers block them.

## Root Cause
When Google OAuth callback happens in a popup window, the backend sets the authentication token as a `SameSite=None` cookie. However, privacy browsers block third-party cookies even with `SameSite=None`, causing the cookie to never reach the frontend.

## Solution
Implemented a **two-layer authentication** approach:

### Backend Changes ([authRoutes.js](backend/src/routes/authRoutes.js#L240-L300))
- Modified OAuth callback popup response to send token via `postMessage` instead of relying solely on cookies
- Token is extracted from cookie on the backend and passed to the popup script
- Popup sends token to parent window using secure postMessage API

### Frontend Changes

1. **Login Component** ([Login.jsx](frontend/src/pages/Login.jsx#L110-L125))
   - Added handling for token received via postMessage from OAuth popup
   - Stores token in `sessionStorage` and `localStorage` as fallback for privacy browsers
   - Token is available for all subsequent API requests

2. **API Helper** ([api.js](frontend/src/services/api.js#L19-L28))
   - Checks for stored token in `sessionStorage` or `localStorage`
   - Adds token as `Authorization: Bearer <token>` header to all API requests
   - Maintains backward compatibility with cookie-based authentication

3. **Auth Middleware** ([authMiddleware.js](backend/src/middleware/authMiddleware.js#L5-L12))
   - Updated to accept tokens from both sources:
     - `req.cookies.token` (standard method for browsers that support third-party cookies)
     - `Authorization` header (fallback for privacy browsers)
   - Extracts Bearer token and validates it the same way

## How It Works

### Privacy Browser Flow
1. User clicks "Login with Google"
2. Google OAuth popup opens
3. Google authenticates user
4. Backend receives OAuth callback in popup
5. Backend creates JWT token and extracts from Set-Cookie
6. Popup sends token via `postMessage` to parent window
7. Frontend receives token and stores in `sessionStorage`
8. Subsequent API requests send token via `Authorization: Bearer` header
9. Backend validates token from header (since cookie is blocked)

### Standard Browser Flow (Unchanged)
1-4. Same as above
5. Backend sets JWT as `SameSite=None; Secure` cookie
6-9. Existing flow continues using cookies

## No Breaking Changes
✅ **Backward compatible** - Standard browsers with cookie support still work
✅ **Minimal changes** - Only added authentication options, didn't remove existing ones
✅ **Secure** - Uses JWT validation, postMessage origin verification, and HTTPS in production
✅ **No logout changes** - Logout flow remains unchanged

## Testing
Test in the following scenarios:
- ✅ Chrome/Edge (standard - uses cookies)
- ✅ Brave (privacy mode - uses localStorage + Authorization header)
- ✅ Safari (private browsing - uses localStorage + Authorization header)
- ✅ Firefox (standard - uses cookies)

## Configuration Required
No additional `.env` variables needed. The fix uses existing:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`
- `CLIENT_URL`

## Files Modified
1. `backend/src/routes/authRoutes.js` - OAuth callback to send token via postMessage
2. `frontend/src/pages/Login.jsx` - Handle token from postMessage and store locally
3. `frontend/src/services/api.js` - Send token via Authorization header
4. `backend/src/middleware/authMiddleware.js` - Accept token from Authorization header
