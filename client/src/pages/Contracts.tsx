import React, { useEffect, useState } from 'react';
import { Plus, Eye } from 'lucide-react';
import { contractsApi } from '@/services/api';
import type { ContractDto } from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatCurrency, formatDate, getContractStatusName, getContractStatusColor } from '@/utils/format';
import { Link } from 'react-router-dom';

const Contracts: React.FC = () => {
  const [contracts, setContracts] = useState<ContractDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      const data = await contractsApi.getAll();
      setContracts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner className="h-screen" />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Договора</h1>
          <p className="text-sm text-gray-600 mt-1">Управление договорами</p>
        </div>
        <Link to="/contracts/new" className="btn btn-primary flex items-center space-x-2 text-sm">
          <Plus className="w-4 h-4" />
          <span>Создать договор</span>
        </Link>
      </div>

      <div className="card p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">№ Договора</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Дата</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Клиент</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Квартира</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Агент</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Общая сумма</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Остаток</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Статус</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{contract.contractNumber}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{formatDate(contract.contractDate)}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{contract.customerName}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{contract.apartmentInfo}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{contract.agentName}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{formatCurrency(contract.totalAmount)}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-semibold text-orange-600">{formatCurrency(contract.remainingBalance)}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getContractStatusColor(contract.status)}`}>
                      {getContractStatusName(contract.status)}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    <Link
                      to={`/contracts/${contract.id}`}
                      className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                      title="Просмотреть детали"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {contracts.length === 0 && (
            <div className="text-center py-8 text-sm text-gray-500">Договора не найдены</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contracts;
