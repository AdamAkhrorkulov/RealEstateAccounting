import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Платежи</h1>
          <p className="text-sm text-gray-600 mt-1">История платежей</p>
        </div>
        <Link to="/payments/new" className="btn btn-primary flex items-center space-x-2 text-sm">
          <Plus className="w-4 h-4" />
          <span>Записать платеж</span>
        </Link>
      </div>

      <div className="card p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Дата платежа</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">№ Договора</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Сумма</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Тип</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">№ Квитанции</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Записал</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Примечания</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{formatDate(payment.paymentDate)}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{payment.contractNumber}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-semibold text-green-600">{formatCurrency(payment.amount)}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentTypeColor(payment.paymentType)}`}>
                      {getPaymentTypeName(payment.paymentType)}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{payment.receiptNumber || '-'}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{payment.recordedByUserName}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{payment.notes || '-'}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDelete(payment.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Удалить платеж"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {payments.length === 0 && (
            <div className="text-center py-8 text-sm text-gray-500">Платежи не найдены</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;
