import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { paymentsApi } from '@/services/api';
import type { PaymentDto } from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatCurrency, formatDate, getPaymentTypeName, getPaymentTypeColor } from '@/utils/format';

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<PaymentDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await paymentsApi.getAll();
      setPayments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить платеж?')) return;
    try {
      await paymentsApi.delete(id);
      loadPayments();
    } catch (err) {
      alert('Ошибка при удалении');
    }
  };

  if (loading) return <LoadingSpinner className="h-screen" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Платежи</h1>
          <p className="text-gray-600 mt-2">История платежей</p>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Дата платежа</th>
                <th>№ Договора</th>
                <th>Сумма</th>
                <th>Тип</th>
                <th>№ Квитанции</th>
                <th>Записал</th>
                <th>Примечания</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{formatDate(payment.paymentDate)}</td>
                  <td className="font-medium">{payment.contractNumber}</td>
                  <td className="font-semibold text-green-600">{formatCurrency(payment.amount)}</td>
                  <td>
                    <span className={`badge ${getPaymentTypeColor(payment.paymentType)}`}>
                      {getPaymentTypeName(payment.paymentType)}
                    </span>
                  </td>
                  <td>{payment.receiptNumber || '-'}</td>
                  <td>{payment.recordedByUserName}</td>
                  <td>{payment.notes || '-'}</td>
                  <td>
                    <button onClick={() => handleDelete(payment.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {payments.length === 0 && (
            <div className="text-center py-8 text-gray-500">Платежи не найдены</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;
