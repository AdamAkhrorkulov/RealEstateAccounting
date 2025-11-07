import React, { useEffect, useState } from 'react';
import {
  Building2,
  DollarSign,
  FileText,
  TrendingUp,
  AlertTriangle,
  Users,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { dashboardApi } from '@/services/api';
import type { DashboardDto } from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatCurrency } from '@/utils/format';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      console.log('Dashboard: Fetching dashboard stats...');

      const result = await dashboardApi.getStats();
      console.log('Dashboard: Data loaded successfully:', result);
      setData(result);
    } catch (err: any) {
      console.error('Dashboard: Error loading data:', err);
      console.error('Dashboard: Error response:', err.response);
      setError(err.response?.data?.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner className="h-screen" />;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        <h2 className="text-2xl font-bold mb-4">Ошибка загрузки данных</h2>
        <p className="mb-4">{error}</p>
        <button onClick={loadDashboardData} className="btn btn-primary">
          Попробовать снова
        </button>
      </div>
    );
  }

  if (!data || !data.stats) {
    return (
      <div className="text-center text-gray-600 p-8">
        <h2 className="text-2xl font-bold mb-4">Нет данных</h2>
        <p className="mb-4">Не удалось загрузить данные панели управления</p>
        <button onClick={loadDashboardData} className="btn btn-primary">
          Обновить
        </button>
      </div>
    );
  }

  const { stats, revenueData, topAgents } = data;

  const statCards = [
    {
      title: 'Всего квартир',
      value: stats.totalApartments,
      subtitle: `Доступно: ${stats.availableApartments} | Продано: ${stats.soldApartments}`,
      icon: Building2,
      color: 'bg-blue-500',
    },
    {
      title: 'Общий доход',
      value: formatCurrency(stats.totalRevenue),
      subtitle: `Получено: ${formatCurrency(stats.receivedRevenue)}`,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Активных договоров',
      value: stats.activeContracts,
      subtitle: `Завершено: ${stats.completedContracts}`,
      icon: FileText,
      color: 'bg-purple-500',
    },
    {
      title: 'Просроченные платежи',
      value: formatCurrency(stats.overdueAmount),
      subtitle: `Договоров просрочено: ${stats.overdueContracts}`,
      icon: AlertTriangle,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Панель управления</h1>
        <p className="text-gray-600 mt-2">Обзор статистики и аналитики</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
                <p className="text-xs text-gray-500 mt-2">{card.subtitle}</p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Динамика доходов</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Доход"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Agents */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Топ агенты</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topAgents}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="agentName" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="totalCommission" name="Комиссия" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Всего клиентов</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Всего агентов</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAgents}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Ожидается платежей</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.pendingRevenue)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
