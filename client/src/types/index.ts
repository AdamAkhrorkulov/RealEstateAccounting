// Enums
export enum UserRole {
  Admin = 1,
  Accountant = 2,
  Agent = 3,
  Customer = 4,
}

export enum ApartmentStatus {
  Available = 1,
  Reserved = 2,
  Sold = 3,
}

export enum ContractStatus {
  Active = 1,
  Completed = 2,
  Overdue = 3,
  Cancelled = 4,
}

export enum PaymentType {
  Cash = 1,      // нал
  NonCash = 2,   // без.нал
}

// Auth Types
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  role: UserRole;
  agentId?: number;
  customerId?: number;
}

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  role: UserRole;
  expiresAt: string;
}

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: UserRole;
  agentId?: number;
  customerId?: number;
  isActive: boolean;
}

// Apartment Types
export interface ApartmentDto {
  id: number;
  apartmentNumber: string;     // Номер квартиры
  block: string;               // Блок
  entrance: number;            // Подъезд
  floor: number;               // Этаж
  roomCount: number;           // Количество комнат
  area: number;                // Площадь (м²)
  pricePerSquareMeter: number; // Цена за м²
  totalPrice: number;          // Общая цена
  status: ApartmentStatus;     // Статус
  createdAt: string;
  updatedAt?: string;
}

export interface CreateApartmentDto {
  apartmentNumber: string;
  block: string;
  entrance: number;
  floor: number;
  roomCount: number;
  area: number;
  pricePerSquareMeter: number;
}

// Customer Types
export interface CustomerDto {
  id: number;
  fullName: string;            // ФИО
  passportSeries: string;      // Серия паспорта
  passportNumber: string;      // Номер паспорта
  passportIssueDate: string;   // Дата выдачи
  passportIssuedBy: string;    // Кем выдан
  registrationAddress: string; // Адрес прописки
  phoneNumber: string;         // Телефон
  email?: string;              // Email
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCustomerDto {
  fullName: string;
  passportSeries: string;
  passportNumber: string;
  passportIssueDate: string;
  passportIssuedBy: string;
  registrationAddress: string;
  phoneNumber: string;
  email?: string;
}

// Agent Types
export interface AgentDto {
  id: number;
  fullName: string;              // ФИО
  phoneNumber: string;           // Телефон
  email?: string;                // Email
  commissionPercentage: number;  // Процент комиссии
  totalSales: number;            // Всего продаж
  totalCommissionEarned: number; // Всего комиссий
  createdAt: string;
  updatedAt?: string;
}

export interface CreateAgentDto {
  fullName: string;
  phoneNumber: string;
  email?: string;
  commissionPercentage: number;
}

// Contract Types
export interface ContractDto {
  id: number;
  contractNumber: string;       // Номер договора
  contractDate: string;         // Дата договора
  customerId: number;           // ID покупателя
  customerName: string;         // Имя покупателя
  apartmentId: number;          // ID квартиры
  apartmentInfo: string;        // Информация о квартире
  agentId: number;              // ID агента
  agentName: string;            // Имя агента
  totalAmount: number;          // Общая сумма
  downPayment: number;          // Первоначальный взнос
  durationMonths: number;       // Срок (месяцев)
  monthlyPayment: number;       // Ежемесячный платеж
  status: ContractStatus;       // Статус
  remainingBalance: number;     // Остаток
  monthsPaid: number;           // Оплачено месяцев
  monthsRemaining: number;      // Осталось месяцев
  createdAt: string;
  updatedAt?: string;
}

export interface CreateContractDto {
  contractNumber: string;
  contractDate: string;
  customerId: number;
  apartmentId: number;
  agentId: number;
  downPayment: number;
  durationMonths: number;
}

// Payment Types
export interface PaymentDto {
  id: number;
  contractId: number;           // ID договора
  contractNumber: string;       // Номер договора
  installmentPlanId?: number;   // ID графика платежей
  amount: number;               // Сумма
  paymentDate: string;          // Дата платежа
  paymentType: PaymentType;     // Тип (нал/без.нал)
  receiptNumber?: string;       // Номер квитанции
  notes?: string;               // Примечания
  recordedByUserId: string;     // Кто записал
  recordedByUserName: string;   // Имя пользователя
  createdAt: string;
}

export interface CreatePaymentDto {
  contractId: number;
  installmentPlanId?: number;
  amount: number;
  paymentDate: string;
  paymentType: PaymentType;
  receiptNumber?: string;
  notes?: string;
  recordedByUserName: string;
}

// Installment Plan Types
export interface InstallmentPlanDto {
  id: number;
  contractId: number;           // ID договора
  monthNumber: number;          // Номер месяца
  dueDate: string;              // Срок платежа
  scheduledAmount: number;      // Плановая сумма
  isPaid: boolean;              // Оплачено
  isOverdue: boolean;           // Просрочено
  paymentId?: number;           // ID платежа
  paymentDate?: string;         // Дата оплаты
  paidAmount?: number;          // Оплаченная сумма
}

// Dashboard Types
export interface DashboardStats {
  totalApartments: number;      // Всего квартир
  availableApartments: number;  // Доступно
  soldApartments: number;       // Продано
  reservedApartments: number;   // Забронировано
  totalRevenue: number;         // Общий доход
  receivedRevenue: number;      // Получено
  pendingRevenue: number;       // Ожидается
  overdueAmount: number;        // Просрочено
  activeContracts: number;      // Активных договоров
  completedContracts: number;   // Завершено договоров
  overdueContracts: number;     // Просрочено договоров
  totalCustomers: number;       // Всего клиентов
  totalAgents: number;          // Всего агентов
}

export interface RevenueData {
  month: string;
  revenue: number;
  payments: number;
}

export interface AgentPerformance {
  agentId: number;
  agentName: string;
  totalSales: number;
  totalCommission: number;
  activeContracts: number;
}

export interface DashboardDto {
  stats: DashboardStats;
  revenueData: RevenueData[];
  topAgents: AgentPerformance[];
}
