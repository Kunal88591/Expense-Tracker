# Deployment Checklist

## Pre-Deployment

### Backend Setup
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with strong password
- [ ] IP whitelist includes deployment server
- [ ] `.env` file created with all variables
  - [ ] `MONGODB_URI` configured
  - [ ] `JWT_SECRET` set to min 32 characters
  - [ ] `PORT` set to 5000
  - [ ] `FRONTEND_URL` matches frontend domain
- [ ] Local testing complete (`npm run dev`)
- [ ] All tests passing

### Frontend Setup
- [ ] `.env.example` created with `REACT_APP_API_URL`
- [ ] All dependencies updated
- [ ] Local testing complete (`npm start`)
- [ ] UI responsive on mobile
- [ ] All pages working (login, signup, dashboard)
- [ ] Logout functionality working
- [ ] Protected routes working

### Code Quality
- [ ] No console errors or warnings
- [ ] Error handling implemented
- [ ] Validation messages clear
- [ ] Loading states visible
- [ ] Success/error feedback shown to user

---

## Deployment Steps

### Step 1: Deploy Backend

#### Using Render.com
- [ ] Create account on render.com
- [ ] New Web Service → Connect GitHub
- [ ] Select backend repository/branch
- [ ] Set Start Command: `npm start`
- [ ] Add Environment Variables:
  - [ ] `MONGODB_URI`
  - [ ] `JWT_SECRET`
  - [ ] `NODE_ENV=production`
  - [ ] `FRONTEND_URL=https://your-frontend-domain.vercel.app`
- [ ] Deploy
- [ ] Test health endpoint: `https://your-backend.onrender.com/api/health`
- [ ] Save backend URL

#### Using Railway.app
- [ ] Create account on railway.app
- [ ] New Project → Import from GitHub
- [ ] Select backend repository
- [ ] Add MongoDB plugin
- [ ] Railway auto-sets `MONGODB_URL`
- [ ] Add remaining env variables
- [ ] Deploy
- [ ] Save backend URL from settings

### Step 2: Deploy Frontend

#### Using Vercel
- [ ] Create account on vercel.com
- [ ] Import Project → Select GitHub repo
- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `build`
- [ ] Add Environment Variables:
  - [ ] `REACT_APP_API_URL=https://your-backend-url/api`
- [ ] Deploy
- [ ] Test login/signup on production
- [ ] Test creating expense
- [ ] Save frontend URL

---

## Post-Deployment Testing

### API Testing
- [ ] Signup creates account: `POST /api/auth/signup`
- [ ] Login returns token: `POST /api/auth/login`
- [ ] Token required for expenses: Try without token
- [ ] Create expense works: `POST /api/expenses`
- [ ] List expenses works: `GET /api/expenses`
- [ ] Delete expense works: `DELETE /api/expenses/:id`
- [ ] Dashboard summary works: `GET /api/expenses/summary/dashboard`

### UI Testing
- [ ] Signup page works
- [ ] Login page works
- [ ] Dashboard loads after login
- [ ] Can add expense
- [ ] Can delete expense
- [ ] Can filter by category
- [ ] Can sort by date
- [ ] Logout works
- [ ] Redirected to login after logout

### Security Testing
- [ ] Cannot access dashboard without login
- [ ] Token persists after page refresh
- [ ] Cannot access other user's expenses
- [ ] Password is masked in form
- [ ] Session clears on logout

### Edge Cases
- [ ] Empty expense list message shows
- [ ] Error message shows on invalid email
- [ ] Validation errors display
- [ ] Network error handled gracefully
- [ ] Idempotent key prevents duplicates

---

## Production Monitoring

### Daily
- [ ] Check backend logs for errors
- [ ] Monitor database storage usage
- [ ] Verify no API errors in production

### Weekly
- [ ] Review error logs
- [ ] Check performance metrics
- [ ] Monitor authentication failures

### Monthly
- [ ] Database backup check
- [ ] Security audit
- [ ] Update dependencies if needed

---

## Scaling Considerations

- [ ] Add database indexes if queries slow
- [ ] Consider caching for dashboard summary
- [ ] Monitor JWT token generation load
- [ ] Plan for multi-region deployment
- [ ] Set up alerting for downtime

---

## Rollback Plan

If deployment fails:
1. Check backend logs: `Render/Railway → Logs`
2. Check frontend build: `Vercel → Deployments`
3. Verify environment variables are correct
4. Redeploy after fixes
5. Test staging before production

---

## Completed? ✅

- [ ] Backend deployed and working
- [ ] Frontend deployed and working
- [ ] All tests passing
- [ ] Users can signup/login
- [ ] Users can manage expenses
- [ ] Team aware of deployment
- [ ] Documentation updated

**Deployment successful! 🎉**
