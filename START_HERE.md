# 🚀 Getting Started with QuizForge

This guide will help you get QuizForge up and running in 5 minutes!

## Step 1: Install Node.js and MySQL

Make sure you have:
- **Node.js 18+**: Download from https://nodejs.org/
- **MySQL 8.0+**: Download from https://dev.mysql.com/downloads/mysql/

Check your installations:
```bash
node --version  # Should show v18.x or higher
npm --version   # Should show 9.x or higher
mysql --version # Should show 8.0.x or higher
```

## Step 2: Create Database

Open MySQL and create the database:

```bash
mysql -u root -p
```

Then run:
```sql
CREATE DATABASE quizforge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

Or use the provided SQL file:
```bash
mysql -u root -p < create_database.sql
```

## Step 3: Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

## Step 4: Configure Environment

1. **Update `.env` file** (root directory):
   - Replace `YOUR_PASSWORD` with your MySQL password in `DATABASE_URL`
   - Add your Anthropic or OpenAI API key

2. **Client is already configured** (`client/.env`)

## Step 5: Set Up Database Tables

```bash
npx prisma migrate dev --name init
npx prisma generate
```

This creates all the necessary tables in your database.

## Step 6: Start the Application

```bash
npm run dev
```

This starts both the backend and frontend servers.

## Step 7: Access the Application

Open your browser and go to:
**http://localhost:5173**

## Step 8: Create Your Account

1. Click "Get Started" or "Register"
2. Choose "Teacher" or "Student"
3. Fill in your details
4. Start using QuizForge!

---

## 🎯 Quick Test

### As a Teacher:
1. Create a new exam
2. Add questions (manually or with AI)
3. Publish the exam
4. Share the access code with students

### As a Student:
1. Click "Enter Access Code"
2. Enter the 9-digit code
3. Take the exam
4. View your instant results!

---

## ❓ Having Issues?

### Database connection failed?
- Make sure MySQL is running
- Check your password in `.env`
- Verify the database exists

### Port 3000 already in use?
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Need help?
Check `README.md` for detailed documentation!

---

## 📚 What's Next?

- Read the full `README.md` for all features
- Check `DATABASE_SETUP.md` for database details
- Explore the API documentation
- Customize the design and features

**Happy Quiz Building! 🎉**
