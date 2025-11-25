import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, Save } from 'lucide-react';
import { paymentsApi, contractsApi } from '@/services/api';
import type { CreatePaymentDto, ContractDto } from '@/types';
import { PaymentType } from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatCurrency } from '@/utils/format';

const CreatePayment: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contractId = searchParams.get('contractId');

  const [formData, setFormData] = useState<CreatePaymentDto>({
    contractId: contractId ? parseInt(contractId) : 0,
    amount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentType: PaymentType.Cash,
    receiptNumber: '',
    notes: '',
    recordedByUserName: '',
  });

  const [contract, setContract] = useState<ContractDto | null>(null);
  const [contracts, setContracts] = useState<ContractDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [contractLoading, setContractLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (contractId) {
      loadContract(parseInt(contractId));
    } else {
      loadContracts();
    }
    // Auto-generate receipt number
    generateReceiptNumber();
  }, [contractId]);

  const generateReceiptNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const timestamp = now.getTime().toString().slice(-6);
    const receiptNum = `RCP-${year}-${timestamp}`;
    setFormData(prev => ({ ...prev, receiptNumber: receiptNum }));
  };

  const loadContracts = async () => {
    try {
      setContractLoading(true);
      const data = await contractsApi.getAll();
      setContracts(data);
    } catch (err) {
      console.error('Error loading contracts:', err);
      setError('Не удалось загрузить список договоров');
    } finally {
      setContractLoading(false);
    }
  };

  const loadContract = async (id: number) => {
    try {
      setContractLoading(true);
      const data = await contractsApi.getById(id);
      setContract(data);
      // Pre-fill with monthly payment amount
      setFormData(prev => ({
        ...prev,
        contractId: id,
        amount: data.monthlyPayment,
      }));
    } catch (err) {
      console.error('Error loading contract:', err);
      setError('Не удалось загрузить договор');
    } finally {
      setContractLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.contractId === 0) {
      setError('Выберите договор');
      return;
    }

    if (formData.amount <= 0) {
      setError('Сумма должна быть больше 0');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await paymentsApi.create(formData);

      // Redirect back to contract details if came from there, otherwise to payments list
      if (contractId) {
        navigate(`/contracts/${contractId}`);
      } else {
        navigate('/payments');
      }
    } catch (err: any) {
      console.error('Error creating payment:', err);
      setError(err.response?.data?.message || 'Ошибка при создании платежа');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' || name === 'contractId' || name === 'paymentType'
        ? parseFloat(value) || 0
        : value,
    }));
  };

  if (contractLoading) {
    return <LoadingSpinner className="h-screen" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(contractId ? `/contracts/${contractId}` : '/payments')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Записать платеж</h1>
            <p className="text-gray-600 mt-2">Добавление нового платежа</p>
          </div>
        </div>
      </div>

      {/* Contract Info Card (if contract is pre-selected) */}
      {contract && (
        <div className="card p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center space-x-3 mb-4">
            <DollarSign className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Договор №{contract.contractNumber}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-gray-600">Клиент:</span>
              <p className="font-medium">{contract.customerName}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Квартира:</span>
              <p className="font-medium">{contract.apartmentInfo}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Остаток к оплате:</span>
              <p className="font-semibold text-orange-600">{formatCurrency(contract.remainingBalance)}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div>
              <span className="text-sm text-gray-600">Ежемесячный платеж:</span>
              <p className="font-medium">{formatCurrency(contract.monthlyPayment)}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Оплачено месяцев:</span>
              <p className="font-medium">{contract.monthsPaid} из {contract.durationMonths}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Осталось месяцев:</span>
              <p className="font-medium">{contract.monthsRemaining}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contract Selection (hidden if pre-selected) */}
          {!contractId && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Договор *
              </label>
              <select
                name="contractId"
                value={formData.contractId || 0}
                onChange={(e) => {
                  const selectedId = Number(e.target.value);
                  setFormData({ ...formData, contractId: selectedId });
                  if (selectedId > 0) {
                    loadContract(selectedId);
                  }
                }}
                required
                className="input"
              >
                <option value={0}>Выберите договор</option>
                {contracts.map((c) => (
                  <option key={c.id} value={c.id}>
                    № {c.contractNumber} - {c.customerName} - Остаток: {formatCurrency(c.remainingBalance)}
                  </option>
                ))}
              </select>
              {contracts.length === 0 && (
                <p className="text-sm text-orange-600 mt-1">
                  Нет активных договоров
                </p>
              )}
            </div>
          )}

          {/* Payment Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Дата платежа *
            </label>
            <input
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Сумма платежа *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount || ''}
              onChange={handleChange}
              required
              step="0.01"
              min="0.01"
              className="input bg-gray-100 cursor-not-allowed"
              placeholder="0.00"
              readOnly
            />
            <p className="text-xs text-gray-500 mt-1">
              Автоматически заполняется ежемесячным платежом
            </p>
          </div>

          {/* Payment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип платежа *
            </label>
            <select
              name="paymentType"
              value={formData.paymentType}
              onChange={handleChange}
              required
              className="input"
            >
              <option value={PaymentType.Cash}>Нал (Наличные)</option>
              <option value={PaymentType.NonCash}>Без.нал (Безналичный)</option>
            </select>
          </div>

          {/* Receipt Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              № Квитанции
            </label>
            <input
              type="text"
              name="receiptNumber"
              value={formData.receiptNumber}
              onChange={handleChange}
              className="input bg-gray-100 cursor-not-allowed"
              placeholder="Автоматически генерируется"
              readOnly
            />
            <p className="text-xs text-gray-500 mt-1">
              Автоматически генерируется в формате RCP-YYYY-XXXXXX
            </p>
          </div>

          {/* Recorded By User Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Записал *
            </label>
            <input
              type="text"
              name="recordedByUserName"
              value={formData.recordedByUserName}
              onChange={handleChange}
              className="input"
              required
              placeholder="Ваше имя"
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Примечания
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="input"
              placeholder="Дополнительные заметки (необязательно)"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate(contractId ? `/contracts/${contractId}` : '/payments')}
            className="btn btn-secondary"
            disabled={loading}
          >
            Отмена
          </button>
          <button
            type="submit"
            className="btn btn-primary flex items-center space-x-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoadingSpinner className="w-5 h-5" />
                <span>Сохранение...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Записать платеж</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Helper Info */}
      <div className="card p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-2">Информация</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Все платежи записываются вручную (наличные или банковский перевод)</li>
          <li>• Сумма платежа автоматически заполняется ежемесячным платежом договора</li>
          <li>• Номер квитанции генерируется автоматически для отслеживания</li>
          <li>• Убедитесь, что дата платежа указана правильно</li>
          <li>• После записи платеж будет привязан к договору и графику платежей</li>
        </ul>
      </div>
    </div>
  );
};

export default CreatePayment;
