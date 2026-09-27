# 🚀 QuizForge - Quick Start Guide

## Your Full-Stack Application is READY!

### What You Have:
✅ **Backend**: Node.js + Express + Socket.IO (API server)
✅ **Frontend**: React + Vite + Tailwind CSS (UI)
✅ **Database**: MySQL with Prisma ORM
✅ **Authentication**: JWT tokens + bcrypt
✅ **AI Integration**: OpenAI/Anthropic for question generation
✅ **Real-time**: Socket.IO for live updates

---

## 🏁 Start in 3 Steps

### Step 1: Setup Database (One-time)
```bash
# Create MySQL database
mysql -u root -p
```
Then run the SQL in `create_database.sql` or:
```sql
CREATE DATABASE quizforge;
```

### Step 2: Configure Environment
Edit `.env` file - Update this line with your MySQL password:
```
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/quizforge"
```

### Step 3: Start Everything
```bash
# Install dependencies (if not done)
npm install
cd client && npm install && cd ..

# Run database migrations
npx prisma migrate dev --name init

# Start both servers (backend + frontend)
npm run dev
```

---

## 🌐 Access Your Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Database Studio**: `npm run prisma:studio`

---

## 👤 Test the Application

### Create Teacher Account:
1. Go to http://localhost:5173
2. Click "Register"
3. Choose "Teacher" role
4. Create exams and questions

### Create Student Account:
1. Register as "Student"
2. Enter access code to join exams
3. Take exams and see results

---

## 🐛 Troubleshooting

### Database Connection Error?
- Check MySQL is running
- Verify password in `.env`
- Make sure database `quizforge` exists

### Port Already in Use?
- Change PORT in `.env` (backend)
- Change port in `client/vite.config.js` (frontend)

### AI Not Working?
- Add your API key to `.env`:
  - ANTHROPIC_API_KEY (recommended)
  - OR OPENAI_API_KEY

---

## 📚 Full Documentation
- Read `🚀_START_HERE_FIRST.md` for detailed setup
- Read `AI_SETUP_INSTRUCTIONS.md` for AI configuration
- Read `DATABASE_SETUP.md` for database details

---

## ✨ Features Ready to Use

**Teachers Can:**
- Create/Edit/Delete exams
- Generate questions with AI
- View student results
- See analytics and statistics
- Export PDFs

**Students Can:**
- Join exams with access codes
- Take timed exams
- See instant results
- View leaderboards
- Track progress

---

## 🎯 Everything is Ready - Just Run It!

```bash
npm run dev
```

Then open http://localhost:5173 and start testing! 🎉
