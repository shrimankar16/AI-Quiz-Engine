@echo off
echo ========================================
echo QuizForge Database Setup
echo ========================================
echo.
echo This will create the 'quizforge' database
echo and all necessary tables in MySQL.
echo.
echo Make sure MySQL is running!
echo.
pause

echo.
echo Enter your MySQL root password when prompted:
echo.
mysql -u root -p < create_database.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Database created successfully!
    echo ========================================
    echo.
    echo Database: quizforge
    echo Tables: users, exams, questions, attempts, ai_usages
    echo.
    echo Sample accounts created:
    echo   Teacher: teacher@test.com / password123
    echo   Student: student@test.com / password123
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: Failed to create database
    echo ========================================
    echo.
    echo Please check:
    echo 1. MySQL is running
    echo 2. Your root password is correct
    echo 3. You have proper permissions
    echo.
)

echo.
echo Next steps:
echo 1. Update your .env file with DATABASE_URL
echo 2. Run: npm install
echo 3. Run: npx prisma generate
echo 4. Run: npm run dev
echo.
pause
