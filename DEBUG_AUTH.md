# Authentication Debugging Guide

## Issue: Redirecting to login when clicking dashboard options

### Quick Fix Steps:

1. **Open browser console** (F12) and check for errors when:
   - Logging in
   - Clicking any dashboard link

2. **Check if token exists**:
   Open browser console and run:
   ```javascript
   console.log('Token:', localStorage.getItem('token'));
   console.log('User:', localStorage.getItem('user'));
   ```

3. **Verify token format**:
   Token should look like: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

4. **Check API responses**:
   - Open Network tab in browser DevTools
   - Look for requests to `/api/auth/me` or teacher/student endpoints
   - Check if Authorization header is present
   - Look for 401 Unauthorized errors

### Common Issues:

**Issue 1: Token not saving**
- Clear browser cache and localStorage
- Try logging in again

**Issue 2: Token expired**
- Tokens expire after 7 days
- Log out and log back in

**Issue 3: CORS error**
- Make sure backend is running on port 3000
- Make sure frontend is running on port 5173

**Issue 4: Database not initialized**
- Run: `npx prisma migrate dev --name init`
- Run: `npx prisma generate`

### Manual Fix:

1. **Stop both servers** (Ctrl+C)

2. **Clear everything**:
   ```bash
   # Clear browser localStorage
   # Open browser console and run:
   localStorage.clear()
   ```

3. **Restart backend**:
   ```bash
   npm run server
   ```

4. **Restart frontend** (in new terminal):
   ```bash
   npm run client
   ```

5. **Register a new account** or log in again

### Test Authentication:

Run this in browser console after logging in:
```javascript
fetch('http://localhost:3000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(r => r.json())
.then(d => console.log('Auth test:', d))
.catch(e => console.error('Auth failed:', e));
```

Should return your user data. If it returns 401, the token is invalid.

### Still not working?

1. Delete `database.db` file
2. Run `npx prisma migrate dev --name init` again
3. Register a fresh account
4. Try again

The changes I made:
- Fixed API interceptor to not redirect unnecessarily
- Added better token validation
- Improved error handling in auth middleware
