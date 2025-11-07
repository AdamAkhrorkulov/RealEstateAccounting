import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { apartmentsApi } from '@/services/api';
import type { ApartmentDto, CreateApartmentDto } from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Modal from '@/components/common/Modal';
import { formatCurrency, formatArea, getApartmentStatusName, getApartmentStatusColor } from '@/utils/format';

const Apartments: React.FC = () => {
  const [apartments, setApartments] = useState<ApartmentDto[]>([]);
  const [filteredApartments, setFilteredApartments] = useState<ApartmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<CreateApartmentDto>({
    block: '',
    entrance: 1,
    floor: 1,
    roomCount: 1,
    area: 0,
    pricePerSquareMeter: 0,
  });

  useEffect(() => {
    loadApartments();
  }, []);

  useEffect(() => {
    filterApartments();
  }, [searchTerm, apartments]);

  const loadApartments = async () => {
    try {
      setLoading(true);
      const data = await apartmentsApi.getAll();
      setApartments(data);
    } catch (err) {
      console.error('Error loading apartments:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterApartments = () => {
    if (!searchTerm) {
      setFilteredApartments(apartments);
      return;
    }

    const filtered = apartments.filter(
      (apt) =>
        apt.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.entrance.toString().includes(searchTerm) ||
        apt.floor.toString().includes(searchTerm)
    );
    setFilteredApartments(filtered);
  };

  const handleOpenModal = (apartment?: ApartmentDto) => {
    if (apartment) {
      setEditingId(apartment.id);
      setFormData({
        block: apartment.block,
        entrance: apartment.entrance,
        floor: apartment.floor,
        roomCount: apartment.roomCount,
        area: apartment.area,
        pricePerSquareMeter: apartment.pricePerSquareMeter,
      });
    } else {
      setEditingId(null);
      setFormData({
        block: '',
        entrance: 1,
        floor: 1,
        roomCount: 1,
        area: 0,
        pricePerSquareMeter: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apartmentsApi.update(editingId, formData);
      } else {
        await apartmentsApi.create(formData);
      }
      handleCloseModal();
      loadApartments();
    } catch (err) {
      console.error('Error saving apartment:', err);
      alert('Ошибка при сохранении квартиры');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту квартиру?')) return;

    try {
      await apartmentsApi.delete(id);
      loadApartments();
    } catch (err) {
      console.error('Error deleting apartment:', err);
      alert('Ошибка при удалении квартиры');
    }
  };

  if (loading) {
    return <LoadingSpinner className="h-screen" />;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Квартиры</h1>
          <p className="text-sm text-gray-600 mt-1">Управление квартирами</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary flex items-center space-x-2 text-sm">
          <Plus className="w-4 h-4" />
          <span>Добавить квартиру</span>
        </button>
      </div>

      {/* Search */}
      <div className="card p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Поиск по блоку, подъезду, этажу..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-9 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Блок</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Подъезд</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Этаж</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Комнат</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Площадь</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Цена за м²</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Общая цена</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Статус</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApartments.map((apartment) => (
                <tr key={apartment.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{apartment.block}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{apartment.entrance}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{apartment.floor}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{apartment.roomCount}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{formatArea(apartment.area)}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{formatCurrency(apartment.pricePerSquareMeter)}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-semibold text-gray-900">{formatCurrency(apartment.totalPrice)}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getApartmentStatusColor(apartment.status)}`}>
                      {getApartmentStatusName(apartment.status)}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenModal(apartment)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Редактировать"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(apartment.id)}
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

          {filteredApartments.length === 0 && (
            <div className="text-center py-8 text-sm text-gray-500">
              Квартиры не найдены
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? 'Редактировать квартиру' : 'Добавить квартиру'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Блок *
              </label>
              <input
                type="text"
                value={formData.block}
                onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Подъезд *
              </label>
              <input
                type="number"
                value={formData.entrance}
                onChange={(e) => setFormData({ ...formData, entrance: Number(e.target.value) })}
                className="input"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Этаж *
              </label>
              <input
                type="number"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                className="input"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Количество комнат *
              </label>
              <input
                type="number"
                value={formData.roomCount}
                onChange={(e) => setFormData({ ...formData, roomCount: Number(e.target.value) })}
                className="input"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Площадь (м²) *
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                className="input"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Цена за м² *
              </label>
              <input
                type="number"
                value={formData.pricePerSquareMeter}
                onChange={(e) =>
                  setFormData({ ...formData, pricePerSquareMeter: Number(e.target.value) })
                }
                className="input"
                min="0"
                required
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Общая цена:</span>{' '}
              {formatCurrency(formData.area * formData.pricePerSquareMeter)}
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
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

export default Apartments;
