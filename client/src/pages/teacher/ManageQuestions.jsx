import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../utils/api'
import { Plus, Trash2, Brain, AlertCircle, Sparkles } from 'lucide-react'

const ManageQuestions = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [exam, setExam] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAI, setShowAI] = useState(false)
  const [showManual, setShowManual] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [error, setError] = useState('')

  // AI Form
  const [aiForm, setAiForm] = useState({
    topic: '',
    type: 'multiple_choice',
    count: 5,
    difficulty: 3,
  })

  // Manual Form
  const [manualForm, setManualForm] = useState({
    question: '',
    type: 'multiple_choice',
    options: ['', '', '', ''],
    correctAnswer: '',
  })

  useEffect(() => {
    fetchExamAndQuestions()
  }, [id])

  const fetchExamAndQuestions = async () => {
    try {
      const [examRes, questionsRes] = await Promise.all([
        api.get(`/teacher/exams/${id}`),
        api.get(`/teacher/exams/${id}/questions`)
      ])
      setExam(examRes.data.exam)
      setQuestions(questionsRes.data.questions)
    } catch (error) {
      setError('Failed to load exam')
    } finally {
      setLoading(false)
    }
  }

  const handleAIGenerate = async (e) => {
    e.preventDefault()
    setError('')
    setAiLoading(true)

    try {
      const response = await api.post('/teacher/questions/generate-ai', aiForm)
      const generatedQuestions = response.data.questions

      // Add all generated questions
      for (const q of generatedQuestions) {
        await api.post(`/teacher/exams/${id}/questions`, q)
      }

      await fetchExamAndQuestions()
      setShowAI(false)
      setAiForm({ topic: '', type: 'multiple_choice', count: 5, difficulty: 3 })
      alert(`Successfully generated ${generatedQuestions.length} questions!`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate questions')
    } finally {
      setAiLoading(false)
    }
  }

  const handleManualAdd = async (e) => {
    e.preventDefault()
    setError('')

    try {
      // Prepare the question data
      const questionData = {
        question: manualForm.question,
        type: manualForm.type,
        correctAnswer: manualForm.correctAnswer,
        points: 1
      }

      // Add options based on question type
      if (manualForm.type === 'multiple_choice') {
        questionData.options = manualForm.options.filter(opt => opt.trim() !== '')
      } else if (manualForm.type === 'true_false') {
        questionData.options = ['True', 'False']
      } else {
        questionData.options = null
      }

      console.log('Sending question data:', questionData)

      await api.post(`/teacher/exams/${id}/questions`, questionData)
      await fetchExamAndQuestions()
      setShowManual(false)
      setManualForm({
        question: '',
        type: 'multiple_choice',
        options: ['', '', '', ''],
        correctAnswer: '',
      })
      alert('Question added successfully!')
    } catch (err) {
      console.error('Error adding question:', err.response?.data)
      setError(err.response?.data?.message || err.message || 'Failed to add question')
    }
  }

  const handleDelete = async (questionId) => {
    if (!confirm('Delete this question?')) return

    try {
      await api.delete(`/teacher/exams/${id}/questions/${questionId}`)
      setQuestions(questions.filter(q => q.id !== questionId))
    } catch (error) {
      alert('Failed to delete question')
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
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{exam?.title}</h1>
            <p className="text-white/80">{questions.length} questions</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAI(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>AI Generate</span>
            </button>
            <button
              onClick={() => setShowManual(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Manually</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* AI Generation Modal */}
        {showAI && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bento-card p-8 w-full max-w-2xl max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">AI Question Generation</h2>
              
              <form onSubmit={handleAIGenerate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic / Subject *
                  </label>
                  <input
                    type="text"
                    value={aiForm.topic}
                    onChange={(e) => setAiForm({...aiForm, topic: e.target.value})}
                    className="input-field"
                    placeholder="e.g., JavaScript Arrays, World War 2, Photosynthesis"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Type *
                  </label>
                  <select
                    value={aiForm.type}
                    onChange={(e) => setAiForm({...aiForm, type: e.target.value})}
                    className="input-field"
                  >
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="true_false">True/False</option>
                    <option value="short_answer">Short Answer</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Questions *
                    </label>
                    <input
                      type="number"
                      value={aiForm.count}
                      onChange={(e) => setAiForm({...aiForm, count: parseInt(e.target.value)})}
                      className="input-field"
                      min="1"
                      max="20"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty (1-5) *
                    </label>
                    <input
                      type="number"
                      value={aiForm.difficulty}
                      onChange={(e) => setAiForm({...aiForm, difficulty: parseInt(e.target.value)})}
                      className="input-field"
                      min="1"
                      max="5"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAI(false)}
                    className="btn-secondary"
                    disabled={aiLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={aiLoading}
                    className="btn-primary disabled:opacity-50"
                  >
                    {aiLoading ? 'Generating...' : 'Generate Questions'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Manual Add Modal */}
        {showManual && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bento-card p-8 w-full max-w-2xl max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Add Question</h2>
              
              <form onSubmit={handleManualAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question *
                  </label>
                  <textarea
                    value={manualForm.question}
                    onChange={(e) => setManualForm({...manualForm, question: e.target.value})}
                    className="input-field"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    value={manualForm.type}
                    onChange={(e) => setManualForm({...manualForm, type: e.target.value})}
                    className="input-field"
                  >
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="true_false">True/False</option>
                    <option value="short_answer">Short Answer</option>
                  </select>
                </div>

                {manualForm.type === 'multiple_choice' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Options *
                    </label>
                    {manualForm.options.map((opt, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...manualForm.options]
                          newOpts[idx] = e.target.value
                          setManualForm({...manualForm, options: newOpts})
                        }}
                        className="input-field mb-2"
                        placeholder={`Option ${idx + 1}`}
                        required
                      />
                    ))}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correct Answer *
                  </label>
                  <input
                    type="text"
                    value={manualForm.correctAnswer}
                    onChange={(e) => setManualForm({...manualForm, correctAnswer: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowManual(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Add Question
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="bento-card p-6">
          {questions.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg mb-4">No questions yet</p>
              <p className="mb-6">Add questions manually or generate them with AI</p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-6 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-lg font-bold text-teal-600">Q{idx + 1}</span>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">{q.type.replace('_', ' ')}</span>
                      </div>
                      <p className="text-gray-900 font-medium mb-3">{q.question}</p>
                      
                      {q.options && (
                        <div className="space-y-1 mb-3">
                          {JSON.parse(q.options || '[]').map((opt, i) => (
                            <div key={i} className="text-sm text-gray-600">
                              {String.fromCharCode(65 + i)}. {opt}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="text-sm text-green-700">
                        ✓ Correct: {q.correctAnswer}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => navigate('/teacher/exams')}
            className="btn-primary"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

export default ManageQuestions
