import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { customersApi } from '@/services/api';
import type { CustomerDto, CreateCustomerDto } from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Modal from '@/components/common/Modal';
import { formatDate } from '@/utils/format';

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<CreateCustomerDto>({
    fullName: '',
    passportSeries: '',
    passportNumber: '',
    passportIssueDate: '',
    passportIssuedBy: '',
    registrationAddress: '',
    phoneNumber: '',
    email: '',
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchTerm, customers]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await customersApi.getAll();
      setCustomers(data);
    } catch (err) {
      console.error('Error loading customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    if (!searchTerm) {
      setFilteredCustomers(customers);
      return;
    }

    const filtered = customers.filter(
      (customer) =>
        customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phoneNumber.includes(searchTerm) ||
        customer.passportNumber.includes(searchTerm)
    );
    setFilteredCustomers(filtered);
  };

  const handleOpenModal = (customer?: CustomerDto) => {
    if (customer) {
      setEditingId(customer.id);
      setFormData({
        fullName: customer.fullName,
        passportSeries: customer.passportSeries,
        passportNumber: customer.passportNumber,
        passportIssueDate: customer.passportIssueDate.split('T')[0],
        passportIssuedBy: customer.passportIssuedBy,
        registrationAddress: customer.registrationAddress,
        phoneNumber: customer.phoneNumber,
        email: customer.email || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        fullName: '',
        passportSeries: '',
        passportNumber: '',
        passportIssueDate: '',
        passportIssuedBy: '',
        registrationAddress: '',
        phoneNumber: '+998',
        email: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await customersApi.update(editingId, formData);
      } else {
        await customersApi.create(formData);
      }
      setIsModalOpen(false);
      loadCustomers();
    } catch (err) {
      console.error('Error saving customer:', err);
      alert('Ошибка при сохранении клиента');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этого клиента?')) return;

    try {
      await customersApi.delete(id);
      loadCustomers();
    } catch (err) {
      console.error('Error deleting customer:', err);
      alert('Ошибка при удалении клиента');
    }
  };

  if (loading) return <LoadingSpinner className="h-screen" />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Клиенты</h1>
          <p className="text-sm text-gray-600 mt-1">Управление клиентами</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary flex items-center space-x-2 text-sm">
          <Plus className="w-4 h-4" />
          <span>Добавить клиента</span>
        </button>
      </div>

      <div className="card p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Поиск по имени, телефону, паспорту..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-9 text-sm"
          />
        </div>
      </div>

      <div className="card p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ФИО</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Паспорт</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Дата выдачи</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Телефон</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{customer.fullName}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{customer.passportSeries} {customer.passportNumber}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{customer.passportIssueDate}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{customer.phoneNumber}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{customer.email || '-'}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenModal(customer)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Редактировать"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Редактировать клиента' : 'Добавить клиента'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Серия паспорта *</label>
              <input
                type="text"
                value={formData.passportSeries}
                onChange={(e) => setFormData({ ...formData, passportSeries: e.target.value.toUpperCase() })}
                className="input"
                maxLength={2}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Номер паспорта *</label>
              <input
                type="text"
                value={formData.passportNumber}
                onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                className="input"
                maxLength={7}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Дата выдачи *</label>
              <input
                type="date"
                value={formData.passportIssueDate}
                onChange={(e) => setFormData({ ...formData, passportIssueDate: e.target.value })}
                className="input"
                placeholder="yyyy/MM/dd"
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

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Кем выдан *</label>
              <input
                type="text"
                value={formData.passportIssuedBy}
                onChange={(e) => setFormData({ ...formData, passportIssuedBy: e.target.value })}
                className="input"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Адрес прописки *</label>
              <textarea
                value={formData.registrationAddress}
                onChange={(e) => setFormData({ ...formData, registrationAddress: e.target.value })}
                className="input"
                rows={2}
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
              />
            </div>
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

export default Customers;
