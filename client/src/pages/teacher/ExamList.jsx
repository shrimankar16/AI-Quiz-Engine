import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../utils/api'
import { Plus, Search, Eye, Edit, Trash2, Share2, Copy } from 'lucide-react'

const ExamList = () => {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchExams()
  }, [search, filter])

  const fetchExams = async () => {
    try {
      const params = {}
      if (search) params.search = search
      if (filter !== 'all') params.published = filter === 'published'
      
      const response = await api.get('/teacher/exams', { params })
      setExams(response.data.exams)
    } catch (error) {
      console.error('Failed to fetch exams:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this exam?')) return

    try {
      await api.delete(`/teacher/exams/${id}`)
      setExams(exams.filter(e => e.id !== id))
    } catch (error) {
      alert('Failed to delete exam')
    }
  }

  const handleTogglePublish = async (id) => {
    try {
      const response = await api.post(`/teacher/exams/${id}/publish`)
      setExams(exams.map(e => e.id === id ? response.data.exam : e))
    } catch (error) {
      alert('Failed to toggle publish status')
    }
  }

  const handleDuplicate = async (id) => {
    try {
      const response = await api.post(`/teacher/exams/${id}/duplicate`)
      setExams([response.data.exam, ...exams])
      alert('Exam duplicated successfully!')
    } catch (error) {
      alert('Failed to duplicate exam')
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">My Exams</h1>
          <Link to="/teacher/exams/create" className="btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Create Exam</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="bento-card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search exams..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                  filter === 'all' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('published')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                  filter === 'published' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Published
              </button>
              <button
                onClick={() => setFilter('draft')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                  filter === 'draft' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Draft
              </button>
            </div>
          </div>
        </div>

        {/* Exams List */}
        <div className="bento-card p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="spinner mx-auto"></div>
            </div>
          ) : exams.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <p className="text-lg mb-4">No exams found</p>
              <Link to="/teacher/exams/create" className="btn-primary inline-flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Create Your First Exam</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {exams.map((exam) => (
                <div key={exam.id} className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{exam.title}</h3>
                      <p className="text-gray-600 mt-1">{exam.description}</p>
                      <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                        <span>📝 {exam._count?.questions || 0} questions</span>
                        <span>👥 {exam._count?.attempts || 0} attempts</span>
                        <span>⏱️ {exam.durationMinutes} min</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          exam.isPublished 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {exam.isPublished ? '✓ Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/teacher/exams/${exam.id}/questions`}
                      className="btn-secondary text-sm flex items-center space-x-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Questions</span>
                    </Link>
                    <Link
                      to={`/teacher/exams/${exam.id}/results`}
                      className="btn-secondary text-sm flex items-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Results</span>
                    </Link>
                    <Link
                      to={`/teacher/exams/${exam.id}/share`}
                      className="btn-secondary text-sm flex items-center space-x-1"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </Link>
                    <button
                      onClick={() => handleTogglePublish(exam.id)}
                      className="btn-primary text-sm"
                    >
                      {exam.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleDuplicate(exam.id)}
                      className="btn-secondary text-sm flex items-center space-x-1"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Duplicate</span>
                    </button>
                    <button
                      onClick={() => handleDelete(exam.id)}
                      className="btn-danger text-sm flex items-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
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

export default ExamList
