import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../utils/api'
import { Clock, AlertCircle, Send } from 'lucide-react'

const TakeExam = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [exam, setExam] = useState(null)
  const [attempt, setAttempt] = useState(null)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    startExam()
  }, [id])

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const startExam = async () => {
    try {
      const [examRes, attemptRes] = await Promise.all([
        api.get(`/student/exams/${id}`),
        api.post(`/student/exams/${id}/start`)
      ])
      
      setExam(examRes.data.exam)
      setAttempt(attemptRes.data.attempt)
      setAnswers(attemptRes.data.attempt.answers || {})
      
      // Calculate time left
      const startTime = new Date(attemptRes.data.attempt.startedAt).getTime()
      const duration = examRes.data.exam.durationMinutes * 60
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      setTimeLeft(Math.max(0, duration - elapsed))
    } catch (error) {
      console.error('Failed to start exam:', error)
      alert('Failed to start exam')
      navigate('/student/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = async (questionId, answer) => {
    const newAnswers = { ...answers, [questionId]: answer }
    setAnswers(newAnswers)
    
    // Auto-save
    try {
      await api.put(`/student/attempts/${attempt.id}/answers`, { answers: newAnswers })
    } catch (error) {
      console.error('Failed to save answer:', error)
    }
  }

  const handleSubmit = async () => {
    if (!confirm('Submit your exam? You cannot change answers after submission.')) return

    setSubmitting(true)
    try {
      const response = await api.post(`/student/attempts/${attempt.id}/submit`, { answers })
      navigate(`/student/attempts/${response.data.attempt.id}`)
    } catch (error) {
      alert('Failed to submit exam')
      setSubmitting(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
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
    <div className="min-h-screen pb-20">
      <Navbar />
      
      {/* Fixed Timer Bar */}
      <div className="sticky top-16 z-40 bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">{exam.title}</h2>
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-teal-100 text-teal-700'
          }`}>
            <Clock className="w-5 h-5" />
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {timeLeft < 300 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>Less than 5 minutes remaining!</span>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-6">
          {exam.questions.map((question, idx) => (
            <div key={question.id} className="bento-card p-6">
              <div className="flex items-start space-x-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <p className="text-lg text-gray-900 font-medium">{question.question}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {question.type === 'multiple_choice' ? 'Multiple Choice' :
                     question.type === 'true_false' ? 'True/False' : 'Short Answer'}
                  </p>
                </div>
              </div>

              <div className="space-y-2 ml-11">
                {question.type === 'multiple_choice' && question.options && (
                  <div className="space-y-2">
                    {JSON.parse(question.options || '[]').map((option, i) => (
                      <label
                        key={i}
                        className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                          answers[question.id] === option
                            ? 'border-teal-600 bg-teal-50'
                            : 'border-gray-300 hover:border-teal-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={(e) => handleAnswer(question.id, e.target.value)}
                          className="mr-3"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === 'true_false' && (
                  <div className="space-y-2">
                    {['True', 'False'].map((option) => (
                      <label
                        key={option}
                        className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                          answers[question.id] === option
                            ? 'border-teal-600 bg-teal-50'
                            : 'border-gray-300 hover:border-teal-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={(e) => handleAnswer(question.id, e.target.value)}
                          className="mr-3"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === 'short_answer' && (
                  <input
                    type="text"
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswer(question.id, e.target.value)}
                    className="input-field"
                    placeholder="Type your answer..."
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="text-gray-600">
              Answered: {Object.keys(answers).length} / {exam.questions.length}
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              <span>{submitting ? 'Submitting...' : 'Submit Exam'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TakeExam
