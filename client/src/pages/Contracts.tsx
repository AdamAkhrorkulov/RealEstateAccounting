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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Договора</h1>
          <p className="text-gray-600 mt-2">Управление договорами</p>
        </div>
        <Link to="/contracts/new" className="btn btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Создать договор</span>
        </Link>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>№ Договора</th>
                <th>Дата</th>
                <th>Клиент</th>
                <th>Квартира</th>
                <th>Агент</th>
                <th>Общая сумма</th>
                <th>Остаток</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr key={contract.id}>
                  <td className="font-medium">{contract.contractNumber}</td>
                  <td>{formatDate(contract.contractDate)}</td>
                  <td>{contract.customerName}</td>
                  <td>{contract.apartmentInfo}</td>
                  <td>{contract.agentName}</td>
                  <td>{formatCurrency(contract.totalAmount)}</td>
                  <td className="font-semibold text-orange-600">{formatCurrency(contract.remainingBalance)}</td>
                  <td>
                    <span className={`badge ${getContractStatusColor(contract.status)}`}>
                      {getContractStatusName(contract.status)}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/contracts/${contract.id}`}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {contracts.length === 0 && (
            <div className="text-center py-8 text-gray-500">Договора не найдены</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contracts;
