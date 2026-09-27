# QuizForge Setup Guide

## Prerequisites

1. **Node.js 18+** - Download from [nodejs.org](https://nodejs.org)
2. **MySQL 8+** - Download from [mysql.com](https://dev.mysql.com/downloads/mysql/)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup MySQL Database

Open MySQL and create the database:

```sql
CREATE DATABASE quizforge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configure Environment

Update `.env` file with your database credentials:

```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/quizforge"
```

### 4. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This creates all tables in your MySQL database.

### 5. Start the Application

```bash
npm run dev
```

This starts:
- Backend API: http://localhost:3000
- Frontend: http://localhost:5173

## What You Can Do

### As a Teacher:
1. Register with role "teacher"
2. Create exams
3. Add questions (multiple choice, true/false, short answer)
4. Get unique access codes
5. Publish exams
6. View results and statistics

### As a Student:
1. Register with role "student"
2. Join exams using access codes
3. Take timed exams
4. Submit and get instant results
5. View performance feedback

## Troubleshooting

**Database Connection Error:**
- Verify MySQL is running
- Check DATABASE_URL in `.env`
- Ensure database exists

**Port Already in Use:**
- Backend: Change PORT in `.env`
- Frontend: Change port in `client/vite.config.js`

**Module Not Found:**
- Run `npm install` in root
- Run `cd client && npm install`

## Production Build

```bash
npm run build
npm start
```

## Need Help?

Check README.md for detailed documentation.
