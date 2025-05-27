
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Users, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const adminMenuItems = [
    { icon: Calendar, label: 'Dashboard', href: '/' },
    { icon: Calendar, label: 'Demo Sessions', href: '/sessions' },
    { icon: Users, label: 'User Management', href: '/users' },
  ];

  const employeeMenuItems = [
    { icon: Calendar, label: 'Dashboard', href: '/' },
    { icon: Calendar, label: 'My Sessions', href: '/my-sessions' },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : employeeMenuItems;

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">Demo Tracker</h1>
        <p className="text-sm text-gray-600 mt-1">Knowledge Sharing Platform</p>
      </div>
      
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={logout}
          className="w-full"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};
