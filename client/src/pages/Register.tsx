import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { RegisterDto, UserRole } from '@/types';
import { register } from '@/services/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterDto>({
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    role: UserRole.Accountant,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: name === 'role' ? parseInt(value) : value,
      };

      // Clear agentId and customerId when role changes
      if (name === 'role') {
        delete newData.agentId;
        delete newData.customerId;
      }

      return newData;
    });
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await register(formData);
      setSuccess(true);

      // Reset form
      setFormData({
        email: '',
        password: '',
        fullName: '',
        phoneNumber: '',
        role: UserRole.Accountant,
      });

      // Show success message for 2 seconds then navigate to users page
      setTimeout(() => {
        navigate('/users');
      }, 2000);
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.title ||
        'Ошибка при создании пользователя. Проверьте данные и попробуйте снова.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role: UserRole): string => {
    switch (role) {
      case UserRole.Admin:
        return 'Администратор';
      case UserRole.Accountant:
        return 'Бухгалтер';
      case UserRole.Agent:
        return 'Агент';
      case UserRole.Customer:
        return 'Клиент';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="max-w-2xl w-full">
        <div className="card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Регистрация пользователя</h1>
            <p className="text-gray-600">Создайте новый аккаунт в системе</p>
          </div>

          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate('/users')}
            className="btn btn-secondary mb-6 flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Назад к списку</span>
          </button>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                Пользователь успешно создан! Перенаправление...
              </div>
            )}

            {/* Row 1: Full Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  ФИО <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="input"
                  placeholder="Иванов Иван Иванович"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  placeholder="user@example.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Row 2: Phone and Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Телефон <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="input"
                  placeholder="+998 90 123 45 67"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Пароль <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={loading}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Минимум 6 символов, должен содержать цифру, заглавную и строчную буквы
                </p>
              </div>
            </div>

            {/* Row 3: Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Роль <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input"
                required
                disabled={loading}
              >
                <option value={UserRole.Accountant}>{getRoleLabel(UserRole.Accountant)}</option>
                <option value={UserRole.Agent}>{getRoleLabel(UserRole.Agent)}</option>
                <option value={UserRole.Customer}>{getRoleLabel(UserRole.Customer)}</option>
                <option value={UserRole.Admin}>{getRoleLabel(UserRole.Admin)}</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Создание...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Создать пользователя</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/users')}
                disabled={loading}
                className="btn btn-secondary"
              >
                Отмена
              </button>
            </div>
          </form>

          {/* Password Requirements Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800 font-medium mb-2">Требования к паролю:</p>
            <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
              <li>Минимум 6 символов</li>
              <li>Должен содержать хотя бы одну цифру</li>
              <li>Должен содержать хотя бы одну заглавную букву</li>
              <li>Должен содержать хотя бы одну строчную букву</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
