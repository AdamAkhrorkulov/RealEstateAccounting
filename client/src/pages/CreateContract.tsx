import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { contractsApi, apartmentsApi, customersApi, agentsApi } from '@/services/api';
import type { CreateContractDto, ApartmentDto, CustomerDto, AgentDto } from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatCurrency } from '@/utils/format';

const CreateContract: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Dropdowns data
  const [apartments, setApartments] = useState<ApartmentDto[]>([]);
  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [agents, setAgents] = useState<AgentDto[]>([]);

  // Form data
  const [formData, setFormData] = useState<CreateContractDto>({
    contractNumber: '',
    contractDate: new Date().toISOString().split('T')[0],
    customerId: 0,
    apartmentId: 0,
    agentId: 0,
    downPayment: 0,
    durationMonths: 12,
  });

  // Calculated values
  const [selectedApartment, setSelectedApartment] = useState<ApartmentDto | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    calculatePayments();
  }, [formData.apartmentId, formData.downPayment, formData.durationMonths]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [apartmentsData, customersData, agentsData] = await Promise.all([
        apartmentsApi.getAvailable(),
        customersApi.getAll(),
        agentsApi.getAll(),
      ]);
      setApartments(apartmentsData);
      setCustomers(customersData);
      setAgents(agentsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const calculatePayments = () => {
    if (formData.apartmentId > 0) {
      const apartment = apartments.find((a) => a.id === formData.apartmentId);
      if (apartment) {
        setSelectedApartment(apartment);
        const total = apartment.totalPrice;
        const remaining = total - formData.downPayment;
        const monthly = formData.durationMonths > 0 ? remaining / formData.durationMonths : 0;

        setTotalAmount(total);
        setRemainingAmount(remaining);
        setMonthlyPayment(monthly);
      }
    } else {
      setSelectedApartment(null);
      setTotalAmount(0);
      setRemainingAmount(0);
      setMonthlyPayment(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.contractNumber) {
      setError('Введите номер договора');
      return;
    }
    if (formData.customerId === 0) {
      setError('Выберите клиента');
      return;
    }
    if (formData.apartmentId === 0) {
      setError('Выберите квартиру');
      return;
    }
    if (formData.agentId === 0) {
      setError('Выберите агента');
      return;
    }
    if (formData.downPayment < 0) {
      setError('Первоначальный взнос не может быть отрицательным');
      return;
    }
    if (formData.downPayment > totalAmount) {
      setError('Первоначальный взнос не может превышать общую сумму');
      return;
    }
    if (formData.durationMonths < 1) {
      setError('Срок должен быть минимум 1 месяц');
      return;
    }

    try {
      setSubmitting(true);
      await contractsApi.create(formData);
      navigate('/contracts');
    } catch (err: any) {
      console.error('Error creating contract:', err);
      setError(err.response?.data?.message || 'Ошибка при создании договора');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner className="h-screen" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/contracts')}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Создать договор</h1>
          <p className="text-gray-600 mt-2">Заполните все поля для создания нового договора</p>
        </div>
      </div>

      {/* Form */}
      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contract Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Номер договора *
              </label>
              <input
                type="text"
                value={formData.contractNumber}
                onChange={(e) =>
                  setFormData({ ...formData, contractNumber: e.target.value })
                }
                className="input"
                placeholder="RE-2025-001"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Пример: RE-2025-001</p>
            </div>

            {/* Contract Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата договора *
              </label>
              <input
                type="date"
                value={formData.contractDate}
                onChange={(e) =>
                  setFormData({ ...formData, contractDate: e.target.value })
                }
                className="input"
                required
              />
            </div>

            {/* Customer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Клиент *
              </label>
              <select
                value={formData.customerId}
                onChange={(e) =>
                  setFormData({ ...formData, customerId: Number(e.target.value) })
                }
                className="input"
                required
              >
                <option value={0}>Выберите клиента</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.fullName} - {customer.passportSeries} {customer.passportNumber}
                  </option>
                ))}
              </select>
              {customers.length === 0 && (
                <p className="text-xs text-orange-600 mt-1">
                  Нет клиентов. Сначала создайте клиента.
                </p>
              )}
            </div>

            {/* Apartment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Квартира *
              </label>
              <select
                value={formData.apartmentId}
                onChange={(e) =>
                  setFormData({ ...formData, apartmentId: Number(e.target.value) })
                }
                className="input"
                required
              >
                <option value={0}>Выберите квартиру</option>
                {apartments.map((apt) => (
                  <option key={apt.id} value={apt.id}>
                    № {apt.apartmentNumber} - Блок {apt.block}, Подъезд {apt.entrance}, Этаж {apt.floor} -{' '}
                    {apt.roomCount}-комн. ({apt.area} м²) - {formatCurrency(apt.totalPrice)}
                  </option>
                ))}
              </select>
              {apartments.length === 0 && (
                <p className="text-xs text-orange-600 mt-1">
                  Нет доступных квартир. Сначала создайте квартиры.
                </p>
              )}
            </div>

            {/* Agent */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Агент *
              </label>
              <select
                value={formData.agentId}
                onChange={(e) =>
                  setFormData({ ...formData, agentId: Number(e.target.value) })
                }
                className="input"
                required
              >
                <option value={0}>Выберите агента</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.fullName} ({agent.commissionPercentage}%)
                  </option>
                ))}
              </select>
              {agents.length === 0 && (
                <p className="text-xs text-orange-600 mt-1">
                  Нет агентов. Сначала создайте агента.
                </p>
              )}
            </div>

            {/* Down Payment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Первоначальный взнос *
              </label>
              <input
                type="number"
                value={formData.downPayment}
                onChange={(e) =>
                  setFormData({ ...formData, downPayment: Number(e.target.value) })
                }
                className="input"
                min="0"
                max={totalAmount}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {totalAmount > 0 &&
                  `${((formData.downPayment / totalAmount) * 100).toFixed(1)}% от общей суммы`}
              </p>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Срок (месяцев) *
              </label>
              <input
                type="number"
                value={formData.durationMonths}
                onChange={(e) =>
                  setFormData({ ...formData, durationMonths: Number(e.target.value) })
                }
                className="input"
                min="1"
                max="120"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.durationMonths} {formData.durationMonths === 1 ? 'месяц' :
                 formData.durationMonths < 5 ? 'месяца' : 'месяцев'}
                {' '}({(formData.durationMonths / 12).toFixed(1)} лет)
              </p>
            </div>
          </div>

          {/* Calculations Summary */}
          {selectedApartment && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Расчёт платежей
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Квартира:</p>
                  <p className="text-lg font-semibold text-gray-900">
                    № {selectedApartment.apartmentNumber} - Блок {selectedApartment.block}, Подъезд {selectedApartment.entrance}, Этаж{' '}
                    {selectedApartment.floor}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedApartment.roomCount}-комнатная, {selectedApartment.area} м²
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Общая стоимость:</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(totalAmount)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Первоначальный взнос:</p>
                  <p className="text-xl font-semibold text-green-600">
                    {formatCurrency(formData.downPayment)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Остаток к оплате:</p>
                  <p className="text-xl font-semibold text-orange-600">
                    {formatCurrency(remainingAmount)}
                  </p>
                </div>

                <div className="md:col-span-2 bg-white rounded-lg p-4 border-2 border-blue-300">
                  <p className="text-sm text-gray-600">Ежемесячный платёж:</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {formatCurrency(monthlyPayment)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    на {formData.durationMonths} месяцев
                  </p>
                </div>
              </div>

              {formData.agentId > 0 && (
                <div className="bg-green-50 rounded p-3 mt-4">
                  <p className="text-sm text-gray-600">Комиссия агента:</p>
                  <p className="text-lg font-semibold text-green-700">
                    {formatCurrency(
                      totalAmount *
                        (agents.find((a) => a.id === formData.agentId)
                          ?.commissionPercentage || 0) /
                        100
                    )}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/contracts')}
              className="btn btn-secondary"
              disabled={submitting}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || apartments.length === 0 || customers.length === 0 || agents.length === 0}
            >
              {submitting ? 'Создание...' : 'Создать договор'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContract;
