import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../utils/api'
import { Key, AlertCircle } from 'lucide-react'

const AccessCode = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [accessCode, setAccessCode] = useState(searchParams.get('code') || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/student/access-code', { accessCode: accessCode.replace(/-/g, '') })
      const exam = response.data.exam
      navigate(`/student/exams/${exam.id}/take`)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid access code')
    } finally {
      setLoading(false)
    }
  }

  const formatCode = (value) => {
    // Remove all non-alphanumeric characters
    const clean = value.replace(/[^A-Z0-9]/gi, '').toUpperCase()
    
    // Add dashes every 3 characters
    if (clean.length <= 3) return clean
    if (clean.length <= 6) return `${clean.slice(0, 3)}-${clean.slice(3)}`
    return `${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6, 9)}`
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bento-card p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Key className="w-16 h-16 text-teal-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Enter Access Code</h1>
            <p className="text-gray-600">Enter the 9-digit code provided by your teacher</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Code
              </label>
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(formatCode(e.target.value))}
                className="input-field text-center text-2xl font-mono tracking-wider"
                placeholder="XXX-XXX-XXX"
                maxLength={11}
                required
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Format: XXX-XXX-XXX (dashes optional)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || accessCode.replace(/-/g, '').length !== 9}
              className="w-full btn-primary disabled:opacity-50 text-lg py-3"
            >
              {loading ? 'Validating...' : 'Join Exam'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-teal-50 border border-teal-200 rounded-lg">
            <p className="text-sm text-teal-700">
              💡 <strong>Need help?</strong> Ask your teacher for the access code. It's a 9-digit code like ABC-DEF-GHI.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccessCode
