# MySQL Database Setup for QuizForge

## Step-by-Step Guide

### 1. Install MySQL (If Not Already Installed)

#### Windows:
Download from: https://dev.mysql.com/downloads/mysql/
Run the installer and follow prompts.

#### Mac:
```bash
brew install mysql
brew services start mysql
```

#### Linux:
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

### 2. Open MySQL Command Line

#### Windows:
- Open "MySQL Command Line Client" from Start Menu
- Or use Command Prompt: `mysql -u root -p`

#### Mac/Linux:
```bash
mysql -u root -p
```

Enter your MySQL root password (leave empty if no password was set).

### 3. Create the Database

```sql
CREATE DATABASE quizforge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

You should see:
```
Query OK, 1 row affected (0.01 sec)
```

### 4. Verify Database was Created

```sql
SHOW DATABASES;
```

You should see `quizforge` in the list.

```sql
USE quizforge;
```

You should see:
```
Database changed
```

### 5. Exit MySQL

```sql
EXIT;
```

### 6. Update .env File

Open the `.env` file in the root directory and update this line:

```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/quizforge"
```

**Replace `YOUR_PASSWORD` with your MySQL root password.**

Examples:
```env
# If no password:
DATABASE_URL="mysql://root:@localhost:3306/quizforge"

# With password "mypassword":
DATABASE_URL="mysql://root:mypassword@localhost:3306/quizforge"

# Different user:
DATABASE_URL="mysql://username:password@localhost:3306/quizforge"
```

### 7. Run Prisma Migrations

This will create all the tables in your database:

```bash
npx prisma migrate dev --name init
```

You should see output like:
```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": MySQL database "quizforge" at "localhost:3306"

✔ Name of migration: init
The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20260912_init/
      └─ migration.sql

✔ Generated Prisma Client
```

### 8. Verify Tables Were Created

Go back to MySQL:

```bash
mysql -u root -p
USE quizforge;
SHOW TABLES;
```

You should see:
```
+------------------------+
| Tables_in_quizforge    |
+------------------------+
| _prisma_migrations     |
| ai_usages              |
| attempts               |
| exams                  |
| password_reset_tokens  |
| questions              |
| users                  |
+------------------------+
7 rows in set (0.00 sec)
```

### 9. (Optional) View Table Structure

```sql
DESCRIBE users;
DESCRIBE exams;
DESCRIBE questions;
```

## Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"
**Solution**: Wrong password in DATABASE_URL. Update `.env` file.

### Error: "Can't connect to MySQL server"
**Solution**: MySQL not running. Start MySQL service:
- Windows: Services → MySQL → Start
- Mac: `brew services start mysql`
- Linux: `sudo systemctl start mysql`

### Error: "Unknown database 'quizforge'"
**Solution**: Database not created. Run Step 3 again.

### Error: "Connection timeout"
**Solution**: Check if MySQL is running on port 3306:
```bash
netstat -an | findstr 3306    # Windows
netstat -an | grep 3306       # Mac/Linux
```

### Reset Database (If Needed)

```sql
DROP DATABASE quizforge;
CREATE DATABASE quizforge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Then run migrations again:
```bash
npx prisma migrate dev --name init
```

## Using Prisma Studio (Database GUI)

To view and edit your database visually:

```bash
npx prisma studio
```

This opens a web interface at http://localhost:5555 where you can:
- View all tables
- Edit records
- Add test data
- Run queries

## Database Management Tips

### Backup Database

```bash
mysqldump -u root -p quizforge > backup.sql
```

### Restore Database

```bash
mysql -u root -p quizforge < backup.sql
```

### View All Data

```sql
SELECT * FROM users;
SELECT * FROM exams;
SELECT * FROM questions;
SELECT * FROM attempts;
```

### Delete All Data (Keep Tables)

```sql
DELETE FROM attempts;
DELETE FROM questions;
DELETE FROM exams;
DELETE FROM users;
DELETE FROM ai_usages;
DELETE FROM password_reset_tokens;
```

## You're Done!

Once you see all tables created, you can start the application:

```bash
npm run dev
```

The application will connect to your MySQL database automatically.
