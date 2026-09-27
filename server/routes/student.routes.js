import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  getDashboardStats, joinExamWithCode, getExamDetails, startAttempt,
  saveAnswers, submitAttempt, getAttemptResults, getLeaderboard
} from '../controllers/student.controller.js';

const router = express.Router();

router.use(authenticate, authorize('student'));

router.get('/dashboard/stats', getDashboardStats);
router.post('/access-code', joinExamWithCode);
router.get('/exams/:examId', getExamDetails);
router.post('/exams/:examId/start', startAttempt);
router.put('/attempts/:attemptId/answers', saveAnswers);
router.post('/attempts/:attemptId/submit', submitAttempt);
router.get('/attempts/:attemptId', getAttemptResults);
router.get('/exams/:examId/leaderboard', getLeaderboard);

export default router;
