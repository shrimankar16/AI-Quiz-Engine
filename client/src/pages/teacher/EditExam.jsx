import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../utils/api'
import { AlertCircle } from 'lucide-react'

const EditExam = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    durationMinutes: 60,
    passingScore: 70,
    leaderboardEnabled: false,
    shuffleQuestions: false,
  })

  useEffect(() => {
    fetchExam()
  }, [id])

  const fetchExam = async () => {
    try {
      const response = await api.get(`/teacher/exams/${id}`)
      const exam = response.data.exam
      setFormData({
        title: exam.title,
        description: exam.description || '',
        durationMinutes: exam.durationMinutes,
        passingScore: exam.passingScore,
        leaderboardEnabled: exam.leaderboardEnabled,
        shuffleQuestions: exam.shuffleQuestions,
      })
    } catch (error) {
      setError('Failed to load exam')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      await api.put(`/teacher/exams/${id}`, formData)
      navigate('/teacher/exams')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update exam')
    } finally {
      setSaving(false)
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

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Edit Exam</h1>

        <div className="bento-card p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  name="durationMinutes"
                  value={formData.durationMinutes}
                  onChange={handleChange}
                  className="input-field"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passing Score (%) *
                </label>
                <input
                  type="number"
                  name="passingScore"
                  value={formData.passingScore}
                  onChange={handleChange}
                  className="input-field"
                  min="0"
                  max="100"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="leaderboardEnabled"
                  id="leaderboardEnabled"
                  checked={formData.leaderboardEnabled}
                  onChange={handleChange}
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <label htmlFor="leaderboardEnabled" className="ml-2 text-sm text-gray-700">
                  Enable leaderboard
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="shuffleQuestions"
                  id="shuffleQuestions"
                  checked={formData.shuffleQuestions}
                  onChange={handleChange}
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <label htmlFor="shuffleQuestions" className="ml-2 text-sm text-gray-700">
                  Shuffle questions
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/teacher/exams')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditExam
