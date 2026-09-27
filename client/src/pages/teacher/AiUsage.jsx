import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Brain, TrendingUp, DollarSign, Zap, Calendar } from 'lucide-react';

const AiUsage = () => {
  const [usage, setUsage] = useState({
    usages: [],
    totalCost: 0,
    totalTokens: 0,
    todayCost: 0,
    dailyBudget: 5.0,
    remainingBudget: 5.0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      const response = await api.get('/teacher/ai-usage');
      setUsage(response.data);
    } catch (error) {
      console.error('Failed to fetch AI usage:', error);
      alert('Failed to load AI usage data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const budgetPercentage = (parseFloat(usage.todayCost) / parseFloat(usage.dailyBudget)) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Usage Tracking</h1>
        <p className="text-gray-600 mt-2">Monitor your AI question generation usage and costs</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bento-card p-6">
          <div className="flex items-center justify-between mb-4">
            <Brain className="h-10 w-10 text-teal-600" />
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Requests</p>
          <p className="text-3xl font-bold text-gray-900">{usage.usages.length}</p>
        </div>

        <div className="bento-card p-6">
          <div className="flex items-center justify-between mb-4">
            <Zap className="h-10 w-10 text-amber-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Tokens</p>
          <p className="text-3xl font-bold text-gray-900">
            {usage.totalTokens.toLocaleString()}
          </p>
        </div>

        <div className="bento-card p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-10 w-10 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Cost</p>
          <p className="text-3xl font-bold text-gray-900">${usage.totalCost}</p>
        </div>

        <div className="bento-card p-6">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-10 w-10 text-purple-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Today's Cost</p>
          <p className="text-3xl font-bold text-gray-900">${usage.todayCost}</p>
        </div>
      </div>

      {/* Daily Budget Progress */}
      <div className="bento-card p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Daily Budget</h2>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              ${usage.todayCost} of ${usage.dailyBudget} used
            </span>
            <span className="text-sm font-semibold text-teal-600">
              ${usage.remainingBudget} remaining
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                budgetPercentage > 90
                  ? 'bg-red-600'
                  : budgetPercentage > 75
                  ? 'bg-amber-600'
                  : 'bg-teal-600'
              }`}
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            />
          </div>
        </div>
        {budgetPercentage > 90 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">
              ⚠️ Warning: You've used over 90% of your daily AI budget!
            </p>
          </div>
        )}
      </div>

      {/* Usage History */}
      <div className="bento-card p-6">
        <h2 className="text-xl font-bold mb-6">Usage History</h2>

        {usage.usages.length === 0 ? (
          <div className="text-center py-12">
            <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No AI usage yet. Generate some questions to see your usage history!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date & Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Provider</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Model</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Tokens</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Cost</th>
                </tr>
              </thead>
              <tbody>
                {usage.usages.map((record) => (
                  <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatDate(record.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="badge-primary capitalize">{record.provider}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{record.model}</td>
                    <td className="py-3 px-4 text-sm text-right text-gray-700">
                      <div className="space-y-1">
                        <div>
                          <span className="text-xs text-gray-500">Prompt:</span>{' '}
                          {record.promptTokens.toLocaleString()}
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Completion:</span>{' '}
                          {record.completionTokens.toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">
                      ${parseFloat(record.cost).toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiUsage;
