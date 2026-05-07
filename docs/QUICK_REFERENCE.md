# Quick Reference Card

## 🚀 Start Local Development (5 minutes)

### Terminal 1: Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with MongoDB URI
nano .env
npm run dev
# Should show: MongoDB Connected, Server running on port 5000
```

### Terminal 2: Frontend (new terminal)
```bash
cd frontend
npm install
cp .env.example .env
npm start
# Should open http://localhost:3000/login
```

---

## 🔑 Credentials Setup

### MongoDB Connection String Format
```
mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
```

### Backend .env Template
```
MONGODB_URI=mongodb+srv://kunalintern_db_user:YOUR_PASSWORD@cluster0.feyvboy.mongodb.net/?appName=Cluster0
JWT_SECRET=your-secret-key-minimum-32-characters-here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend .env Template
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 📋 Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads at localhost:3000
- [ ] Sign up creates account
- [ ] Login with credentials
- [ ] Add expense works
- [ ] Delete expense works
- [ ] Filter by category works
- [ ] Data persists after logout/login

---

## 🔗 Key Endpoints

```bash
# Signup
POST /api/auth/signup

# Login
POST /api/auth/login

# Create Expense
POST /api/expenses
-H "Authorization: Bearer $TOKEN"

# List Expenses
GET /api/expenses
-H "Authorization: Bearer $TOKEN"

# Delete Expense
DELETE /api/expenses/:id
-H "Authorization: Bearer $TOKEN"
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| `EADDRINUSE: port 5000` | Kill process: `lsof -ti:5000 \| xargs kill -9` |
| MongoDB won't connect | Check URI encoding, IP whitelist, credentials |
| React can't reach backend | Verify `REACT_APP_API_URL` in frontend/.env |
| Token errors | Check `JWT_SECRET` matches backend |
| Can't access /dashboard | Login first, check localStorage for token |

---

## 📂 Important Files

| File | Purpose |
|------|---------|
| `backend/server.js` | Express entry point |
| `backend/.env.example` | Backend secrets template |
| `backend/models/User.js` | User database schema |
| `backend/routes/auth.js` | Login/signup endpoints |
| `backend/routes/expenses.js` | Expense CRUD endpoints |
| `frontend/src/App.js` | React Router setup |
| `frontend/src/context/AuthContext.js` | Auth state management |
| `frontend/.env.example` | Frontend config template |

---

## 🚀 Deployment URLs

After local testing works, deploy to:

**Frontend:** Vercel  
**Backend:** Render or Railway  
**Database:** MongoDB Atlas (cloud)

Update `REACT_APP_API_URL` to production backend URL in frontend deployment.

---

## 🔒 Security Reminders

✅ **DO:**
- Store credentials in `.env` (local only)
- Use `.env.example` for templates
- Set strong JWT_SECRET (32+ characters)
- Rotate credentials quarterly

❌ **DON'T:**
- Commit `.env` to git
- Share credentials in chat
- Hardcode secrets in code
- Use weak passwords

---

## 📚 Full Docs

- [QUICK_START_GUIDE.md](QUICK_START_GUIDE.md) - Complete setup (20 min)
- [SECURITY_GUIDE.md](SECURITY_GUIDE.md) - Credential management
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Production deployment
- [README.md](README.md) - Full documentation
- [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) - All guides

---

**Last Updated:** May 7, 2026  
**Status:** ✅ Production Ready
