import puppeteer from 'puppeteer';
import { formatAccessCode } from '../utils/accessCode.js';
import { getPerformanceLevel } from './grading.service.js';

/**
 * Generate PDF for teacher's exam results
 */
export const generateExamResultsPDF = async (exam, attempts, statistics) => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          padding: 40px;
          color: #1f2937;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 3px solid #0d9488;
          padding-bottom: 20px;
        }
        h1 {
          color: #0d9488;
          margin: 0 0 10px 0;
        }
        .subtitle {
          color: #6b7280;
          font-size: 14px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin: 30px 0;
        }
        .stat-card {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #0d9488;
        }
        .stat-label {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .stat-value {
          font-size: 28px;
          font-weight: bold;
          color: #0d9488;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th {
          background: #0d9488;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: 600;
        }
        td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
        }
        tr:hover {
          background: #f9fafb;
        }
        .score-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
        }
        .score-excellent { background: #d1fae5; color: #065f46; }
        .score-good { background: #dbeafe; color: #1e40af; }
        .score-fair { background: #fef3c7; color: #92400e; }
        .score-poor { background: #fee2e2; color: #991b1b; }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #9ca3af;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${exam.title}</h1>
        <p class="subtitle">Exam Results Report</p>
        <p class="subtitle">Generated on ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Attempts</div>
          <div class="stat-value">${statistics.totalAttempts}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Average Score</div>
          <div class="stat-value">${statistics.averageScore}%</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Pass Rate</div>
          <div class="stat-value">${statistics.passRate}%</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Highest Score</div>
          <div class="stat-value">${statistics.highestScore}%</div>
        </div>
      </div>

      <h2>Student Submissions</h2>
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Email</th>
            <th>Score</th>
            <th>Status</th>
            <th>Completed At</th>
          </tr>
        </thead>
        <tbody>
          ${attempts.map(attempt => {
            const scoreClass = 
              attempt.score >= 90 ? 'score-excellent' :
              attempt.score >= 70 ? 'score-good' :
              attempt.score >= 50 ? 'score-fair' : 'score-poor';
            
            return `
              <tr>
                <td>${attempt.user.name}</td>
                <td>${attempt.user.email}</td>
                <td><span class="score-badge ${scoreClass}">${attempt.score}%</span></td>
                <td>${attempt.score >= exam.passingScore ? '✅ Passed' : '❌ Failed'}</td>
                <td>${new Date(attempt.completedAt).toLocaleString()}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <div class="footer">
        <p>QuizForge - AI-Powered Quiz Engine</p>
        <p>Access Code: ${formatAccessCode(exam.accessCode)}</p>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html);
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
  });

  await browser.close();
  return pdf;
};

/**
 * Generate PDF for student's attempt results
 */
export const generateAttemptPDF = async (attempt, exam, questions) => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const performance = getPerformanceLevel(attempt.score);
  const results = attempt.results || [];

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          padding: 40px;
          color: #1f2937;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 3px solid #0d9488;
          padding-bottom: 20px;
        }
        h1 {
          color: #0d9488;
          margin: 0 0 10px 0;
        }
        .score-display {
          font-size: 48px;
          font-weight: bold;
          color: ${performance.color === 'green' ? '#059669' : performance.color === 'amber' ? '#d97706' : '#dc2626'};
          margin: 20px 0;
        }
        .performance-badge {
          display: inline-block;
          padding: 8px 24px;
          border-radius: 20px;
          font-weight: 600;
          background: ${performance.color === 'green' ? '#d1fae5' : performance.color === 'amber' ? '#fef3c7' : '#fee2e2'};
          color: ${performance.color === 'green' ? '#065f46' : performance.color === 'amber' ? '#92400e' : '#991b1b'};
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin: 30px 0;
        }
        .info-card {
          background: #f9fafb;
          padding: 15px;
          border-radius: 8px;
        }
        .info-label {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 5px;
        }
        .info-value {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }
        .question {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          border-left: 4px solid ${performance.color === 'green' ? '#10b981' : '#ef4444'};
        }
        .question-header {
          font-weight: 600;
          margin-bottom: 10px;
          color: #1f2937;
        }
        .answer-row {
          margin: 8px 0;
          padding: 8px;
          border-radius: 4px;
        }
        .correct-answer {
          background: #d1fae5;
          color: #065f46;
        }
        .wrong-answer {
          background: #fee2e2;
          color: #991b1b;
        }
        .label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          margin-right: 8px;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #9ca3af;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${exam.title}</h1>
        <p style="color: #6b7280;">Exam Results</p>
        <div class="score-display">${attempt.score}%</div>
        <span class="performance-badge">${performance.level}</span>
        <p style="margin-top: 10px; color: #6b7280;">${performance.message}</p>
      </div>

      <div class="info-grid">
        <div class="info-card">
          <div class="info-label">Student</div>
          <div class="info-value">${attempt.user?.name || 'N/A'}</div>
        </div>
        <div class="info-card">
          <div class="info-label">Completed At</div>
          <div class="info-value">${new Date(attempt.completedAt).toLocaleDateString()}</div>
        </div>
        <div class="info-card">
          <div class="info-label">Correct Answers</div>
          <div class="info-value">${results.filter(r => r.isCorrect).length} / ${results.length}</div>
        </div>
      </div>

      <h2 style="margin-top: 40px; color: #1f2937;">Detailed Results</h2>

      ${results.map((result, index) => `
        <div class="question">
          <div class="question-header">
            ${result.isCorrect ? '✅' : '❌'} Question ${index + 1}
          </div>
          <p style="margin: 10px 0;">${result.question}</p>
          
          ${result.studentAnswer ? `
            <div class="answer-row ${result.isCorrect ? 'correct-answer' : 'wrong-answer'}">
              <span class="label">Your Answer:</span>
              ${result.studentAnswer}
            </div>
          ` : '<div class="answer-row wrong-answer"><span class="label">Your Answer:</span> No answer provided</div>'}
          
          ${!result.isCorrect ? `
            <div class="answer-row correct-answer">
              <span class="label">Correct Answer:</span>
              ${result.correctAnswer}
            </div>
          ` : ''}
        </div>
      `).join('')}

      <div class="footer">
        <p>QuizForge - AI-Powered Quiz Engine</p>
        <p>Generated on ${new Date().toLocaleString()}</p>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html);
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
  });

  await browser.close();
  return pdf;
};
