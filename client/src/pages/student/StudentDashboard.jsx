import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import {
  BookOpen,
  Trophy,
  TrendingUp,
  Clock,
  Target,
  Code,
  Calendar,
  ArrowRight,
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    examsTaken: 0,
    avgScore: 0,
    bestScore: 0,
  });
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, attemptsRes] = await Promise.all([
        api.get('/student/dashboard/stats'),
        api.get('/student/attempts'),
      ]);

      setStats(statsRes.data);
      setAttempts(attemptsRes.data.attempts.slice(0, 5)); // Latest 5 attempts
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceBadge = (score) => {
    if (score >= 90) return { class: 'badge-success', text: 'Excellent' };
    if (score >= 80) return { class: 'badge-success', text: 'Very Good' };
    if (score >= 70) return { class: 'badge-success', text: 'Good' };
    if (score >= 60) return { class: 'badge-warning', text: 'Fair' };
    return { class: 'badge-danger', text: 'Needs Improvement' };
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
        <p className="text-gray-600 mt-2">Track your progress and take new exams.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bento-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Exams Taken</p>
              <p className="text-3xl font-bold text-gray-900">{stats.examsTaken}</p>
            </div>
            <BookOpen className="h-12 w-12 text-teal-600" />
          </div>
        </div>

        <div className="bento-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Average Score</p>
              <p className="text-3xl font-bold text-gray-900">{stats.avgScore}%</p>
            </div>
            <TrendingUp className="h-12 w-12 text-purple-600" />
          </div>
        </div>

        <div className="bento-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Best Score</p>
              <p className="text-3xl font-bold text-gray-900">{stats.bestScore}%</p>
            </div>
            <Trophy className="h-12 w-12 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          to="/student/access-code"
          className="bento-card p-6 hover:shadow-lg transition-all group"
        >
          <Code className="h-10 w-10 text-teal-600 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold mb-2">Enter Access Code</h3>
          <p className="text-sm text-gray-600">Join an exam using the 9-digit access code</p>
        </Link>

        <Link
          to="/student/attempts"
          className="bento-card p-6 hover:shadow-lg transition-all group"
        >
          <Calendar className="h-10 w-10 text-purple-600 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold mb-2">My Attempts</h3>
          <p className="text-sm text-gray-600">View all your exam attempts and results</p>
        </Link>
      </div>

      {/* Recent Attempts */}
      <div className="bento-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Recent Attempts</h2>
          <Link to="/student/attempts" className="text-teal-600 hover:text-teal-700 font-medium">
            View all
          </Link>
        </div>

        {attempts.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No attempts yet. Take your first exam!</p>
            <Link to="/student/access-code" className="btn-primary inline-block">
              Enter Access Code
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {attempts.map((attempt) => {
              const badge = getPerformanceBadge(attempt.score);
              return (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-teal-600 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{attempt.exam.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        Score: {attempt.score}%
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(attempt.completedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        by {attempt.exam.teacher.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={badge.class}>{badge.text}</span>
                    <Link
                      to={`/student/attempts/${attempt.id}`}
                      className="btn-secondary px-4 py-2 flex items-center space-x-2"
                    >
                      <span>View</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
