import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../utils/api'
import { Copy, RefreshCw, Share2, Check } from 'lucide-react'

const ShareExam = () => {
  const { id } = useParams()
  const [exam, setExam] = useState(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExam()
  }, [id])

  const fetchExam = async () => {
    try {
      const response = await api.get(`/teacher/exams/${id}`)
      setExam(response.data.exam)
    } catch (error) {
      console.error('Failed to fetch exam:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatAccessCode = (code) => {
    if (!code || code.length !== 9) return code
    return `${code.slice(0, 3)}-${code.slice(3, 6)}-${code.slice(6, 9)}`
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRegenerateCode = async () => {
    if (!confirm('Regenerate access code? The old code will stop working.')) return

    try {
      const response = await api.post(`/teacher/exams/${id}/regenerate-code`)
      setExam(response.data.exam)
      alert('Access code regenerated!')
    } catch (error) {
      alert('Failed to regenerate code')
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

  const shareUrl = `${window.location.origin}/student/access-code?code=${exam?.accessCode}`

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-3 mb-8">
          <Share2 className="w-10 h-10 text-white" />
          <div>
            <h1 className="text-4xl font-bold text-white">{exam?.title}</h1>
            <p className="text-white/80">Share this exam with students</p>
          </div>
        </div>

        {/* Access Code Card */}
        <div className="bento-card p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Code</h2>
          <p className="text-gray-600 mb-6">Students can use this code to join the exam</p>
          
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-8 text-center mb-6">
            <p className="text-white/80 text-sm mb-2">Access Code</p>
            <p className="text-5xl font-bold text-white tracking-wider font-mono">
              {formatAccessCode(exam?.accessCode)}
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => copyToClipboard(exam?.accessCode)}
              className="flex-1 btn-primary flex items-center justify-center space-x-2"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
            <button
              onClick={handleRegenerateCode}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Regenerate</span>
            </button>
          </div>
        </div>

        {/* Share Link Card */}
        <div className="bento-card p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Direct Link</h2>
          <p className="text-gray-600 mb-6">Or share this direct link</p>
          
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="input-field flex-1"
            />
            <button
              onClick={() => copyToClipboard(shareUrl)}
              className="btn-primary flex items-center space-x-2"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bento-card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How Students Join</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>Student logs in to QuizForge</li>
            <li>Goes to "Enter Access Code" page</li>
            <li>Enters the code: <code className="bg-gray-100 px-2 py-1 rounded">{formatAccessCode(exam?.accessCode)}</code></li>
            <li>Clicks "Join Exam" and starts taking the test</li>
          </ol>
          
          <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
            <p className="text-sm text-teal-700">
              💡 <strong>Tip:</strong> Make sure the exam is published before sharing!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShareExam
