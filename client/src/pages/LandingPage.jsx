import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BookOpen, Brain, Trophy, Zap, Sparkles } from 'lucide-react'

const LandingPage = () => {
  const { isAuthenticated, isTeacher, isStudent } = useAuth()

  const dashboardLink = isTeacher ? '/teacher/dashboard' : '/student/dashboard'

  const features = [
    {
      icon: Brain,
      title: 'AI Generation',
      description: 'Generate quiz questions instantly with AI'
    },
    {
      icon: Zap,
      title: 'Auto-Grading',
      description: 'Instant feedback with automatic grading'
    },
    {
      icon: Trophy,
      title: 'Leaderboards',
      description: 'Real-time leaderboards and rankings'
    },
    {
      icon: BookOpen,
      title: 'Easy Sharing',
      description: 'Share exams with simple access codes'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="glass-nav fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-teal-600" />
              <span className="text-2xl font-bold text-charcoal-900">QuizForge</span>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link
                  to={dashboardLink}
                  className="btn-primary"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-charcoal-700 hover:text-teal-600 font-medium transition-colors px-4 py-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-charcoal-900 mb-6">
            Create & Share Quizzes
            <br />
            <span className="bg-gradient-to-r from-teal-600 to-coral-500 bg-clip-text text-transparent">
              Powered by AI
            </span>
          </h1>
          <p className="text-xl text-charcoal-600 mb-8 max-w-2xl mx-auto">
            Generate intelligent quiz questions instantly, auto-grade submissions, and track performance with beautiful analytics.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="btn-primary px-8 py-4 text-lg">
              Start Free
            </Link>
            <Link to="/login" className="btn-secondary px-8 py-4 text-lg">
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {features.map((feature, index) => (
            <div key={index} className="bento-card p-6 text-center hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-teal-100 rounded-bento flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-charcoal-900">{feature.title}</h3>
              <p className="text-charcoal-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Quizzes?
          </h2>
          <p className="text-teal-50 text-lg mb-8">
            Join thousands of teachers and students using AI-powered assessments
          </p>
          <Link to="/register" className="bg-white text-teal-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-bento transition-all inline-block">
            Get Started for Free
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
