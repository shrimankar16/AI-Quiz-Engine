import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { validateRequired } from '../utils/validation.js';
import { cleanAccessCode } from '../utils/accessCode.js';
import { gradeAttempt, getPerformanceLevel } from '../services/grading.service.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const attempts = await prisma.attempt.findMany({
      where: { userId: req.user.id, completedAt: { not: null } },
    });
    const scores = attempts.filter(a => a.score !== null).map(a => a.score);
    res.json({
      examsTaken: attempts.length,
      avgScore: scores.length ? Math.round(scores.reduce((a, b) => a + b) / scores.length) : 0,
      bestScore: scores.length ? Math.max(...scores) : 0,
    });
  } catch (error) { next(error); }
};

export const joinExamWithCode = async (req, res, next) => {
  try {
    const { accessCode } = req.body;
    validateRequired(['accessCode'], req.body);
    
    const exam = await prisma.exam.findUnique({
      where: { accessCode: cleanAccessCode(accessCode) },
      include: { _count: { select: { questions: true } } },
    });
    
    if (!exam) throw new AppError('Invalid access code', 404);
    if (!exam.isPublished) throw new AppError('Exam not available', 403);
    
    res.json({ exam });
  } catch (error) { next(error); }
};

export const getExamDetails = async (req, res, next) => {
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: parseInt(req.params.examId) },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          select: { id: true, question: true, type: true, options: true },
        },
      },
    });
    
    if (!exam || !exam.isPublished) throw new AppError('Exam not found', 404);
    res.json({ exam });
  } catch (error) { next(error); }
};

export const startAttempt = async (req, res, next) => {
  try {
    const { examId } = req.params;
    
    const existing = await prisma.attempt.findFirst({
      where: { examId: parseInt(examId), userId: req.user.id, completedAt: null },
    });
    
    if (existing) return res.json({ message: 'Resuming attempt', attempt: existing });
    
    const attempt = await prisma.attempt.create({
      data: {
        examId: parseInt(examId),
        userId: req.user.id,
        startedAt: new Date(),
        answers: {},
      },
    });
    
    res.status(201).json({ message: 'Attempt started', attempt });
  } catch (error) { next(error); }
};

export const saveAnswers = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const { answers } = req.body;
    
    const attempt = await prisma.attempt.findFirst({
      where: { id: parseInt(attemptId), userId: req.user.id },
    });
    
    if (!attempt) throw new AppError('Attempt not found', 404);
    if (attempt.completedAt) throw new AppError('Already submitted', 400);
    
    const updated = await prisma.attempt.update({
      where: { id: parseInt(attemptId) },
      data: { answers },
    });
    
    res.json({ message: 'Saved', attempt: updated });
  } catch (error) { next(error); }
};

export const submitAttempt = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const { answers } = req.body;
    
    const attempt = await prisma.attempt.findFirst({
      where: { id: parseInt(attemptId), userId: req.user.id },
      include: { exam: { include: { questions: true } } },
    });
    
    if (!attempt) throw new AppError('Attempt not found', 404);
    if (attempt.completedAt) throw new AppError('Already submitted', 400);
    
    const result = gradeAttempt({ ...attempt, answers: answers || attempt.answers }, attempt.exam.questions);
    
    const submitted = await prisma.attempt.update({
      where: { id: parseInt(attemptId) },
      data: {
        answers: answers || attempt.answers,
        score: result.score,
        results: result.results,
        completedAt: new Date(),
      },
    });
    
    // Emit socket event
    const io = req.app.get('io');
    if (io) io.to(`exam-${attempt.examId}`).emit('leaderboard:update', { examId: attempt.examId });
    
    res.json({
      message: 'Submitted',
      attempt: submitted,
      performance: getPerformanceLevel(result.score),
      ...result,
    });
  } catch (error) { next(error); }
};

export const getAttemptResults = async (req, res, next) => {
  try {
    const attempt = await prisma.attempt.findFirst({
      where: { id: parseInt(req.params.attemptId), userId: req.user.id },
      include: { exam: { select: { title: true, passingScore: true } } },
    });
    
    if (!attempt) throw new AppError('Attempt not found', 404);
    if (!attempt.completedAt) throw new AppError('Not submitted yet', 400);
    
    res.json({ attempt, performance: getPerformanceLevel(attempt.score) });
  } catch (error) { next(error); }
};

export const getLeaderboard = async (req, res, next) => {
  try {
    const exam = await prisma.exam.findUnique({ where: { id: parseInt(req.params.examId) } });
    if (!exam || !exam.leaderboardEnabled) throw new AppError('Leaderboard not available', 403);
    
    const attempts = await prisma.attempt.findMany({
      where: { examId: exam.id, completedAt: { not: null } },
      include: { user: { select: { name: true } } },
      orderBy: [{ score: 'desc' }, { completedAt: 'asc' }],
      take: 50,
    });
    
    const leaderboard = attempts.map((a, i) => ({
      rank: i + 1,
      userName: a.user.name,
      score: a.score,
      completedAt: a.completedAt,
      isCurrentUser: a.userId === req.user.id,
    }));
    
    res.json({ leaderboard });
  } catch (error) { next(error); }
};
