import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../utils/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const ExamResults = () => {
  const { id } = useParams()
  const [exam, setExam] = useState(null)
  const [attempts, setAttempts] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const [examRes, attemptsRes, statsRes] = await Promise.all([
        api.get(`/teacher/exams/${id}`),
        api.get(`/teacher/exams/${id}/results`),
        api.get(`/teacher/exams/${id}/statistics`)
      ])
      setExam(examRes.data.exam)
      setAttempts(attemptsRes.data.attempts)
      setStatistics(statsRes.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
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

  const chartData = statistics?.scoreDistribution ? 
    Object.entries(statistics.scoreDistribution).map(([range, count]) => ({
      range,
      count
    })) : []

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-white mb-2">{exam?.title} - Results</h1>
        <p className="text-white/80 mb-8">Performance analytics and student submissions</p>

        {/* Statistics */}
        {statistics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bento-card p-6">
                <p className="text-gray-600 text-sm mb-1">Total Attempts</p>
                <p className="text-3xl font-bold text-gray-900">{statistics.totalAttempts}</p>
              </div>
              <div className="bento-card p-6">
                <p className="text-gray-600 text-sm mb-1">Average Score</p>
                <p className="text-3xl font-bold text-teal-600">{statistics.averageScore}%</p>
              </div>
              <div className="bento-card p-6">
                <p className="text-gray-600 text-sm mb-1">Highest Score</p>
                <p className="text-3xl font-bold text-green-600">{statistics.highestScore}%</p>
              </div>
              <div className="bento-card p-6">
                <p className="text-gray-600 text-sm mb-1">Pass Rate</p>
                <p className="text-3xl font-bold text-blue-600">{statistics.passRate}%</p>
              </div>
            </div>

            {/* Chart */}
            <div className="bento-card p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">Score Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#14b8a6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* Attempts List */}
        <div className="bento-card p-6">
          <h2 className="text-2xl font-bold mb-6">Student Submissions</h2>
          
          {attempts.length === 0 ? (
            <p className="text-center text-gray-600 py-8">No submissions yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Student</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Score</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt) => (
                    <tr key={attempt.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{attempt.user.name}</td>
                      <td className="py-3 px-4 text-gray-600">{attempt.user.email}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-lg">{attempt.score}%</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          attempt.score >= 70 ? 'bg-green-100 text-green-700' :
                          attempt.score >= 50 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {attempt.score >= 70 ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(attempt.completedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExamResults
