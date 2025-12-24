# Authentication Package - Quick Start Guide

## 📦 What's Included

This package contains a complete, production-ready authentication system with:

- ✅ JWT-based authentication
- ✅ httpOnly cookie storage
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting
- ✅ Role-based access control
- ✅ Protected routes middleware

## 🚀 Quick Setup

### Backend

1. **Copy files to your backend:**
   ```
   backend/src/models/User.js
   backend/src/models/UserProfile.js
   backend/src/controllers/authController.js
   backend/src/middleware/authMiddleware.js
   backend/src/middleware/rateLimiter.js
   backend/src/routes/authRoutes.js
   ```

2. **Install dependencies:**
   ```bash
   npm install express mongoose bcryptjs jsonwebtoken cookie-parser cors
   ```

3. **Add to your server (index.js):**
   ```javascript
   import cors from "cors";
   import cookieParser from "cookie-parser";
   import authRoutes from "./routes/authRoutes.js";
   
   app.use(cors({
     origin: process.env.CLIENT_URL || "http://localhost:5173",
     credentials: true,
     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allowedHeaders: ["Content-Type", "Authorization"],
     exposedHeaders: ["Set-Cookie"],
   }));
   
   app.use(express.json());
   app.use(cookieParser());
   app.use("/api/auth", authRoutes);
   ```

4. **Environment variables (.env):**
   ```env
   JWT_SECRET=your_super_secret_key_min_32_characters
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

### Frontend

1. **Copy files to your frontend:**
   ```
   frontend/src/services/api.js
   frontend/src/services/authService.js
   frontend/src/utils/authHelper.js
   ```

2. **Environment variables (.env):**
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```

3. **Use in your components:**
   ```javascript
   import { loginUser, signupUser, verifyAuth } from "./services/authService";
   
   // Login
   const handleLogin = async () => {
     const result = await loginUser({ email, password });
     if (result.success) {
       // Redirect to dashboard
     }
   };
   
   // Check auth
   useEffect(() => {
     verifyAuth().then(data => {
       if (data.success) {
         setUser(data.user);
       }
     });
   }, []);
   ```

## 🔒 Protect Routes

### Backend:
```javascript
import { protect } from "./middleware/authMiddleware.js";

router.get("/protected", protect, (req, res) => {
  // req.user contains { userId, role }
  res.json({ user: req.user });
});
```

### Frontend:
```javascript
useEffect(() => {
  verifyAuth().then(data => {
    if (!data.success) {
      navigate("/login");
    }
  });
}, []);
```

## 📚 Full Documentation

See `AUTHENTICATION_PACKAGE.md` for complete documentation, examples, and customization options.

## ✅ Features

- Secure password hashing
- JWT token authentication
- httpOnly cookies (XSS protection)
- Rate limiting
- Role-based access
- Automatic profile creation
- CORS configured
- Production-ready

---

**Ready to use!** Just copy the files and follow the setup instructions.

