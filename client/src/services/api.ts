import axios from 'axios';
import type {
  LoginDto,
  RegisterDto,
  AuthResponse,
  UserDto,
  ApartmentDto,
  CreateApartmentDto,
  CustomerDto,
  CreateCustomerDto,
  AgentDto,
  CreateAgentDto,
  ContractDto,
  CreateContractDto,
  PaymentDto,
  CreatePaymentDto,
  InstallmentPlanDto,
  DashboardDto,
} from '@/types';

const API_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url} (with auth token)`);
  } else {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url} (no auth token)`);
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoginRequest = error.config?.url?.includes('/Auth/login');
      const currentPath = window.location.pathname;

      // Don't clear tokens or redirect if:
      // 1. This is a login request (let login page handle the error)
      // 2. We're already on the login page (prevent redirect loop)
      if (!isLoginRequest && currentPath !== '/login') {
        console.log('401 Unauthorized - clearing tokens and redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Use setTimeout to avoid redirect during React rendering
        setTimeout(() => {
          window.location.href = '/login';
        }, 0);
      } else {
        console.log('401 on login page or login request - not redirecting');
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/Auth/login', data);
    return response.data;
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/Auth/register', data);
    return response.data;
  },

  getAllUsers: async (): Promise<UserDto[]> => {
    const response = await api.get<UserDto[]>('/Auth/users');
    return response.data;
  },

  deactivateUser: async (userId: string): Promise<void> => {
    await api.post(`/Auth/users/${userId}/deactivate`);
  },
};

// Apartments API
export const apartmentsApi = {
  getAll: async (): Promise<ApartmentDto[]> => {
    const response = await api.get<ApartmentDto[]>('/Apartments');
    return response.data;
  },

  getById: async (id: number): Promise<ApartmentDto> => {
    const response = await api.get<ApartmentDto>(`/Apartments/${id}`);
    return response.data;
  },

  create: async (data: CreateApartmentDto): Promise<ApartmentDto> => {
    const response = await api.post<ApartmentDto>('/Apartments', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateApartmentDto>): Promise<ApartmentDto> => {
    const response = await api.put<ApartmentDto>(`/Apartments/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/Apartments/${id}`);
  },

  getAvailable: async (): Promise<ApartmentDto[]> => {
    const response = await api.get<ApartmentDto[]>('/Apartments/available');
    return response.data;
  },
};

// Customers API
export const customersApi = {
  getAll: async (): Promise<CustomerDto[]> => {
    const response = await api.get<CustomerDto[]>('/Customers');
    return response.data;
  },

  getById: async (id: number): Promise<CustomerDto> => {
    const response = await api.get<CustomerDto>(`/Customers/${id}`);
    return response.data;
  },

  create: async (data: CreateCustomerDto): Promise<CustomerDto> => {
    const response = await api.post<CustomerDto>('/Customers', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateCustomerDto>): Promise<CustomerDto> => {
    const response = await api.put<CustomerDto>(`/Customers/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/Customers/${id}`);
  },
};

// Agents API
export const agentsApi = {
  getAll: async (): Promise<AgentDto[]> => {
    const response = await api.get<AgentDto[]>('/Agents');
    return response.data;
  },

  getById: async (id: number): Promise<AgentDto> => {
    const response = await api.get<AgentDto>(`/Agents/${id}`);
    return response.data;
  },

  create: async (data: CreateAgentDto): Promise<AgentDto> => {
    const response = await api.post<AgentDto>('/Agents', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateAgentDto>): Promise<AgentDto> => {
    const response = await api.put<AgentDto>(`/Agents/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/Agents/${id}`);
  },
};

// Contracts API
export const contractsApi = {
  getAll: async (): Promise<ContractDto[]> => {
    const response = await api.get<ContractDto[]>('/Contracts');
    return response.data;
  },

  getById: async (id: number): Promise<ContractDto> => {
    const response = await api.get<ContractDto>(`/Contracts/${id}`);
    return response.data;
  },

  create: async (data: CreateContractDto): Promise<ContractDto> => {
    const response = await api.post<ContractDto>('/Contracts', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateContractDto>): Promise<ContractDto> => {
    const response = await api.put<ContractDto>(`/Contracts/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/Contracts/${id}`);
  },

  getInstallmentPlan: async (id: number): Promise<InstallmentPlanDto[]> => {
    const response = await api.get<InstallmentPlanDto[]>(`/Contracts/${id}/installment-plan`);
    return response.data;
  },

  getOverdue: async (): Promise<ContractDto[]> => {
    const response = await api.get<ContractDto[]>('/Contracts/overdue');
    return response.data;
  },
};

// Payments API
export const paymentsApi = {
  getAll: async (): Promise<PaymentDto[]> => {
    const response = await api.get<PaymentDto[]>('/Payments');
    return response.data;
  },

  getById: async (id: number): Promise<PaymentDto> => {
    const response = await api.get<PaymentDto>(`/Payments/${id}`);
    return response.data;
  },

  create: async (data: CreatePaymentDto): Promise<PaymentDto> => {
    const response = await api.post<PaymentDto>('/Payments', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/Payments/${id}`);
  },

  getByContract: async (contractId: number): Promise<PaymentDto[]> => {
    const response = await api.get<PaymentDto[]>(`/Payments/contract/${contractId}`);
    return response.data;
  },

  getByDateRange: async (startDate: string, endDate: string): Promise<PaymentDto[]> => {
    const response = await api.get<PaymentDto[]>('/Payments/date-range', {
      params: { startDate, endDate },
    });
    return response.data;
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<DashboardDto> => {
    const response = await api.get<DashboardDto>('/Dashboard/stats');
    return response.data;
  },
};

export default api;
