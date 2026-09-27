import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import CreateExam from './pages/teacher/CreateExam';
import ManageExams from './pages/teacher/ManageExams';
import ManageQuestions from './pages/teacher/ManageQuestions';
import ExamResults from './pages/teacher/ExamResults';
import AiUsage from './pages/teacher/AiUsage';
import StudentDashboard from './pages/student/StudentDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-teal-50 to-cyan-50">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Teacher routes */}
            <Route
              path="/teacher/dashboard"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <Navbar />
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/exams/create"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <Navbar />
                  <CreateExam />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/exams"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <Navbar />
                  <ManageExams />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/exams/:examId/questions"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <Navbar />
                  <ManageQuestions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/exams/:examId/results"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <Navbar />
                  <ExamResults />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/ai-usage"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <Navbar />
                  <AiUsage />
                </ProtectedRoute>
              }
            />

            {/* Student routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute requiredRole="student">
                  <Navbar />
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
