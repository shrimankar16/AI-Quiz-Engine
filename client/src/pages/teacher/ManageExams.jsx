import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Search,
  Filter,
  BarChart3,
  Users,
} from 'lucide-react';

const ManageExams = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, published, draft

  useEffect(() => {
    fetchExams();
  }, [filterStatus]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus !== 'all') {
        params.published = filterStatus === 'published';
      }
      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await api.get('/teacher/exams', { params });
      setExams(response.data.exams);
    } catch (error) {
      console.error('Failed to fetch exams:', error);
      alert('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchExams();
  };

  const handleDelete = async (examId) => {
    if (!window.confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/teacher/exams/${examId}`);
      setExams(exams.filter(e => e.id !== examId));
      alert('Exam deleted successfully');
    } catch (error) {
      console.error('Failed to delete exam:', error);
      alert('Failed to delete exam');
    }
  };

  const handleTogglePublish = async (examId, currentStatus) => {
    try {
      await api.post(`/teacher/exams/${examId}/publish`);
      setExams(exams.map(e =>
        e.id === examId ? { ...e, isPublished: !currentStatus } : e
      ));
      alert(`Exam ${!currentStatus ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      console.error('Failed to toggle publish status:', error);
      alert('Failed to update exam status');
    }
  };

  const handleDuplicate = async (examId) => {
    try {
      const response = await api.post(`/teacher/exams/${examId}/duplicate`);
      setExams([response.data.exam, ...exams]);
      alert('Exam duplicated successfully');
    } catch (error) {
      console.error('Failed to duplicate exam:', error);
      alert('Failed to duplicate exam');
    }
  };

  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (exam.description && exam.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Exams</h1>
          <p className="text-gray-600 mt-2">View, edit, and organize your exams</p>
        </div>
        <Link to="/teacher/exams/create" className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Create New Exam
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bento-card p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search exams by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="input-field pl-10 w-full"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Exams</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <button onClick={handleSearch} className="btn-secondary">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Exams Grid */}
      {filteredExams.length === 0 ? (
        <div className="bento-card p-12 text-center">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No exams found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Try adjusting your search terms' : 'Create your first exam to get started'}
          </p>
          <Link to="/teacher/exams/create" className="btn-primary inline-flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Create Exam
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredExams.map((exam) => (
            <div key={exam.id} className="bento-card p-6 hover:shadow-lg transition-all">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{exam.title}</h3>
                  {exam.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{exam.description}</p>
                  )}
                </div>
                {exam.isPublished ? (
                  <span className="badge-success">Published</span>
                ) : (
                  <span className="badge-warning">Draft</span>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">{exam._count.questions}</div>
                  <div className="text-xs text-gray-600">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{exam._count.attempts}</div>
                  <div className="text-xs text-gray-600">Attempts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{exam.durationMinutes}</div>
                  <div className="text-xs text-gray-600">Minutes</div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to={`/teacher/exams/${exam.id}/questions`}
                  className="btn-primary flex items-center justify-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Manage
                </Link>
                <Link
                  to={`/teacher/exams/${exam.id}/results`}
                  className="btn-secondary flex items-center justify-center"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Results
                </Link>
              </div>

              {/* More Actions */}
              <div className="mt-3 flex items-center justify-between text-sm">
                <button
                  onClick={() => handleTogglePublish(exam.id, exam.isPublished)}
                  className="text-teal-600 hover:text-teal-700 flex items-center"
                >
                  {exam.isPublished ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-1" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      Publish
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDuplicate(exam.id)}
                  className="text-purple-600 hover:text-purple-700 flex items-center"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Duplicate
                </button>
                <button
                  onClick={() => handleDelete(exam.id)}
                  className="text-red-600 hover:text-red-700 flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageExams;
