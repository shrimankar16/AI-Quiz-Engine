import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { 
  getExams, getExam, createExam, updateExam, deleteExam, togglePublish,
  createQuestion, deleteQuestion, getExamResults, getStatistics, generateQuestionsAI
} from '../controllers/teacher.controller.js';

const router = express.Router();

router.use(authenticate, authorize('teacher'));

router.get('/exams', getExams);
router.post('/exams', createExam);
router.get('/exams/:id', getExam);
router.put('/exams/:id', updateExam);
router.delete('/exams/:id', deleteExam);
router.post('/exams/:id/publish', togglePublish);

router.post('/exams/:examId/questions', createQuestion);
router.delete('/exams/:examId/questions/:questionId', deleteQuestion);

// AI Question Generation
router.post('/questions/generate-ai', generateQuestionsAI);

router.get('/exams/:examId/results', getExamResults);
router.get('/exams/:examId/statistics', getStatistics);

export default router;
