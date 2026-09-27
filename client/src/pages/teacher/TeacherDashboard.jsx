import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import {
  BookOpen,
  Plus,
  Eye,
  Users,
  BarChart3,
  TrendingUp,
  Clock,
  Brain,
} from 'lucide-react';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [stats, setStats] = useState({
    totalExams: 0,
    publishedExams: 0,
    totalAttempts: 0,
    avgScore: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/teacher/exams');
      const examsData = response.data.exams;
      setExams(examsData.slice(0, 5)); // Show latest 5 exams

      // Calculate stats
      const totalExams = examsData.length;
      const publishedExams = examsData.filter(e => e.isPublished).length;
      const totalAttempts = examsData.reduce((sum, e) => sum + e._count.attempts, 0);

      setStats({
        totalExams,
        publishedExams,
        totalAttempts,
        avgScore: 0, // Would need to calculate from attempts
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your exams today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bento-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Exams</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalExams}</p>
            </div>
            <BookOpen className="h-12 w-12 text-teal-600" />
          </div>
        </div>

        <div className="bento-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Published</p>
              <p className="text-3xl font-bold text-gray-900">{stats.publishedExams}</p>
            </div>
            <Eye className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="bento-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Attempts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalAttempts}</p>
            </div>
            <Users className="h-12 w-12 text-purple-600" />
          </div>
        </div>

        <div className="bento-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Score</p>
              <p className="text-3xl font-bold text-gray-900">{stats.avgScore}%</p>
            </div>
            <TrendingUp className="h-12 w-12 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/teacher/exams/create"
          className="bento-card p-6 hover:shadow-lg transition-all group"
        >
          <Plus className="h-10 w-10 text-teal-600 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold mb-2">Create New Exam</h3>
          <p className="text-sm text-gray-600">Start building a new exam with AI or manually</p>
        </Link>

        <Link
          to="/teacher/exams"
          className="bento-card p-6 hover:shadow-lg transition-all group"
        >
          <BookOpen className="h-10 w-10 text-purple-600 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold mb-2">Manage Exams</h3>
          <p className="text-sm text-gray-600">View, edit, and organize your exams</p>
        </Link>

        <Link
          to="/teacher/ai-usage"
          className="bento-card p-6 hover:shadow-lg transition-all group"
        >
          <Brain className="h-10 w-10 text-cyan-600 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold mb-2">AI Usage</h3>
          <p className="text-sm text-gray-600">Track your AI question generation usage</p>
        </Link>
      </div>

      {/* Recent Exams */}
      <div className="bento-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Recent Exams</h2>
          <Link to="/teacher/exams" className="text-teal-600 hover:text-teal-700 font-medium">
            View all
          </Link>
        </div>

        {exams.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No exams yet. Create your first exam!</p>
            <Link to="/teacher/exams/create" className="btn-primary inline-block">
              Create Exam
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-teal-600 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{exam.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {exam._count.questions} questions
                    </span>
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {exam._count.attempts} attempts
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {exam.durationMinutes} min
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {exam.isPublished ? (
                    <span className="badge-success">Published</span>
                  ) : (
                    <span className="badge-warning">Draft</span>
                  )}
                  <Link
                    to={`/teacher/exams/${exam.id}/questions`}
                    className="btn-secondary px-4 py-2"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
