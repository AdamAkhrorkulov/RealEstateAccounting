import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { UserRole, ApartmentStatus, ContractStatus, PaymentType } from '@/types';

// Format currency in UZS
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' сум';
};

// Format date
export const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'dd.MM.yyyy', { locale: ru });
  } catch {
    return dateString;
  }
};

// Format datetime
export const formatDateTime = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'dd.MM.yyyy HH:mm', { locale: ru });
  } catch {
    return dateString;
  }
};

// Format area
export const formatArea = (area: number): string => {
  return `${area.toFixed(1)} м²`;
};

// Get role name in Russian
export const getRoleName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    [UserRole.Admin]: 'Администратор',
    [UserRole.Accountant]: 'Бухгалтер',
    [UserRole.Agent]: 'Агент',
    [UserRole.Customer]: 'Клиент',
  };
  return roleNames[role];
};

// Get apartment status name in Russian
export const getApartmentStatusName = (status: ApartmentStatus): string => {
  const statusNames: Record<ApartmentStatus, string> = {
    [ApartmentStatus.Available]: 'Доступна',
    [ApartmentStatus.Reserved]: 'Забронирована',
    [ApartmentStatus.Sold]: 'Продана',
  };
  return statusNames[status];
};

// Get apartment status color
export const getApartmentStatusColor = (status: ApartmentStatus): string => {
  const statusColors: Record<ApartmentStatus, string> = {
    [ApartmentStatus.Available]: 'badge-success',
    [ApartmentStatus.Reserved]: 'badge-warning',
    [ApartmentStatus.Sold]: 'badge-info',
  };
  return statusColors[status];
};

// Get contract status name in Russian
export const getContractStatusName = (status: ContractStatus): string => {
  const statusNames: Record<ContractStatus, string> = {
    [ContractStatus.Active]: 'Активный',
    [ContractStatus.Completed]: 'Завершён',
    [ContractStatus.Overdue]: 'Просрочен',
    [ContractStatus.Cancelled]: 'Отменён',
  };
  return statusNames[status];
};

// Get contract status color
export const getContractStatusColor = (status: ContractStatus): string => {
  const statusColors: Record<ContractStatus, string> = {
    [ContractStatus.Active]: 'badge-success',
    [ContractStatus.Completed]: 'badge-info',
    [ContractStatus.Overdue]: 'badge-danger',
    [ContractStatus.Cancelled]: 'badge-secondary',
  };
  return statusColors[status];
};

// Get payment type name in Russian
export const getPaymentTypeName = (type: PaymentType): string => {
  const typeNames: Record<PaymentType, string> = {
    [PaymentType.Cash]: 'Нал',
    [PaymentType.NonCash]: 'Без.нал',
  };
  return typeNames[type];
};

// Get payment type color
export const getPaymentTypeColor = (type: PaymentType): string => {
  const typeColors: Record<PaymentType, string> = {
    [PaymentType.Cash]: 'badge-success',
    [PaymentType.NonCash]: 'badge-info',
  };
  return typeColors[type];
};

// Calculate percentage
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};
