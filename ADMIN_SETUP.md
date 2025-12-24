# Admin Setup Guide

## Creating an Admin User

To create an admin user in the database, run the following script:

```bash
cd backend
node scripts/createAdmin.js [email] [password]
```

**Example:**

```bash
node scripts/createAdmin.js admin@gvtutor.com Admin@123
```

If you don't provide email and password, it will use defaults:

- Email: `admin@gvtutor.com`
- Password: `Admin@123`

**Note:** Make sure your `.env` file has the correct `MONGO_URI` before running the script.

## Admin Login

1. Navigate to `/admin/login` in your browser
2. Enter the admin email and password
3. You will be redirected to `/admin/dashboard`

## Admin Dashboard Features

The admin dashboard allows you to:

1. **View Parent Applications** - See all tutor requests from parents/students
2. **View Tutor Applications** - See all tutor profile applications
3. **View Tutor Members** - See all registered tutors
4. **Approve/Reject Requests** - Manage parent tutor requests

## Security Notes

- Admin accounts are manually created (not through signup)
- Admin login is rate-limited (5 attempts per 15 minutes)
- All admin routes require authentication and admin role verification
