import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../utils/api'
import { BookOpen, Trophy, TrendingUp, Key } from 'lucide-react'

const StudentDashboard = () => {
  const [stats, setStats] = useState(null)
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, attemptsRes] = await Promise.all([
        api.get('/student/dashboard/stats'),
        api.get('/student/attempts')
      ])
      setStats(statsRes.data)
      setAttempts(attemptsRes.data.attempts.slice(0, 5))
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Student Dashboard</h1>
            <p className="text-white/80">Track your progress and take exams</p>
          </div>
          <Link to="/student/access-code" className="btn-primary flex items-center space-x-2">
            <Key className="w-5 h-5" />
            <span>Enter Access Code</span>
          </Link>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bento-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Exams Taken</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.examsTaken}</p>
                </div>
                <BookOpen className="w-12 h-12 text-teal-600" />
              </div>
            </div>

            <div className="bento-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Average Score</p>
                  <p className="text-3xl font-bold text-teal-600">{stats.avgScore}%</p>
                </div>
                <TrendingUp className="w-12 h-12 text-teal-600" />
              </div>
            </div>

            <div className="bento-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Best Score</p>
                  <p className="text-3xl font-bold text-green-600">{stats.bestScore}%</p>
                </div>
                <Trophy className="w-12 h-12 text-teal-600" />
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            to="/student/access-code"
            className="bento-card p-6 hover:shadow-xl transition-shadow text-center"
          >
            <Key className="w-10 h-10 text-teal-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900">Join Exam</h3>
            <p className="text-sm text-gray-600 mt-1">Enter access code</p>
          </Link>

          <Link
            to="/student/attempts"
            className="bento-card p-6 hover:shadow-xl transition-shadow text-center"
          >
            <BookOpen className="w-10 h-10 text-teal-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900">My Attempts</h3>
            <p className="text-sm text-gray-600 mt-1">View history</p>
          </Link>

          <div className="bento-card p-6 bg-gradient-to-br from-teal-500 to-teal-600 text-white text-center">
            <div className="text-3xl font-bold mb-1">{stats?.examsTaken || 0}</div>
            <p className="text-sm">Total Attempts</p>
          </div>
        </div>

        {/* Recent Attempts */}
        <div className="bento-card p-6">
          <h2 className="text-2xl font-bold mb-6">Recent Attempts</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="spinner mx-auto"></div>
            </div>
          ) : attempts.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <p>No attempts yet. Join an exam to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {attempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">{attempt.exam.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Completed {new Date(attempt.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-teal-600">{attempt.score}%</p>
                    <Link
                      to={`/student/attempts/${attempt.id}`}
                      className="text-sm text-teal-600 hover:text-teal-700"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
