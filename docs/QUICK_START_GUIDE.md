# Quick Start Guide

## 📋 Immediate Next Steps (In Order)

### 1. Verify Backend Structure (2 min)
```bash
cd /workspaces/Expense-Tracker/backend
ls -la
# You should see: config/, models/, routes/, middleware/, utils/, server.js, package.json, .env.example
```

### 2. Verify Frontend Structure (2 min)
```bash
cd /workspaces/Expense-Tracker/frontend
ls -la src/
# You should see: pages/, context/, components/, App.js, api.js, index.css
```

### 3. Setup Backend (5 min)
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env - Add MongoDB connection string
# Get a free MongoDB Atlas at: https://www.mongodb.com/cloud/atlas
nano .env
# Add: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker
```

### 4. Setup Frontend (5 min)
```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# File should contain:
cat .env
# Should show: REACT_APP_API_URL=http://localhost:5000/api
```

### 5. Start Backend (3 min)
```bash
cd backend
npm run dev
```
Expected output:
```
MongoDB Connected: cluster0.mongodb.net
Server running on port 5000
```

### 6. Start Frontend (3 min)
In a NEW terminal window:
```bash
cd frontend
npm start
```
Expected: Browser opens to http://localhost:3000/login

---

## 🧪 Testing Checklist

### Test 1: Signup to Account
1. Visit http://localhost:3000 (should redirect to login)
2. Click "Sign up here"
3. Fill form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "testpass123"
   - Confirm: "testpass123"
4. Click "Sign Up"

**Expected Result:**
- ✅ Redirected to /dashboard
- ✅ "Welcome, Test User!" shown
- ✅ Empty expenses list

### Test 2: Add Expense
1. In form, enter:
   - Amount: "250.50"
   - Category: "Food & Dining"
   - Description: "Team lunch"
   - Date: Today
2. Click "Add Expense"

**Expected Result:**
- ✅ "Expense added successfully!" message
- ✅ Expense appears in table
- ✅ Total shows ₹250.50
- ✅ Summary card updates

### Test 3: Filter by Category
1. Add another expense with different category
2. In Filters section, select a category
3. Click "Filter by Category"

**Expected Result:**
- ✅ Only expenses from that category show
- ✅ Total updates to show only filtered expenses

### Test 4: Sort by Date
1. Change "Sort by Date" dropdown
2. Try "Oldest First"

**Expected Result:**
- ✅ Expenses reorder
- ✅ Dates go from oldest to newest

### Test 5: Delete Expense
1. Click "Delete" button on any expense

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ After confirming, expense is removed
- ✅ Total updates
- ✅ Table refreshes

### Test 6: Logout
1. Click "Logout" button (top right)

**Expected Result:**
- ✅ Redirected to /login
- ✅ localStorage cleared
- ✅ Need to login again to access dashboard

### Test 7: Login After Logout
1. Click "Login here"
2. Enter email and password from test 1
3. Click "Login"

**Expected Result:**
- ✅ Redirected to /dashboard
- ✅ All previously added expenses still there!
- ✅ Data persisted in MongoDB

### Test 8: Idempotency
1. Add expense with description "Test Idempotency"
2. Open DevTools (F12) → Network tab
3. Add same expense again with same details
4. In Network tab, check the POST request

**Expected Result:**
- ✅ First request: 201 (Created)
- ✅ Second request: 200 (Already exists)
- ✅ Only one expense in database
- ✅ "Expense already exists" message shown

---

## 🔍 Testing with API Directly (cURL)

### Get JWT Token
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test",
    "email": "api@test.com",
    "password": "testpass123",
    "confirmPassword": "testpass123"
  }'
```

Response:
```json
{
  "message": "User registered successfully",
  "user": { "id": "...", "name": "API Test", "email": "api@test.com" },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Copy the `token` value.

### Create Expense via API
```bash
TOKEN="your-token-here"

curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "amount": 500.75,
    "category": "Transport",
    "description": "Uber ride",
    "date": "2024-01-20",
    "idempotency_key": "test-123-456"
  }'
```

### Get All Expenses
```bash
curl -X GET "http://localhost:5000/api/expenses" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Dashboard Summary
```bash
curl -X GET "http://localhost:5000/api/expenses/summary/dashboard" \
  -H "Authorization: Bearer $TOKEN"
```

### Delete Expense
```bash
EXPENSE_ID="the-id-from-previous-response"

curl -X DELETE "http://localhost:5000/api/expenses/$EXPENSE_ID" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🐛 Common Issues & Fixes

### Issue: "Cannot connect to MongoDB"
```
Error: MongoDB connection failed
```
**Fix:**
1. Check MongoDB URI in `backend/.env`
2. Verify username and password are URL-encoded
3. Add your IP to MongoDB Atlas IP whitelist
   - Go to MongoDB Atlas
   - Security → Network Access
   - Click "Add IP Address"
   - Add your current IP or 0.0.0.0/0 (for any IP)

### Issue: "Port 5000 already in use"
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Fix:**
```bash
# Kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in backend/.env
PORT=5001
```

### Issue: "React app can't reach backend"
```
Error: Network request failed
```
**Fix:**
1. Verify `backend/server.js` is running (you should see console output)
2. Check `REACT_APP_API_URL` in `frontend/.env`
   - Should be `http://localhost:5000/api`
3. Check CORS origin in `backend/server.js`
   - Should include `http://localhost:3000`

### Issue: "JSON Web Token is malformed"
```
Error: JWT token invalid
```
**Fix:**
1. Make sure `JWT_SECRET` in `backend/.env` is set
2. Minimum 32 characters recommended
3. Restart backend after changing JWT_SECRET

### Issue: "Protected route redirects to login"
```
Redirected to /login when accessing /dashboard
```
**Fix:**
1. Make sure you're logged in
2. Check localStorage has `token` and `user` (DevTools → Application → localStorage)
3. If missing, logout and login again

---

## 📊 File Locations Reference

**When you need to...**

**Enable debug logging:**
- Edit `backend/server.js`
- Add `console.log()` statements

**Change JWT expiry:**
- Edit `backend/routes/auth.js`
- Look for `expiresIn: '30d'`
- Change to desired duration

**Change password hash rounds:**
- Edit `backend/models/User.js`
- Look for `await bcrypt.genSalt(10)`
- Change 10 to higher number (slower but more secure)

**Update API endpoint:**
- Edit `frontend/src/api.js`
- Modify `expenseService` methods

**Change Tailwind colors:**
- Edit `frontend/tailwind.config.js`
- Modify theme colors

**Add new expense category:**
- Edit `backend/models/Expense.js` (enum field)
- Edit `frontend/src/pages/Dashboard.js` (defaultCategories)

---

## ✅ Pre-Deployment Verification

Before deploying to production:

```bash
# Backend tests
cd backend
npm run dev              # Should start without errors
curl http://localhost:5000/api/health  # Should return 200

# Frontend tests
cd frontend
npm start                # Should open browser without errors
# Try: Signup → Add expense → Delete → Logout → Login → Verify data persists
```

All tests pass? ✅ You're ready to deploy!

---

## 📚 Documentation Files

In your project directory:

- **README.md** - Complete project overview
- **UPGRADE_GUIDE.md** - What changed and why
- **ARCHITECTURE_COMPARISON.md** - Before vs after
- **DEPLOYMENT_CHECKLIST.md** - Production deployment steps
- **QUICK_START_GUIDE.md** - This file!

---

## 🎯 Next: Deployment

Once local testing passes:

1. **Deploy Backend** (30 min)
   - Create Render.com account
   - Deploy `backend/` folder
   - Set environment variables
   - Get backend URL

2. **Deploy Frontend** (20 min)
   - Create Vercel account
   - Deploy `frontend/` folder
   - Update `REACT_APP_API_URL` to production backend
   - Deploy

3. **Production Testing** (15 min)
   - Test signup/login on production
   - Add/delete expense
   - Verify all features work

See **DEPLOYMENT_CHECKLIST.md** for detailed steps.

---

**You're all set! Local testing should work immediately. Enjoy! 🚀**
