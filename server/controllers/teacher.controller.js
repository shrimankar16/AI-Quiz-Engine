import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { generateAccessCode } from '../utils/accessCode.js';
import { validateRequired } from '../utils/validation.js';

export const getExams = async (req, res, next) => {
  try {
    const exams = await prisma.exam.findMany({
      where: { teacherId: req.user.id },
      include: { _count: { select: { questions: true, attempts: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ exams });
  } catch (error) { next(error); }
};

export const getExam = async (req, res, next) => {
  try {
    const exam = await prisma.exam.findFirst({
      where: { id: parseInt(req.params.id), teacherId: req.user.id },
      include: { questions: { orderBy: { order: 'asc' } } },
    });
    if (!exam) throw new AppError('Exam not found', 404);
    res.json({ exam });
  } catch (error) { next(error); }
};

export const createExam = async (req, res, next) => {
  try {
    const { title, description, durationMinutes = 60, passingScore = 70 } = req.body;
    validateRequired(['title'], req.body);
    
    const exam = await prisma.exam.create({
      data: {
        teacherId: req.user.id,
        title,
        description,
        durationMinutes: parseInt(durationMinutes),
        passingScore: parseInt(passingScore),
        accessCode: await generateAccessCode(),
      },
    });
    res.status(201).json({ message: 'Exam created', exam });
  } catch (error) { next(error); }
};

export const updateExam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exists = await prisma.exam.findFirst({ 
      where: { id: parseInt(id), teacherId: req.user.id } 
    });
    if (!exists) throw new AppError('Exam not found', 404);
    
    const exam = await prisma.exam.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json({ message: 'Exam updated', exam });
  } catch (error) { next(error); }
};

export const deleteExam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exists = await prisma.exam.findFirst({ 
      where: { id: parseInt(id), teacherId: req.user.id } 
    });
    if (!exists) throw new AppError('Exam not found', 404);
    
    await prisma.exam.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Exam deleted' });
  } catch (error) { next(error); }
};

export const togglePublish = async (req, res, next) => {
  try {
    const exam = await prisma.exam.findFirst({ 
      where: { id: parseInt(req.params.id), teacherId: req.user.id } 
    });
    if (!exam) throw new AppError('Exam not found', 404);
    
    const updated = await prisma.exam.update({
      where: { id: exam.id },
      data: { isPublished: !exam.isPublished },
    });
    res.json({ message: 'Status updated', exam: updated });
  } catch (error) { next(error); }
};

export const createQuestion = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const { question, type, options, correctAnswer } = req.body;
    validateRequired(['question', 'type', 'correctAnswer'], req.body);
    
    const exam = await prisma.exam.findFirst({ 
      where: { id: parseInt(examId), teacherId: req.user.id } 
    });
    if (!exam) throw new AppError('Exam not found', 404);
    
    const lastQ = await prisma.question.findFirst({
      where: { examId: parseInt(examId) },
      orderBy: { order: 'desc' },
    });
    
    const newQ = await prisma.question.create({
      data: {
        examId: parseInt(examId),
        question,
        type,
        options,
        correctAnswer,
        order: lastQ ? lastQ.order + 1 : 0,
      },
    });
    res.status(201).json({ message: 'Question added', question: newQ });
  } catch (error) { next(error); }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    const { examId, questionId } = req.params;
    const exam = await prisma.exam.findFirst({ 
      where: { id: parseInt(examId), teacherId: req.user.id } 
    });
    if (!exam) throw new AppError('Exam not found', 404);
    
    await prisma.question.delete({ where: { id: parseInt(questionId) } });
    res.json({ message: 'Question deleted' });
  } catch (error) { next(error); }
};

export const getExamResults = async (req, res, next) => {
  try {
    const exam = await prisma.exam.findFirst({ 
      where: { id: parseInt(req.params.examId), teacherId: req.user.id } 
    });
    if (!exam) throw new AppError('Exam not found', 404);
    
    const attempts = await prisma.attempt.findMany({
      where: { examId: exam.id, completedAt: { not: null } },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { completedAt: 'desc' },
    });
    res.json({ attempts });
  } catch (error) { next(error); }
};

export const getStatistics = async (req, res, next) => {
  try {
    const exam = await prisma.exam.findFirst({ 
      where: { id: parseInt(req.params.examId), teacherId: req.user.id } 
    });
    if (!exam) throw new AppError('Exam not found', 404);
    
    const attempts = await prisma.attempt.findMany({
      where: { examId: exam.id, completedAt: { not: null }, score: { not: null } },
    });

    if (!attempts.length) {
      return res.json({ totalAttempts: 0, averageScore: 0, highestScore: 0, lowestScore: 0, passRate: 0 });
    }

    const scores = attempts.map(a => a.score);
    res.json({
      totalAttempts: attempts.length,
      averageScore: Math.round(scores.reduce((a, b) => a + b) / scores.length),
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
      passRate: Math.round((scores.filter(s => s >= exam.passingScore).length / scores.length) * 100),
    });
  } catch (error) { next(error); }
};

export const generateQuestionsAI = async (req, res, next) => {
  // Import and re-export from service
  const { generateQuestionsWithAI } = await import('../services/aiQuestion.service.js');
  return generateQuestionsWithAI(req, res, next);
};
