import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCheck,
  FileText,
  CreditCard,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

const Sidebar: React.FC = () => {
  const { user, logout, hasRole } = useAuth();

  const navItems = [
    {
      name: 'Панель управления',
      icon: LayoutDashboard,
      path: '/',
      roles: [UserRole.Admin, UserRole.Accountant, UserRole.Agent],
    },
    {
      name: 'Квартиры',
      icon: Building2,
      path: '/apartments',
      roles: [UserRole.Admin, UserRole.Accountant, UserRole.Agent],
    },
    {
      name: 'Клиенты',
      icon: Users,
      path: '/customers',
      roles: [UserRole.Admin, UserRole.Accountant, UserRole.Agent],
    },
    {
      name: 'Агенты',
      icon: UserCheck,
      path: '/agents',
      roles: [UserRole.Admin, UserRole.Accountant],
    },
    {
      name: 'Договора',
      icon: FileText,
      path: '/contracts',
      roles: [UserRole.Admin, UserRole.Accountant, UserRole.Agent, UserRole.Customer],
    },
    {
      name: 'Платежи',
      icon: CreditCard,
      path: '/payments',
      roles: [UserRole.Admin, UserRole.Accountant, UserRole.Agent, UserRole.Customer],
    },
  ];

  const filteredNavItems = navItems.filter((item) => hasRole(item.roles));

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary-600">Учёт Недвижимости</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="mb-3 px-4">
          <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Выйти</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
