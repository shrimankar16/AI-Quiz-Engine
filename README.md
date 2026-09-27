# 🎓 QuizForge - AI-Powered Quiz Engine

A full-stack quiz management system with AI-powered question generation, real-time leaderboards, and instant auto-grading.

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - REST API server
- **Prisma ORM** - Type-safe database access
- **MySQL** - Relational database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Socket.IO** - Real-time WebSocket communication
- **OpenAI / Anthropic** - AI question generation

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first styling
- **Chart.js** - Analytics visualizations
- **Socket.IO Client** - Real-time updates
- **Lucide React** - Icon library

## ✨ Features

### For Teachers
- ✅ Create & manage exams with drag-and-drop question ordering
- 🤖 AI-powered question generation (multiple choice, true/false, short answer)
- 📊 Comprehensive analytics dashboard with Chart.js
- 🔗 Share exams via unique 9-digit access codes
- 📈 Real-time submission tracking
- 🎯 Automatic grading with detailed reports
- 📥 Export results as PDF
- ⚙️ Configure passing scores, time limits, and question shuffling

### For Students
- 🎯 Join exams with access codes
- ⏱️ Timed exam interface with auto-save
- 📝 Take multiple question types (MCQ, True/False, Short Answer)
- ⚡ Instant results with performance breakdown
- 🏆 Real-time leaderboards (if enabled)
- 📊 Personal dashboard with statistics
- 📥 Download result certificates

### System Features
- 🔐 Secure JWT authentication
- 👥 Role-based access control (Student / Teacher / Admin)
- 🚀 Real-time updates with WebSockets
- 🎨 Beautiful Bento Card UI design
- 📱 Fully responsive interface
- ⚡ Rate limiting & budget controls for AI usage
- 💾 Auto-save answers during exams

## 📋 Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **MySQL 8.0+** - [Download](https://dev.mysql.com/downloads/mysql/)
- **npm** or **yarn** package manager

## 🚀 Quick Start

### 1. Clone & Install

```bash
# Clone the repository
cd AI-Quiz-Engine

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Set Up Database

Open MySQL and run:

```bash
mysql -u root -p < create_database.sql
```

Or manually:

```sql
CREATE DATABASE quizforge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configure Environment

Edit `.env` in the root directory:

```env
# Database
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/quizforge"

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# AI Provider (choose one)
ANTHROPIC_API_KEY=your-key-here
OPENAI_API_KEY=your-key-here
AI_DEFAULT_PROVIDER=anthropic
```

### 4. Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

### 5. Start the Application

```bash
# Start both backend and frontend
npm run dev
```

This starts:
- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173

### 6. Access the App

Open your browser and visit:
**http://localhost:5173**

## 📖 Usage

### Creating Your First Quiz (Teacher)

1. **Register** as a Teacher
2. Navigate to **Teacher Dashboard**
3. Click **Create New Exam**
4. Add exam details (title, duration, passing score)
5. **Add Questions**:
   - Manually enter questions
   - OR use AI generation (just provide topic + difficulty)
6. **Publish** the exam
7. **Share** the 9-digit access code with students

### Taking a Quiz (Student)

1. **Register** as a Student
2. Navigate to **Student Dashboard**
3. Click **Enter Access Code**
4. Enter the 9-digit code from your teacher
5. **Take the Exam** (answers auto-save)
6. **Submit** when done
7. View instant results with detailed feedback

## 🏗️ Project Structure

```
AI-Quiz-Engine/
├── server/                 # Backend (Node.js + Express)
│   ├── config/            # Database & app configuration
│   ├── controllers/       # Route handlers (auth, teacher, student)
│   ├── middleware/        # Auth, error handling
│   ├── routes/            # API route definitions
│   ├── services/          # Business logic (grading, AI)
│   ├── utils/             # Helper functions
│   └── index.js           # Express app entry point
├── client/                # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── context/       # React Context (Auth)
│   │   ├── pages/         # Page components
│   │   │   ├── teacher/   # Teacher-specific pages
│   │   │   └── student/   # Student-specific pages
│   │   ├── services/      # API service layer
│   │   ├── utils/         # Helper functions
│   │   ├── App.jsx        # Main React component
│   │   └── main.jsx       # React entry point
│   └── index.html         # HTML template
├── prisma/
│   └── schema.prisma      # Database schema
├── .env                   # Environment variables
├── package.json           # Backend dependencies
└── README.md              # This file
```

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/register    - Register new user
POST /api/auth/login       - Login user
POST /api/auth/logout      - Logout user
GET  /api/auth/me          - Get current user
POST /api/auth/forgot-password  - Request password reset
POST /api/auth/reset-password   - Reset password
```

### Teacher Endpoints
```
GET    /api/teacher/exams                    - Get all exams
POST   /api/teacher/exams                    - Create exam
GET    /api/teacher/exams/:id                - Get single exam
PUT    /api/teacher/exams/:id                - Update exam
DELETE /api/teacher/exams/:id                - Delete exam
POST   /api/teacher/exams/:id/publish        - Toggle publish status
POST   /api/teacher/exams/:id/duplicate      - Duplicate exam
POST   /api/teacher/exams/:id/regenerate-code - New access code
GET    /api/teacher/exams/:examId/questions  - Get questions
POST   /api/teacher/exams/:examId/questions  - Add question
PUT    /api/teacher/exams/:examId/questions/:questionId - Update question
DELETE /api/teacher/exams/:examId/questions/:questionId - Delete question
POST   /api/teacher/questions/generate-ai    - AI generate questions
GET    /api/teacher/exams/:examId/results    - Get exam results
GET    /api/teacher/exams/:examId/statistics - Get exam statistics
GET    /api/teacher/ai-usage                 - Get AI usage stats
```

### Student Endpoints
```
GET  /api/student/dashboard/stats         - Get student stats
POST /api/student/access-code             - Join exam with code
GET  /api/student/exams                   - Get available exams
GET  /api/student/exams/:examId           - Get exam details
POST /api/student/exams/:examId/start     - Start exam attempt
PUT  /api/student/attempts/:attemptId/answers - Save answers
POST /api/student/attempts/:attemptId/submit  - Submit attempt
GET  /api/student/attempts/:attemptId     - Get attempt results
GET  /api/student/attempts                - Get all attempts
GET  /api/student/exams/:examId/leaderboard - Get leaderboard
```

## 🎨 UI Design

The app uses a custom **Bento Card** design system with:

- **Colors**:
  - Teal (Primary): `#14b8a6`
  - Coral (Accent): `#f97316`
  - Charcoal (Text): `#1f2937`
  - Sunny Yellow (Warnings): `#fbbf24`

- **Typography**: Lexend font family
- **Border Radius**: 0.75rem (consistent rounded corners)
- **Frosted Glass Navigation**: Semi-transparent blurred navbar

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Role-based access control
- ✅ Rate limiting on AI endpoints
- ✅ SQL injection protection (Prisma ORM)
- ✅ CORS configuration
- ✅ Input validation
- ✅ XSS protection

## 🧪 Testing

### Manual Testing

#### Test Teacher Features:
```bash
# Login as teacher
Email: teacher@test.com
Password: password123

# Or create new account and:
1. Create an exam
2. Generate questions with AI
3. Publish the exam
4. View the access code
```

#### Test Student Features:
```bash
# Login as student
Email: student@test.com
Password: password123

# Or create new account and:
1. Enter exam access code
2. Take the exam
3. View results
4. Check leaderboard
```

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check MySQL is running
mysql -u root -p

# Verify DATABASE_URL in .env
DATABASE_URL="mysql://root:YOUR_ACTUAL_PASSWORD@localhost:3306/quizforge"
```

### Port Already in Use
```bash
# Kill process on port 3000 (backend)
npx kill-port 3000

# Kill process on port 5173 (frontend)
npx kill-port 5173
```

### AI Generation Not Working
```bash
# Check your API key in .env
ANTHROPIC_API_KEY=sk-ant-...
# OR
OPENAI_API_KEY=sk-...

# Verify AI provider is set
AI_DEFAULT_PROVIDER=anthropic
```

### Prisma Client Not Generated
```bash
npx prisma generate
```

## 📦 Deployment

### Backend (Node.js)
Deploy to: Heroku, Railway, Render, DigitalOcean

```bash
npm run build
npm start
```

### Frontend (React)
Deploy to: Vercel, Netlify, Cloudflare Pages

```bash
cd client
npm run build
# Upload 'dist' folder
```

### Database
Use managed MySQL services: PlanetScale, AWS RDS, Google Cloud SQL

## 🤝 Contributing

This is a complete full-stack application ready for production use or further customization!

## 📄 License

MIT License - Feel free to use for personal or commercial projects!

## 🎉 Credits

Built with ❤️ using modern web technologies.

---

**Need help?** Check `START_HERE.md` for a quick start guide or `DATABASE_SETUP.md` for database configuration details.
