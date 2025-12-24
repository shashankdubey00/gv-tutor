# GV Tutor - Project Status & Features

## Project Overview
A full-stack tutoring platform where parents can find tutors and tutors can apply for positions. The system includes role-based access control with three user types: **users**, **tutors**, and **admins**.

## Technology Stack
- **Frontend**: React.js with Vite, Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT tokens, Google OAuth, bcrypt

## User Roles & Access

### 1. Visitor (Not Logged In)
- Can access public pages: Home, About, Library, Contact
- Can submit "Find a Tutor" requests
- Can see "Apply as Tutor" button (redirects to login/signup)

### 2. User (Regular User)
- Default role after signup
- Has a UserProfile with basic information
- Can access public pages
- Can submit "Find a Tutor" requests
- Can complete tutor profile to become a tutor
- **Cannot** see "Apply as Tutor" button until they become a tutor

### 3. Tutor
- Role assigned after completing tutor profile
- Can view posted tutor requests on "Apply as Tutor" page
- Can see their full profile with all details
- Can apply to parent requests
- Has TutorProfile with teaching information
- **Cannot** apply as tutor if they are an admin

### 4. Admin
- Can access admin dashboard
- Can view all parent applications
- Can view all tutor applications and members
- Can control field visibility for posted requests
- Can post/reject parent requests
- Can see which tutors applied to which posts
- **Cannot** apply as tutor (restricted in frontend and backend)

## Key Features Implemented

### Authentication System
- Email/password authentication
- Google OAuth authentication
- JWT token-based session management
- Cookie-based authentication with proper CORS settings
- Rate limiting for auth routes (30 requests per 15 minutes, 10x more lenient in development)

### User Profile System
- **UserProfile**: Basic user information (name, phone, address, etc.)
- **TutorProfile**: Detailed tutor information (subjects, experience, hourly rate, etc.)
- Profile completion tracking with `isTutorProfileComplete` flag
- Role transitions: `user` → `tutor` (after completing profile)

### Tutor Request System
- Parents can submit "Find a Tutor" requests
- Admin reviews and posts requests
- Admin controls which fields are visible to tutors
- Tutors can see only posted requests with visible fields
- Applied tutors tracking: Each request tracks which tutors applied

### Admin Dashboard Features
- **Dashboard Tab**: Shows recent applications (5 most recent)
- **Parent Tab**: All parent applications with:
  - Profile icons, names, phone numbers
  - Applied tutors displayed on each card
  - Field visibility toggles
  - Post/Reject functionality
  - "See More" pagination
- **Tutor Tab**: 
  - Tutor applications (square profile icons)
  - Tutor members (circular avatars, clickable)
  - Shows applied posts count on cards
- **Card Design**: White cards with static shadows (`shadow-lg`)
- **Clickable Cards**: Click tutor cards to see full profile and applied posts

### Tutor Profile Display
- **Recent Tutor Applications**: Square profile icons, shows name, email, phone, subjects, hourly rate, timing
- **Tutor Members**: Circular avatars (24x24 in dashboard, 20x20 in recent), clickable to open full profile modal
- **Full Profile Modal**: Shows complete tutor information including:
  - Personal information
  - Teaching information
  - Subjects, classes, locations
  - Bio and achievements
  - **Applied Posts**: List of all posts the tutor has applied to

### UI/UX Features
- White card backgrounds with static shadow effects
- Hover effects on cards (scale and shadow increase)
- Profile icons with initials
- Responsive design (mobile, tablet, desktop)
- Loading spinners
- Error handling with user-friendly messages

## Database Models

### User Model
- `email`, `passwordHash`, `role` (enum: "user", "tutor", "admin")
- `isTutorProfileComplete` (boolean)
- `authProviders` (array: "local", "google")
- `googleId` (for OAuth)

### UserProfile Model
- `userId` (reference to User)
- `fullName`, `phone`, `address`, `dateOfBirth`
- `profilePicture`, `bio`

### TutorProfile Model
- `userId` (reference to User)
- `fullName`, `phone`, `gender`, `address`
- `experience`, `subjects`, `classes`
- `availableLocations`, `preferredTiming`
- `hourlyRate`, `bio`, `achievements`
- `isProfileComplete`, `isVerified`

### TutorRequest Model
- Parent information: `parentName`, `parentEmail` (optional), `parentPhone`
- Student information: `studentGrade`
- Requirements: `subjects`, `preferredLocation`, `preferredTiming`, `frequency`, `budget`
- `status` (enum: "pending", "approved", "rejected", "posted", "filled")
- `fieldVisibility` (object controlling which fields tutors can see)
- `appliedTutors` (array tracking which tutors applied)
- `assignedTutor` (reference to User when tutor is selected)

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /signup` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /verify` - Verify authentication status
- `GET /google` - Google OAuth initiation
- `GET /google/callback` - Google OAuth callback

### Admin Routes (`/api/admin`)
- `POST /login` - Admin login
- `GET /parent-applications` - Get all parent applications
- `GET /tutor-applications` - Get all tutor applications (with applied posts)
- `GET /tutor-members` - Get all tutor members
- `PUT /tutor-requests/:requestId/status` - Update request status
- `PUT /tutor-requests/:requestId/visibility` - Update field visibility
- `POST /tutor-requests/:requestId/post` - Post a request

### Tutor Profile Routes (`/api/tutor-profile`)
- `GET /` - Get tutor profile (protected, tutor only)
- `POST /` - Create/update tutor profile (protected, user/tutor only, admin blocked)

### Tutor Request Routes (`/api/tutor-requests`)
- `POST /` - Create tutor request (public, for parents)
- `GET /posted` - Get posted tutor requests (protected, tutor only, profile complete required)

## Security Features

### Admin Restrictions
- Admins **cannot** apply as tutors
- Frontend: "Apply as Tutor" buttons hidden for admins
- Frontend: Redirects admins away from tutor pages
- Backend: Blocks admin from creating tutor profiles
- Backend: Blocks admin from accessing tutor-only routes

### Authentication Protection
- JWT token validation
- Cookie-based sessions
- CORS configured for credentials
- Rate limiting on auth routes
- Profile completion check for tutor routes

## Recent Changes (Latest Session)

1. **Tutor Profile Enhancements**
   - Made tutor profile more adorable with larger icons
   - Made profile header clickable
   - Added phone number display
   - Enhanced visual design with gradients

2. **Admin Dashboard Updates**
   - Changed all cards to white background with static shadows
   - Added profile icons, names, and phone numbers on cards
   - Made all cards clickable
   - Added applied tutors display on parent cards
   - Added tutor members section with circular avatars
   - Added full profile modal for tutor members

3. **Recent Tutor Application Cards**
   - Removed "Experience" field
   - Kept: Name, Email, Phone, Subjects, Hourly Rate, Timing
   - Made cards clickable to show full profile
   - Added applied posts count display

4. **Applied Posts Tracking**
   - Backend: Added `appliedPosts` to tutor applications response
   - Frontend: Shows applied posts in tutor profile modal
   - Shows applied posts count on tutor cards

5. **Admin Restrictions**
   - Implemented comprehensive admin blocking from tutor features
   - Updated all relevant frontend and backend files
   - Added validation in middleware

## File Structure

```
gv-tutor/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   ├── env.js
│   │   │   └── passport.js
│   │   ├── controllers/
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   ├── tutorProfileController.js
│   │   │   └── tutorRequestController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── checkProfileComplete.js
│   │   │   └── rateLimiter.js
│   │   ├── models/
│   │   │   ├── TutorProfile.js
│   │   │   ├── TutorRequest.js
│   │   │   ├── User.js
│   │   │   └── UserProfile.js
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── tutorProfileRoutes.js
│   │   │   └── tutorRequestRoutes.js
│   │   └── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── About.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── ApplyAsTutor.jsx
│   │   │   ├── CompleteProfile.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── FindTutor.jsx
│   │   │   ├── Library.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── TutorProfile.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── tutorService.js
│   │   ├── utils/
│   │   │   ├── authHelper.js
│   │   │   └── redirectGuard.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── .gitignore
```

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret for JWT token signing
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `NODE_ENV` - Environment (development/production)

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000)

## Important Notes

1. **MongoDB Atlas**: Database is hosted on MongoDB Atlas. Ensure IP whitelisting is configured.

2. **Admin Account**: Admin account must be created manually using the script in `backend/scripts/createAdmin.js`

3. **Rate Limiting**: Auth routes have rate limiting (30 requests per 15 minutes, 10x more lenient in development)

4. **Cookie Settings**: Authentication cookies use `httpOnly`, `sameSite: "lax"`, and `path: "/"` for proper cross-route access

5. **CORS**: Backend CORS is configured to allow credentials and Set-Cookie header

6. **Profile Completion**: Users must complete their tutor profile before accessing tutor-only features

7. **Admin Restrictions**: Admins are completely blocked from tutor features at both frontend and backend levels

## Git Repository
- **Remote**: https://github.com/shashankdubey00/gv-tutor.git
- **Branch**: main
- **Last Commit**: Complete tutor application system with admin restrictions

## Next Steps / Future Enhancements
- Implement actual "Apply" functionality for tutors to apply to posts
- Add email notifications
- Add search and filter functionality
- Add pagination for large lists
- Add image upload for profile pictures
- Add tutor verification system
- Add rating/review system

