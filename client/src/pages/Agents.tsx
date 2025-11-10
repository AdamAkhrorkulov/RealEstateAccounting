import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { agentsApi } from '@/services/api';
import type { AgentDto, CreateAgentDto } from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Modal from '@/components/common/Modal';
import { formatCurrency } from '@/utils/format';

const Agents: React.FC = () => {
  const [agents, setAgents] = useState<AgentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateAgentDto>({
    fullName: '',
    phoneNumber: '+998',
    email: '',
    commissionPercentage: 0,
  });

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const data = await agentsApi.getAll();
      setAgents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (agent?: AgentDto) => {
    if (agent) {
      setEditingId(agent.id);
      setFormData({
        fullName: agent.fullName,
        phoneNumber: agent.phoneNumber,
        email: agent.email || '',
        commissionPercentage: agent.commissionPercentage,
      });
    } else {
      setEditingId(null);
      setFormData({
        fullName: '',
        phoneNumber: '+998',
        email: '',
        commissionPercentage: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await agentsApi.update(editingId, formData);
      } else {
        await agentsApi.create(formData);
      }
      setIsModalOpen(false);
      loadAgents();
    } catch (err) {
      alert('Ошибка при сохранении агента');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить агента?')) return;
    try {
      await agentsApi.delete(id);
      loadAgents();
    } catch (err) {
      alert('Ошибка при удалении');
    }
  };

  if (loading) return <LoadingSpinner className="h-screen" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Агенты</h1>
          <p className="text-gray-600 mt-2">Управление агентами</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Добавить агента</span>
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ФИО</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Комиссия (%)</th>
                <th>Всего продаж</th>
                <th>Всего комиссий</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id}>
                  <td className="font-medium">{agent.fullName}</td>
                  <td>{agent.phoneNumber}</td>
                  <td>{agent.email || '-'}</td>
                  <td>{agent.commissionPercentage}%</td>
                  <td>{agent.totalSales}</td>
                  <td className="font-semibold">{formatCurrency(agent.totalCommissionEarned)}</td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handleOpenModal(agent)} className="text-blue-600 hover:text-blue-800">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(agent.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Редактировать агента' : 'Добавить агента'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ФИО *</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Телефон *</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Процент комиссии *</label>
            <input
              type="number"
              step="0.1"
              value={formData.commissionPercentage || ''}
              onChange={(e) => setFormData({ ...formData, commissionPercentage: Number(e.target.value) || 0 })}
              className="input"
              min="0"
              max="100"
              required
              placeholder="0"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Agents;
