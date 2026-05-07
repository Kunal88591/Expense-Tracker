# Expense Tracker - Production-Ready Full Stack Application

A modern expense management application demonstrating professional full-stack development practices with JWT authentication, MongoDB integration, reliable money handling, and idempotent APIs.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-ISC-green)

---

## 🎯 Features

### Core Functionality
- **User Authentication**: Secure signup and login with JWT tokens
- **Expense Management**: Create, read, and delete expenses  
- **Smart Filtering**: Filter expenses by category and sort by date
- **Dashboard Summary**: Visualize total expenses and category breakdown
- **User-Specific Data**: Each user has isolated access to their expenses

### Engineering Excellence
- **Idempotent APIs**: Safe to retry requests without creating duplicates via idempotency keys
- **Proper Money Handling**: All amounts stored as integers (paise) to avoid floating-point errors
- **Input Validation**: Comprehensive client and server-side validation
- **Error Handling**: Consistent error responses with proper HTTP status codes
- **Protected Routes**: Authentication middleware for API security
- **Persistent Sessions**: Login state persisted in localStorage


## 🏗️ Architecture

### Technology Stack

**Frontend:**
- React 18 with React Router for navigation
- Axios for HTTP requests with retry logic
- Context API for authentication state management
- Tailwind CSS for responsive modern UI

**Backend:**
- Node.js with Express.js server
- JWT for authentication
- bcrypt for password hashing
- MongoDB with Mongoose ODM

**Database:**
- MongoDB Atlas (cloud database)
- Mongoose for schema validation

**Deployment:**
- Frontend: Vercel
- Backend: Render or Railway

### Project Structure

```
├── backend/
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User schema with password hashing
│   │   └── Expense.js           # Expense schema with validation
│   ├── routes/
│   │   ├── auth.js              # Authentication endpoints
│   │   └── expenses.js          # Expense CRUD operations
│   ├── middleware/
│   │   └── auth.js              # JWT verification middleware
│   ├── utils/
│   │   └── helpers.js           # Validation and conversion utilities
│   ├── package.json
│   ├── .env.example
│   └── server.js                # Express app initialization
│
├── frontend/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js         # Login page
│   │   │   ├── ExpenseForm.js   # Add expense form
│   │   │   ├── ExpenseList.js   # Display expenses table
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── README.md
└── vercel.json
```

---

## 📋 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Expenses

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| GET | `/api/expenses` | Get user's expenses | Yes |
| POST | `/api/expenses` | Create new expense | Yes |
| GET | `/api/expenses/:id` | Get single expense | Yes |
| DELETE | `/api/expenses/:id` | Delete expense | Yes |

---

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# JWT_SECRET=your-secret-key-min-32-characters
# PORT=5000
# FRONTEND_URL=http://localhost:3000
npm run dev
```

Backend runs on `http://localhost:5000`

### 2. Frontend Setup

cd frontend
npm install
cp .env.example .env

# REACT_APP_API_URL=http://localhost:5000/api

npm start
```

Frontend opens at `http://localhost:3000`

---

## 🔐 Authentication Flow

1. **Signup**: User creates account with name, email, password
   - Password hashed 10 times with bcrypt
   - User stored in MongoDB
   - JWT token generated (30 day expiry)
   - Token and user saved to localStorage

2. **Login**: User enters email and password
   - Email lookup in database
   - Password compared with hash
   - JWT token generated and returned
   - Token stored in localStorage

3. **Protected Routes**: 
   - Token included in Authorization header
   - Server verifies JWT signature
   - User ID extracted from payload
   - All queries filtered by userId

4. **Logout**: Clear token and user data from storage

---

## 💰 Money Handling

All amounts stored as **integers in paise** (1/100th of rupee):

```javascript
// Frontend sends
{ "amount": 250.75 }

// Backend converts
const paise = Math.round(250.75 * 100) // = 25075

// Stored as integer
{ amount: 25075 }

// Returned as decimal
{ "amount": "250.75" }
```

This guarantees exact arithmetic without floating-point errors.

---

## 🔄 Idempotency

Prevents duplicate expense creation through idempotency keys:

1. Client generates UUID: `expense-550e8400-e29b-41d4-a716-446655440000`
2. Included in request payload
3. Server checks for existing expense with same key
4. If exists, returns cached response
5. If new, creates and stores expense
6. Safe to retry without creating duplicates

Database maintains compound index on `(userId, idempotency_key)`.

---

## 🧪 Testing with cURL

### Create Account
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
# Returns: { token: "...", user: {...} }
```

### Create Expense
```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "amount": 500.50,
    "category": "Food & Dining",
    "description": "Lunch",
    "date": "2024-01-15",
    "idempotency_key": "unique-key-123"
  }'
```

### Get Expenses
```bash
curl -X GET "http://localhost:5000/api/expenses?sort=date_desc" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📦 Deployment

### Frontend - Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Set env: `REACT_APP_API_URL=https://your-backend-url/api`
4. Deploy automatically

### Backend - Render

1. Create Web Service on Render
2. Connect GitHub repository
3. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL=https://your-frontend.vercel.app`
4. Deploy

---

## 🛡️ Security

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Secrets**: Minimum 32 characters
- **CORS**: Restricted to configured frontend domain
- **Environment Variables**: Sensitive data in `.env`
- **Input Validation**: Client and server validation
- **Token Expiry**: 30 days

**Before production:**
- Use HTTPS everywhere
- Review CORS origins
- Set strong JWT secret
- Enable MongoDB IP whitelist

---

## 📚 Future Improvements

- [ ] Email verification
- [ ] Password reset
- [ ] Export to CSV/PDF
- [ ] Recurring expenses
- [ ] Budget goals
- [ ] Advanced charts
- [ ] Multi-currency
- [ ] Mobile app
- [ ] Dark mode
- [ ] Unit tests

---

## 🤝 Contributing

Contributions welcome! Please submit a Pull Request.

---

## 📝 License

ISC License

---

## ⚡ Performance

- JWT tokens cached in localStorage
- Axios retry logic for transient failures
- MongoDB indexes for fast queries
- React 18 concurrent features
- Tailwind CSS for fast rendering

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Verify MongoDB URI in `.env`
- Check IP whitelist on MongoDB Atlas
- Confirm database user permissions

### JWT Token Invalid
- Check `JWT_SECRET` matches on backend/frontend
- Verify token not expired (30 days)
- Ensure `Bearer ` prefix in Authorization header

### CORS Errors
- Verify `FRONTEND_URL` in backend `.env`
- Check `REACT_APP_API_URL` in frontend `.env`
- Ensure exact domain match

---

**Happy tracking! 🎯**
