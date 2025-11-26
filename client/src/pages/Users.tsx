import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, UserX, Shield, Users as UsersIcon } from 'lucide-react';
import { getAllUsers, deactivateUser } from '@/services/api';
import type { UserDto, UserRole } from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Modal from '@/components/common/Modal';

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserDto[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [deactivating, setDeactivating] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, users]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber.includes(searchTerm)
    );
    setFilteredUsers(filtered);
  };

  const handleDeactivateClick = (user: UserDto) => {
    setSelectedUser(user);
    setDeactivateModalOpen(true);
  };

  const handleDeactivateConfirm = async () => {
    if (!selectedUser) return;

    try {
      setDeactivating(true);
      await deactivateUser(selectedUser.id);
      setDeactivateModalOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (err) {
      console.error('Error deactivating user:', err);
      alert('Ошибка при деактивации пользователя');
    } finally {
      setDeactivating(false);
    }
  };

  const getRoleLabel = (role: UserRole): string => {
    switch (role) {
      case 1:
        return 'Администратор';
      case 2:
        return 'Бухгалтер';
      case 3:
        return 'Агент';
      case 4:
        return 'Клиент';
      default:
        return 'Неизвестно';
    }
  };

  const getRoleBadgeColor = (role: UserRole): string => {
    switch (role) {
      case 1:
        return 'bg-red-100 text-red-800';
      case 2:
        return 'bg-blue-100 text-blue-800';
      case 3:
        return 'bg-green-100 text-green-800';
      case 4:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UsersIcon className="w-8 h-8 text-primary-600" />
            Управление пользователями
          </h1>
          <p className="text-gray-600 mt-1">
            Всего пользователей: {users.length} | Активных: {users.filter(u => u.isActive).length}
          </p>
        </div>

        <button
          onClick={() => navigate('/register')}
          className="btn btn-primary flex items-center justify-center space-x-2"
        >
          <UserPlus className="w-5 h-5" />
          <span>Добавить пользователя</span>
        </button>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск по имени, email или телефону..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ФИО
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Телефон
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Роль
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? 'Пользователи не найдены' : 'Нет пользователей'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-semibold">
                            {user.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        <Shield className="w-3 h-3" />
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isActive ? (
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Активен
                        </span>
                      ) : (
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Неактивен
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeactivateClick(user)}
                        disabled={!user.isActive}
                        className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                        title={user.isActive ? 'Деактивировать пользователя' : 'Уже деактивирован'}
                      >
                        <UserX className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deactivate Confirmation Modal */}
      <Modal
        isOpen={deactivateModalOpen}
        onClose={() => !deactivating && setDeactivateModalOpen(false)}
        title="Подтверждение деактивации"
      >
        {selectedUser && (
          <div className="space-y-4">
            <p className="text-gray-700">
              Вы уверены, что хотите деактивировать пользователя{' '}
              <span className="font-semibold">{selectedUser.fullName}</span>?
            </p>
            <p className="text-sm text-gray-600">
              Деактивированный пользователь не сможет войти в систему.
            </p>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setDeactivateModalOpen(false)}
                disabled={deactivating}
                className="btn btn-secondary"
              >
                Отмена
              </button>
              <button
                onClick={handleDeactivateConfirm}
                disabled={deactivating}
                className="btn btn-danger flex items-center space-x-2"
              >
                {deactivating ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Деактивация...</span>
                  </>
                ) : (
                  <>
                    <UserX className="w-5 h-5" />
                    <span>Деактивировать</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Users;
