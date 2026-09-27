import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, BookOpen, Home } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isTeacher, isStudent } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-teal-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                QuizForge
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to={isTeacher ? '/teacher/dashboard' : isStudent ? '/student/dashboard' : '/'}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 hover:bg-teal-50 transition-colors"
                >
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>

                <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-xl">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 text-teal-600 hover:text-teal-700 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
