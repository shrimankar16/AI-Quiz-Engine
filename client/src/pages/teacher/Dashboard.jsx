import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../utils/api'
import { BookOpen, Plus, BarChart3, Clock } from 'lucide-react'

const TeacherDashboard = () => {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExams()
  }, [])

  const fetchExams = async () => {
    try {
      const response = await api.get('/teacher/exams')
      setExams(response.data.exams)
    } catch (error) {
      console.error('Failed to fetch exams:', error)
    } finally {
      setLoading(false)
    }
  }

  const recentExams = exams.slice(0, 5)

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Teacher Dashboard</h1>
            <p className="text-white/80">Manage your exams and track student performance</p>
          </div>
          <Link
            to="/teacher/exams/create"
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Exam</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bento-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Total Exams</p>
                <p className="text-3xl font-bold text-gray-900">{exams.length}</p>
              </div>
              <BookOpen className="w-12 h-12 text-teal-600" />
            </div>
          </div>

          <div className="bento-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Published</p>
                <p className="text-3xl font-bold text-gray-900">
                  {exams.filter(e => e.isPublished).length}
                </p>
              </div>
              <BarChart3 className="w-12 h-12 text-teal-600" />
            </div>
          </div>

          <div className="bento-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Total Attempts</p>
                <p className="text-3xl font-bold text-gray-900">
                  {exams.reduce((sum, e) => sum + (e._count?.attempts || 0), 0)}
                </p>
              </div>
              <Clock className="w-12 h-12 text-teal-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            to="/teacher/exams"
            className="bento-card p-6 hover:shadow-xl transition-shadow text-center"
          >
            <BookOpen className="w-10 h-10 text-teal-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900">All Exams</h3>
            <p className="text-sm text-gray-600 mt-1">View and manage</p>
          </Link>

          <Link
            to="/teacher/exams/create"
            className="bento-card p-6 hover:shadow-xl transition-shadow text-center"
          >
            <Plus className="w-10 h-10 text-teal-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900">Create Exam</h3>
            <p className="text-sm text-gray-600 mt-1">New assessment</p>
          </Link>

          <Link
            to="/teacher/ai-usage"
            className="bento-card p-6 hover:shadow-xl transition-shadow text-center"
          >
            <BarChart3 className="w-10 h-10 text-teal-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900">AI Usage</h3>
            <p className="text-sm text-gray-600 mt-1">Track costs</p>
          </Link>

          <div className="bento-card p-6 bg-gradient-to-br from-teal-500 to-teal-600 text-white text-center">
            <div className="text-2xl font-bold mb-1">{exams.length}</div>
            <p className="text-sm">Exams Created</p>
          </div>
        </div>

        {/* Recent Exams */}
        <div className="bento-card p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Exams</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="spinner mx-auto"></div>
            </div>
          ) : recentExams.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <p>No exams yet. Create your first exam to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentExams.map((exam) => (
                <div
                  key={exam.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <span>{exam._count?.questions || 0} questions</span>
                      <span>{exam._count?.attempts || 0} attempts</span>
                      <span className={`px-2 py-1 rounded ${
                        exam.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {exam.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/teacher/exams/${exam.id}/questions`}
                      className="btn-secondary text-sm"
                    >
                      Questions
                    </Link>
                    <Link
                      to={`/teacher/exams/${exam.id}/results`}
                      className="btn-primary text-sm"
                    >
                      Results
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

export default TeacherDashboard
