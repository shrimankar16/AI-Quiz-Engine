import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../utils/api'
import { Trophy, Medal, Award } from 'lucide-react'

const Leaderboard = () => {
  const { id } = useParams()
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [id])

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get(`/student/exams/${id}/leaderboard`)
      setLeaderboard(response.data.leaderboard)
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMedalIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />
    return <span className="text-lg font-bold text-gray-600">#{rank}</span>
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
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-teal-600" />
          <h1 className="text-4xl font-bold text-white mb-2">Leaderboard</h1>
          <p className="text-white/80">Top performers</p>
        </div>

        <div className="bento-card p-6">
          {leaderboard.length === 0 ? (
            <p className="text-center text-gray-600 py-8">No submissions yet</p>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={`flex items-center justify-between p-4 rounded-lg transition ${
                    entry.isCurrentUser
                      ? 'bg-teal-50 border-2 border-teal-600'
                      : entry.rank <= 3
                      ? 'bg-gradient-to-r from-gray-50 to-white'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-12 text-center">
                      {getMedalIcon(entry.rank)}
                    </div>
                    <div>
                      <p className={`font-semibold ${
                        entry.isCurrentUser ? 'text-teal-700' : 'text-gray-900'
                      }`}>
                        {entry.userName}
                        {entry.isCurrentUser && ' (You)'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(entry.completedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-teal-600">{entry.score}%</p>
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

export default Leaderboard
