import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/services/api';
import type { AuthResponse, LoginDto, UserRole } from '@/types';

interface User {
  email: string;
  fullName: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    console.log('AuthContext: Initializing...', {
      hasToken: !!storedToken,
      hasUser: !!storedUser,
    });

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        console.log('AuthContext: User restored from localStorage', parsedUser);
      } catch (error) {
        console.error('AuthContext: Failed to parse stored user', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginDto) => {
    try {
      console.log('AuthContext: Attempting login...');
      const response: AuthResponse = await authApi.login(credentials);

      const userData: User = {
        email: response.email,
        fullName: response.fullName,
        role: response.role,
      };

      console.log('AuthContext: Login successful, setting user and token', {
        user: userData,
        tokenLength: response.token.length,
      });

      setToken(response.token);
      setUser(userData);

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(userData));

      console.log('AuthContext: User and token saved to localStorage');
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('AuthContext: Logging out user');
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const hasRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user && !!token,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
