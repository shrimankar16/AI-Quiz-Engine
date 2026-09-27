import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../utils/api'
import { Trophy, CheckCircle, XCircle, Home } from 'lucide-react'

const ExamResults = () => {
  const { id } = useParams()
  const [attempt, setAttempt] = useState(null)
  const [performance, setPerformance] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResults()
  }, [id])

  const fetchResults = async () => {
    try {
      const response = await api.get(`/student/attempts/${id}`)
      setAttempt(response.data.attempt)
      setPerformance(response.data.performance)
    } catch (error) {
      console.error('Failed to fetch results:', error)
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

  const results = JSON.parse(attempt.results || '[]')
  const correctCount = results.filter(r => r.isCorrect).length

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Score Card */}
        <div className="bento-card p-8 mb-8 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-teal-600" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{attempt.exam.title}</h1>
          <div className="text-6xl font-bold text-teal-600 mb-4">{attempt.score}%</div>
          
          <div className={`inline-block px-6 py-3 rounded-lg text-lg font-semibold ${
            performance.color === 'green' ? 'bg-green-100 text-green-700' :
            performance.color === 'amber' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {performance.level}
          </div>
          
          <p className="text-gray-600 mt-4">{performance.message}</p>
          
          <div className="flex justify-center space-x-8 mt-6 text-gray-600">
            <div>
              <div className="text-2xl font-bold text-gray-900">{correctCount}</div>
              <div className="text-sm">Correct</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{results.length - correctCount}</div>
              <div className="text-sm">Incorrect</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{results.length}</div>
              <div className="text-sm">Total</div>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bento-card p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Question Review</h2>
          
          <div className="space-y-6">
            {results.map((result, idx) => (
              <div key={result.questionId} className={`p-6 rounded-lg border-2 ${
                result.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-start space-x-3 mb-3">
                  {result.isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900">Question {idx + 1}</span>
                      <span className={`px-3 py-1 rounded text-sm font-medium ${
                        result.isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                      }`}>
                        {result.isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    <p className="text-gray-900 mb-3">{result.question}</p>
                    
                    {result.options && (
                      <div className="space-y-1 mb-3 ml-4">
                        {JSON.parse(result.options || '[]').map((opt, i) => (
                          <div key={i} className={`text-sm ${
                            opt === result.correctAnswer ? 'font-bold text-green-700' :
                            opt === result.studentAnswer && !result.isCorrect ? 'font-bold text-red-700' :
                            'text-gray-600'
                          }`}>
                            {String.fromCharCode(65 + i)}. {opt}
                            {opt === result.correctAnswer && ' ✓'}
                            {opt === result.studentAnswer && !result.isCorrect && ' ✗'}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-sm space-y-1">
                      <div>
                        <span className="text-gray-600">Your answer: </span>
                        <span className={result.isCorrect ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                          {result.studentAnswer || '(No answer)'}
                        </span>
                      </div>
                      {!result.isCorrect && (
                        <div>
                          <span className="text-gray-600">Correct answer: </span>
                          <span className="text-green-700 font-medium">{result.correctAnswer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <Link to="/student/dashboard" className="btn-primary flex items-center space-x-2">
            <Home className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>
          {attempt.exam.leaderboardEnabled && (
            <Link
              to={`/student/exams/${attempt.examId}/leaderboard`}
              className="btn-secondary"
            >
              View Leaderboard
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExamResults
