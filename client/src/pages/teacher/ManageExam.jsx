import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Plus, Trash2, BarChart3 } from 'lucide-react';

export default function ManageExam() {
  const [exam, setExam] = useState(null);
  const [newQuestion, setNewQuestion] = useState({ question: '', type: 'multiple_choice', options: ['', '', '', ''], correctAnswer: '' });
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [stats, setStats] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadExam();
    loadStats();
  }, [id]);

  const loadExam = async () => {
    try {
      const { data } = await api.get(`/teacher/exams/${id}`);
      setExam(data.exam);
    } catch (error) {
      console.error('Failed to load exam');
    }
  };

  const loadStats = async () => {
    try {
      const { data } = await api.get(`/teacher/exams/${id}/statistics`);
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats');
    }
  };

  const addQuestion = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/teacher/exams/${id}/questions`, newQuestion);
      setNewQuestion({ question: '', type: 'multiple_choice', options: ['', '', '', ''], correctAnswer: '' });
      setShowAddQuestion(false);
      loadExam();
    } catch (error) {
      alert('Failed to add question');
    }
  };

  const deleteQuestion = async (questionId) => {
    if (!confirm('Delete this question?')) return;
    try {
      await api.delete(`/teacher/exams/${id}/questions/${questionId}`);
      loadExam();
    } catch (error) {
      alert('Failed to delete question');
    }
  };

  if (!exam) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button onClick={() => navigate('/teacher')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{exam.title}</h1>
          <p className="text-gray-600">{exam.description}</p>
          <div className="mt-4 flex gap-4 items-center">
            <span className={`px-3 py-1 rounded-full text-sm ${exam.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {exam.isPublished ? 'Published' : 'Draft'}
            </span>
            <span className="text-sm text-gray-600">Access Code: <span className="font-mono font-bold text-primary-600">{exam.accessCode}</span></span>
          </div>
        </div>

        {stats && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={20} />
              <h2 className="text-lg font-semibold">Statistics</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-sm text-gray-600">Attempts</p>
                <p className="text-2xl font-bold">{stats.totalAttempts}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Average</p>
                <p className="text-2xl font-bold">{stats.averageScore}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Highest</p>
                <p className="text-2xl font-bold text-green-600">{stats.highestScore}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Lowest</p>
                <p className="text-2xl font-bold text-red-600">{stats.lowestScore}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pass Rate</p>
                <p className="text-2xl font-bold text-blue-600">{stats.passRate}%</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Questions ({exam.questions?.length || 0})</h2>
            <button
              onClick={() => setShowAddQuestion(!showAddQuestion)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
            >
              <Plus size={20} />
              Add Question
            </button>
          </div>

          {showAddQuestion && (
            <form onSubmit={addQuestion} className="mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                  <textarea
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newQuestion.type}
                    onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="true_false">True/False</option>
                    <option value="short_answer">Short Answer</option>
                  </select>
                </div>

                {newQuestion.type === 'multiple_choice' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                    {newQuestion.options.map((opt, i) => (
                      <input
                        key={i}
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...newQuestion.options];
                          newOpts[i] = e.target.value;
                          setNewQuestion({ ...newQuestion, options: newOpts });
                        }}
                        placeholder={`Option ${i + 1}`}
                        className="w-full px-4 py-2 border rounded-lg mb-2"
                      />
                    ))}
                  </div>
                )}

                {newQuestion.type === 'true_false' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                    <div className="text-sm text-gray-600">Options will be: True, False</div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                  <input
                    type="text"
                    value={newQuestion.correctAnswer}
                    onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Enter the correct answer"
                  />
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                    Add Question
                  </button>
                  <button type="button" onClick={() => setShowAddQuestion(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {exam.questions?.map((q, index) => (
              <div key={q.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-2">
                      {index + 1}. {q.question}
                    </p>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">{q.type.replace('_', ' ')}</span>
                    <p className="text-sm text-gray-600 mt-2">Correct Answer: <span className="font-medium">{q.correctAnswer}</span></p>
                  </div>
                  <button
                    onClick={() => deleteQuestion(q.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
