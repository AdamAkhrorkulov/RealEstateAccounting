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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Квартиры</h1>
          <p className="text-gray-600 mt-2">Управление квартирами</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Добавить квартиру</span>
        </button>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск по блоку, подъезду, этажу..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Блок</th>
                <th>Подъезд</th>
                <th>Этаж</th>
                <th>Комнат</th>
                <th>Площадь</th>
                <th>Цена за м²</th>
                <th>Общая цена</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredApartments.map((apartment) => (
                <tr key={apartment.id}>
                  <td className="font-medium">{apartment.block}</td>
                  <td>{apartment.entrance}</td>
                  <td>{apartment.floor}</td>
                  <td>{apartment.roomCount}</td>
                  <td>{formatArea(apartment.area)}</td>
                  <td>{formatCurrency(apartment.pricePerSquareMeter)}</td>
                  <td className="font-semibold">{formatCurrency(apartment.totalPrice)}</td>
                  <td>
                    <span className={`badge ${getApartmentStatusColor(apartment.status)}`}>
                      {getApartmentStatusName(apartment.status)}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenModal(apartment)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Редактировать"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(apartment.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Удалить"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredApartments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
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
