# 🎓 QuizForge - Complete Full-Stack Application

## ✅ **APPLICATION IS 100% COMPLETE AND READY TO USE!**

A production-ready AI-Powered Quiz Engine built with **React**, **Node.js**, and **MySQL/SQLite**.

---

## 🚀 Quick Start (3 Steps!)

### 1. Install Dependencies
```bash
npm install
cd client && npm install && cd ..
```

### 2. Setup Database
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 3. Start the Application
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
cd client
npm run dev
```

**✅ Done!** Visit http://localhost:5173

---

## 📋 What's Included

### ✅ Backend (Node.js + Express)
- **Authentication**: JWT tokens, bcrypt password hashing
- **Role-Based Access**: Student, Teacher, Admin
- **Teacher APIs**: Create/edit exams, AI question generation, view results
- **Student APIs**: Take exams, view results, leaderboard
- **AI Integration**: Anthropic Claude & OpenAI GPT-4
- **Auto-Grading**: MCQ, True/False, Short Answer
- **Real-time**: Socket.IO for live leaderboard
- **PDF Export**: Exam results and student certificates
- **Rate Limiting**: 30 AI requests/min
- **Budget Control**: $5/day AI spending limit

### ✅ Frontend (React + Vite)
- **Modern UI**: Tailwind CSS with Bento Card design
- **Authentication Pages**: Login, Register, Password Reset
- **Teacher Dashboard**: Create exams, manage questions, AI generation
- **Student Dashboard**: Take exams, view results, leaderboard
- **Real-time Updates**: Socket.IO client
- **Analytics**: Chart.js for statistics
- **Responsive Design**: Works on all devices

### ✅ Database (Prisma + MySQL/SQLite)
- **Zero-Installation**: Uses SQLite by default (no DB server needed!)
- **6 Tables**: Users, Exams, Questions, Attempts, AI Usage, Password Resets
- **Relationships**: Foreign keys, cascade deletes
- **Type-Safe**: Prisma generates TypeScript types

---

## 🎯 Core Features

### For Teachers 👨‍🏫
✅ Create unlimited exams  
✅ AI-powered question generation (3 types, 5 difficulty levels)  
✅ Unique 9-digit access codes  
✅ Publish/unpublish control  
✅ Real-time results viewing  
✅ Performance analytics with charts  
✅ Score distribution & pass rates  
✅ Duplicate exams  
✅ PDF export of results  
✅ AI usage tracking  

### For Students 👨‍🎓
✅ Join exams with access code  
✅ Timed exam taking with countdown  
✅ Auto-save answers (no data loss!)  
✅ Instant grading & results  
✅ Performance levels (Excellent/Good/Fair/Poor)  
✅ Detailed answer review  
✅ Real-time leaderboard  
✅ Exam history  
✅ PDF export of results  

### AI Features 🤖
✅ Anthropic Claude 3.5 Sonnet  
✅ OpenAI GPT-4  
✅ Topic-based generation  
✅ Multiple choice, True/False, Short answer  
✅ 5 difficulty levels  
✅ Rate limiting (30/min)  
✅ Daily budget ($5)  
✅ Cost tracking per user  

---

## 🔧 Configuration

### Environment Variables

Edit `.env` file:

```env
# Application
PORT=3000
CLIENT_URL=http://localhost:5173

# Database (SQLite - no config needed!)
DATABASE_URL="file:./database.db"

# JWT Secret (change in production!)
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=7d

# AI Provider (choose one)
ANTHROPIC_API_KEY=sk-ant-...
# OR
OPENAI_API_KEY=sk-...
AI_DEFAULT_PROVIDER=anthropic

# AI Limits
AI_RATE_LIMIT_PER_MINUTE=30
AI_DAILY_BUDGET=5.00
```

### Get API Keys
- **Anthropic**: https://console.anthropic.com/
- **OpenAI**: https://platform.openai.com/

---

## 📁 Project Structure

```
AI-Quiz-Engine/
├── server/                     # Backend (Node.js + Express)
│   ├── controllers/           # Request handlers
│   ├── services/              # Business logic
│   ├── routes/                # API endpoints
│   ├── middleware/            # Auth, error handling
│   ├── utils/                 # Helper functions
│   └── index.js               # Entry point
├── client/                     # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/             # All pages
│   │   ├── components/        # Reusable components
│   │   ├── context/           # React Context (Auth)
│   │   ├── utils/             # API client, Socket.IO
│   │   └── index.css          # Tailwind styles
│   └── package.json
├── prisma/
│   └── schema.prisma          # Database schema
├── database.db                # SQLite database file
├── .env                       # Environment config
└── package.json               # Root dependencies
```

---

## 🧪 Testing the Application

### 1. Create Accounts

**Teacher Account:**
- Go to http://localhost:5173/register
- Name: Test Teacher
- Email: teacher@test.com
- Password: password123
- Role: **Teacher**

**Student Account:**
- Go to http://localhost:5173/register
- Name: Test Student
- Email: student@test.com
- Password: password123
- Role: **Student**

### 2. Teacher Workflow

1. **Login** as teacher
2. **Create Exam**: Click "Create Exam"
   - Title: "JavaScript Quiz"
   - Duration: 30 minutes
   - Passing Score: 70%
3. **Add Questions**: Use AI generation or manual entry
   - Click "Generate with AI"
   - Topic: "JavaScript Arrays"
   - Type: Multiple Choice
   - Count: 5
   - Difficulty: 3 (Medium)
4. **Publish Exam**: Toggle "Published" switch
5. **Get Access Code**: Click "Share" to see the code

### 3. Student Workflow

1. **Login** as student
2. **Join Exam**: Enter access code from teacher
3. **Take Exam**: Answer questions within time limit
4. **Submit**: Click "Submit Exam" when done
5. **View Results**: See score, performance level, and detailed feedback
6. **Check Leaderboard**: If enabled by teacher

---

## 📊 API Endpoints

### Authentication
```
POST /api/auth/register       - Register new user
POST /api/auth/login          - Login
POST /api/auth/logout         - Logout
POST /api/auth/forgot-password - Request password reset
POST /api/auth/reset-password  - Reset password
GET  /api/auth/me             - Get current user
```

### Teacher
```
GET    /api/teacher/exams                            - List exams
POST   /api/teacher/exams                            - Create exam
GET    /api/teacher/exams/:id                        - Get exam
PUT    /api/teacher/exams/:id                        - Update exam
DELETE /api/teacher/exams/:id                        - Delete exam
POST   /api/teacher/exams/:id/publish                - Toggle publish
POST   /api/teacher/exams/:id/regenerate-code        - New access code
POST   /api/teacher/exams/:id/duplicate              - Duplicate exam
GET    /api/teacher/exams/:examId/questions          - List questions
POST   /api/teacher/exams/:examId/questions          - Add question
PUT    /api/teacher/exams/:examId/questions/:id      - Update question
DELETE /api/teacher/exams/:examId/questions/:id      - Delete question
POST   /api/teacher/questions/generate-ai            - AI generation
GET    /api/teacher/exams/:examId/results            - View results
GET    /api/teacher/exams/:examId/statistics         - Get stats
GET    /api/teacher/exams/:examId/pdf                - Download PDF
GET    /api/teacher/ai-usage                         - AI usage stats
```

### Student
```
GET  /api/student/dashboard/stats             - Dashboard stats
POST /api/student/access-code                 - Join with code
GET  /api/student/exams                       - Available exams
GET  /api/student/exams/:examId               - Exam details
POST /api/student/exams/:examId/start         - Start attempt
PUT  /api/student/attempts/:attemptId/answers - Save answers
POST /api/student/attempts/:attemptId/submit  - Submit exam
GET  /api/student/attempts/:attemptId         - View results
GET  /api/student/attempts                    - All attempts
GET  /api/student/attempts/:attemptId/pdf     - Download PDF
GET  /api/student/exams/:examId/leaderboard   - Leaderboard
```

---

## 🎨 UI Design

### Bento Card Design System
- **Primary Color**: Teal (#0d9488)
- **Accent Color**: Coral (#ff6b6b)
- **Warning**: Sunny Yellow (#fbbf24)
- **Typography**: System fonts (clean & modern)
- **Components**: Rounded cards with subtle shadows
- **Navigation**: Frosted glass effect
- **Buttons**: Rounded with hover effects
- **Forms**: Clean with focus states

---

## 🔒 Security Features

✅ JWT authentication  
✅ Password hashing (bcrypt, 12 rounds)  
✅ Role-based access control  
✅ Input validation  
✅ Rate limiting  
✅ SQL injection protection (Prisma)  
✅ XSS protection (React auto-escapes)  
✅ CORS enabled for specific origin  

---

## 🚨 Troubleshooting

### "Prisma Client not found"
```bash
npx prisma generate
```

### "Database doesn't exist"
```bash
npx prisma migrate dev
```

### "Module not found"
```bash
npm install
cd client && npm install
```

### Port 3000 already in use
Change `PORT` in `.env` to 3001 or another port

### Puppeteer not installing (PDF feature)
PDF generation is optional. If puppeteer fails:
```bash
npm install puppeteer --legacy-peer-deps
```
Or skip it - everything else works without PDF export.

---

## 📦 Production Deployment

### 1. Build Frontend
```bash
cd client
npm run build
```

### 2. Update Environment
```env
NODE_ENV=production
DATABASE_URL="mysql://user:pass@host:3306/dbname"
JWT_SECRET=super-secret-production-key
CLIENT_URL=https://yourapp.com
```

### 3. Start Server
```bash
npm start
```

### 4. Serve Frontend
Use Nginx or serve static files from `client/dist`

---

## 🎓 Features by User Role

| Feature | Student | Teacher | Admin |
|---------|---------|---------|-------|
| Take Exams | ✅ | ❌ | ✅ |
| Create Exams | ❌ | ✅ | ✅ |
| AI Generation | ❌ | ✅ | ✅ |
| View Results (Own) | ✅ | ✅ | ✅ |
| View Results (All) | ❌ | ✅ | ✅ |
| Leaderboard | ✅ | ✅ | ✅ |
| PDF Export | ✅ | ✅ | ✅ |
| Analytics | ❌ | ✅ | ✅ |
| User Management | ❌ | ❌ | ✅ |

---

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review API response error messages
3. Check console logs (browser & server)
4. Verify environment variables are set correctly

---

## 📝 License

MIT License - Feel free to use this project for learning or commercial purposes!

---

## 🎉 **You're All Set!**

The application is **100% complete** and ready to use. Enjoy building quizzes with AI! 🚀

**Happy Coding!** 💻✨

