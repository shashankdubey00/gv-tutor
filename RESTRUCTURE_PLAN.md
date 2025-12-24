# 🎯 Restructure Plan: User vs Tutor System

## 📋 **Understanding the New Flow**

### **1. Visitor (No Auth Required)**

- ✅ Can visit: Home, About, Library, Contact
- ❌ No authentication needed
- ❌ Cannot access: Apply as Tutor, Profile pages

### **2. User (Regular User - Default Role)**

- ✅ Signs up/Logs in → Creates **User Profile**
- ✅ Role: `"user"` (default)
- ✅ Can browse all public pages
- ✅ Has basic user profile (name, phone, address, etc.)
- ❌ NOT a tutor yet
- ✅ Can click "Apply as Tutor" to become tutor

### **3. Tutor (Special Role)**

- ✅ User becomes tutor ONLY after:
  1. Logging in (as user)
  2. Clicking "Apply as Tutor"
  3. Completing Tutor Profile
- ✅ Role changes from `"user"` → `"tutor"`
- ✅ Has both User Profile AND Tutor Profile
- ✅ Can access: Apply as Tutor page, Tutor Profile page

---

## 🔄 **User Flow Diagrams**

### **Flow 1: New Visitor → User**

```
Visitor → Signup/Login → User (role: "user") → User Profile Created
```

### **Flow 2: User → Tutor**

```
User (logged in) → Click "Apply as Tutor" → Complete Tutor Profile → Role: "tutor" → Apply as Tutor Page
```

### **Flow 3: Visitor → Tutor (Not Logged In)**

```
Visitor → Click "Apply as Tutor" → Login/Signup → User Created → Complete Tutor Profile → Role: "tutor" → Apply as Tutor Page
```

### **Flow 4: Already Tutor**

```
Tutor (logged in) → Click "Apply as Tutor" → Direct to Apply as Tutor Page
```

---

## 🗂️ **Database Structure**

### **User Model:**

- `email` (unique)
- `passwordHash`
- `role`: `"user"` | `"tutor"` | `"admin"` (default: `"user"`)
- `isTutorProfileComplete`: boolean
- `isActive`: boolean

### **UserProfile Model (NEW):**

- `userId` (ref: User)
- `fullName`
- `phone`
- `address`
- `dateOfBirth` (optional)
- `profilePicture` (optional)
- `createdAt`, `updatedAt`

### **TutorProfile Model (EXISTING):**

- `userId` (ref: User)
- All tutor-specific fields (subjects, experience, etc.)
- Only created when user becomes tutor

---

## 🔧 **Implementation Steps**

### **Step 1: Update User Model**

- Change role enum: `["user", "tutor", "admin"]`
- Default role: `"user"`

### **Step 2: Create UserProfile Model**

- New model for regular user profiles
- Basic user information

### **Step 3: Update Signup/Login**

- Auto-create UserProfile when user signs up/logs in
- Default role = `"user"`

### **Step 4: Update "Apply as Tutor" Logic**

- Check if logged in
- If not → Login/Signup
- If logged in → Complete Tutor Profile
- After tutor profile → Change role to `"tutor"`

### **Step 5: Make Pages Public**

- About, Library, Contact → No auth required

### **Step 6: Update Navbar**

- Show different options for: Visitor, User, Tutor

---

## ✅ **Key Changes Summary**

| Current                   | New                                         |
| ------------------------- | ------------------------------------------- |
| Role: "student" (default) | Role: "user" (default)                      |
| No user profile           | UserProfile created on signup               |
| Tutor = role from start   | Tutor = role after completing tutor profile |
| All pages need auth       | Public pages: Home, About, Library, Contact |

---

## 🎯 **Next Steps**

1. Create UserProfile model
2. Update User model (role enum)
3. Update signup/login controllers
4. Update "Apply as Tutor" logic
5. Make pages public
6. Update Navbar
7. Test all flows
