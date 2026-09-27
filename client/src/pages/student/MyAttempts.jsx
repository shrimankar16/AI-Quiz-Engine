import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../utils/api'
import { BookOpen, TrendingUp } from 'lucide-react'

const MyAttempts = () => {
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAttempts()
  }, [])

  const fetchAttempts = async () => {
    try {
      const response = await api.get('/student/attempts')
      setAttempts(response.data.attempts)
    } catch (error) {
      console.error('Failed to fetch attempts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  const avgScore = attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
    : 0

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">My Attempts</h1>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bento-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Total Attempts</p>
                <p className="text-3xl font-bold text-gray-900">{attempts.length}</p>
              </div>
              <BookOpen className="w-12 h-12 text-teal-600" />
            </div>
          </div>

          <div className="bento-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Average Score</p>
                <p className="text-3xl font-bold text-teal-600">{avgScore}%</p>
              </div>
              <TrendingUp className="w-12 h-12 text-teal-600" />
            </div>
          </div>
        </div>

        {/* Attempts List */}
        <div className="bento-card p-6">
          {attempts.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg mb-4">No attempts yet</p>
              <Link to="/student/access-code" className="btn-primary">
                Join Your First Exam
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {attempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{attempt.exam.title}</h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>Teacher: {attempt.exam.teacher.name}</span>
                      <span>•</span>
                      <span>Completed: {new Date(attempt.completedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-teal-600 mb-2">{attempt.score}%</div>
                    <Link
                      to={`/student/attempts/${attempt.id}`}
                      className="text-sm text-teal-600 hover:text-teal-700 font-medium"
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

export default MyAttempts
