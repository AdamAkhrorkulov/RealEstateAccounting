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

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const navItems = [
    {
      name: 'Панель управления',
      icon: LayoutDashboard,
      path: '/',
    },
    {
      name: 'Квартиры',
      icon: Building2,
      path: '/apartments',
    },
    {
      name: 'Клиенты',
      icon: Users,
      path: '/customers',
    },
    {
      name: 'Агенты',
      icon: UserCheck,
      path: '/agents',
    },
    {
      name: 'Договора',
      icon: FileText,
      path: '/contracts',
    },
    {
      name: 'Платежи',
      icon: CreditCard,
      path: '/payments',
    },
  ];

  return (
    <div className="w-56 bg-white border-r border-gray-200 h-screen flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-600">Учёт Недвижимости</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                isActive
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-3 border-t border-gray-200">
        <div className="mb-2 px-3">
          <p className="text-xs font-medium text-gray-900 truncate">{user?.fullName}</p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Выйти</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
