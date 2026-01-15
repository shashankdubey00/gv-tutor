# 🚀 Quick Start - Copy Authentication to New Project

## ⚡ 5-Minute Setup

### Step 1: Copy Files

**Backend:**
```bash
# Copy these files to your backend project
cp -r backend/src/models/User.js your-project/backend/src/models/
cp -r backend/src/models/UserProfile.js your-project/backend/src/models/
cp -r backend/src/controllers/authController.js your-project/backend/src/controllers/
cp -r backend/src/middleware/* your-project/backend/src/middleware/
cp -r backend/src/routes/authRoutes.js your-project/backend/src/routes/
cp -r backend/src/config/passport.js your-project/backend/src/config/
cp -r backend/src/config/db.js your-project/backend/src/config/
cp -r backend/src/config/env.js your-project/backend/src/config/
```

**Frontend:**
```bash
# Copy these files to your frontend project
cp -r frontend/src/services/* your-project/frontend/src/services/
cp -r frontend/src/components/PasswordStrength.jsx your-project/frontend/src/components/
cp -r frontend/src/pages/Login.jsx your-project/frontend/src/pages/
cp -r frontend/src/pages/Signup.jsx your-project/frontend/src/pages/
cp -r frontend/src/pages/ForgotPassword.jsx your-project/frontend/src/pages/
cp -r frontend/src/pages/VerifyOTP.jsx your-project/frontend/src/pages/
cp -r frontend/src/pages/ChangePassword.jsx your-project/frontend/src/pages/
cp -r frontend/src/pages/SetPassword.jsx your-project/frontend/src/pages/
```

### Step 2: Install Dependencies

**Backend:**
```bash
cd your-project/backend
npm install express mongoose bcryptjs jsonwebtoken cookie-parser cors dotenv passport passport-google-oauth20
```

**Frontend:**
```bash
cd your-project/frontend
npm install react-router-dom
```

### Step 3: Add Environment Variables

**Backend `.env`:**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/your-db
JWT_SECRET=your_32_character_secret_key_here
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
```

**Frontend `.env`:**
```env
VITE_BACKEND_URL=http://localhost:5000
```

### Step 4: Update Server Entry Point

Add to your `backend/src/index.js`:

```javascript
import "./config/env.js"; // MUST be first
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import passport from "./config/passport.js";

connectDB();

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
}));

app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});
```

### Step 5: Add Routes to Frontend

Update `frontend/src/App.jsx`:

```javascript
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
// ... other imports

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* ... other routes */}
      </Routes>
    </BrowserRouter>
  );
}
```

### Step 6: Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output to `JWT_SECRET` in `.env`

### Step 7: Test

```bash
# Backend
cd backend && npm start

# Frontend (new terminal)
cd frontend && npm run dev
```

Visit `http://localhost:5173/signup` and create an account!

---

## ✅ That's It!

Your authentication system is ready. For detailed setup, see `AUTHENTICATION_SETUP_GUIDE.md`










