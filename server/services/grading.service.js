const normalize = (answer) => String(answer || '').toLowerCase().trim();

const checkAnswer = (question, studentAnswer) => {
  if (!studentAnswer) return false;
  return normalize(studentAnswer) === normalize(question.correctAnswer);
};

export const gradeAttempt = (attempt, questions) => {
  const answers = attempt.answers || {};
  const results = [];
  let correctCount = 0;

  for (const question of questions) {
    const studentAnswer = answers[question.id] || null;
    const isCorrect = checkAnswer(question, studentAnswer);
    
    if (isCorrect) correctCount++;
    
    results.push({
      questionId: question.id,
      question: question.question,
      type: question.type,
      studentAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      options: question.options,
    });
  }

  const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  return {
    score,
    correctCount,
    totalQuestions: questions.length,
    results,
    passed: score >= 70,
  };
};

export const getPerformanceLevel = (score) => {
  if (score >= 90) return { level: 'Excellent', color: 'green', message: 'Outstanding performance!' };
  if (score >= 80) return { level: 'Very Good', color: 'green', message: 'Great job!' };
  if (score >= 70) return { level: 'Good', color: 'green', message: 'You passed!' };
  if (score >= 60) return { level: 'Fair', color: 'amber', message: 'Consider reviewing.' };
  if (score >= 50) return { level: 'Needs Improvement', color: 'amber', message: 'More practice needed.' };
  return { level: 'Poor', color: 'red', message: 'Significant review required.' };
};
