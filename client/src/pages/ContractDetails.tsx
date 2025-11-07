import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, User, Home, FileText } from 'lucide-react';
import { contractsApi } from '@/services/api';
import type { ContractDto } from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatCurrency, formatDate, getContractStatusName, getContractStatusColor } from '@/utils/format';

const ContractDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contract, setContract] = useState<ContractDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadContract(parseInt(id));
    }
  }, [id]);

  const loadContract = async (contractId: number) => {
    try {
      setLoading(true);
      const data = await contractsApi.getById(contractId);
      setContract(data);
    } catch (err: any) {
      console.error('Error loading contract:', err);
      setError(err.response?.data?.message || 'Ошибка загрузки договора');
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
        <h2 className="text-2xl font-bold mb-4">Ошибка</h2>
        <p className="mb-4">{error}</p>
        <button onClick={() => navigate('/contracts')} className="btn btn-primary">
          Вернуться к списку
        </button>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="text-center text-gray-600 p-8">
        <h2 className="text-2xl font-bold mb-4">Договор не найден</h2>
        <button onClick={() => navigate('/contracts')} className="btn btn-primary">
          Вернуться к списку
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/contracts')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Договор №{contract.contractNumber}
            </h1>
            <p className="text-gray-600 mt-2">Детали договора</p>
          </div>
        </div>
        <span className={`badge ${getContractStatusColor(contract.status)}`}>
          {getContractStatusName(contract.status)}
        </span>
      </div>

      {/* Main Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contract Information */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Информация о договоре</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Номер договора:</span>
              <span className="font-medium">{contract.contractNumber}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Дата договора:</span>
              <span className="font-medium">{formatDate(contract.contractDate)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Срок (месяцев):</span>
              <span className="font-medium">{contract.durationMonths}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Оплачено месяцев:</span>
              <span className="font-medium">{contract.monthsPaid}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Осталось месяцев:</span>
              <span className="font-medium">{contract.monthsRemaining}</span>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <DollarSign className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Финансовая информация</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Общая сумма:</span>
              <span className="font-medium">{formatCurrency(contract.totalAmount)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Первоначальный взнос:</span>
              <span className="font-medium">{formatCurrency(contract.downPayment)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Ежемесячный платеж:</span>
              <span className="font-medium">{formatCurrency(contract.monthlyPayment)}</span>
            </div>
            <div className="flex justify-between py-2 bg-orange-50 px-3 rounded">
              <span className="text-gray-900 font-semibold">Остаток к оплате:</span>
              <span className="font-bold text-orange-600">
                {formatCurrency(contract.remainingBalance)}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <User className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Клиент</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">ФИО:</span>
              <span className="font-medium">{contract.customerName || 'Не указано'}</span>
            </div>
            {contract.customer && (
              <>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Телефон:</span>
                  <span className="font-medium">{contract.customer.phoneNumber}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Паспорт:</span>
                  <span className="font-medium">
                    {contract.customer.passportSeries} {contract.customer.passportNumber}
                  </span>
                </div>
              </>
            )}
            <Link
              to={`/customers`}
              className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center mt-2"
            >
              Просмотреть полную информацию
            </Link>
          </div>
        </div>

        {/* Apartment Information */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Home className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">Квартира</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Описание:</span>
              <span className="font-medium">{contract.apartmentInfo || 'Не указано'}</span>
            </div>
            {contract.apartment && (
              <>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Площадь:</span>
                  <span className="font-medium">{contract.apartment.area} м²</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Цена за м²:</span>
                  <span className="font-medium">
                    {formatCurrency(contract.apartment.pricePerSquareMeter)}
                  </span>
                </div>
              </>
            )}
            <Link
              to={`/apartments`}
              className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center mt-2"
            >
              Просмотреть полную информацию
            </Link>
          </div>
        </div>
      </div>

      {/* Agent Information */}
      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <User className="w-6 h-6 text-teal-600" />
          <h2 className="text-xl font-semibold text-gray-900">Агент</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-gray-600">ФИО:</span>
            <p className="font-medium mt-1">{contract.agentName || 'Не указано'}</p>
          </div>
          {contract.agent && (
            <>
              <div>
                <span className="text-gray-600">Телефон:</span>
                <p className="font-medium mt-1">{contract.agent.phoneNumber}</p>
              </div>
              <div>
                <span className="text-gray-600">Комиссия:</span>
                <p className="font-medium mt-1">{contract.agent.commissionPercentage}%</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Link to="/payments" className="btn btn-primary">
          Записать платеж
        </Link>
      </div>
    </div>
  );
};

export default ContractDetails;
