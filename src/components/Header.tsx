
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Search } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { NotificationsPopup } from './NotificationsPopup';

export const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="text-slate-600 hover:text-slate-900" />
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              {user?.role === 'admin' ? 'Admin Dashboard' : 'Employee Dashboard'}
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Welcome back, {user?.name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="pl-10 pr-4 py-2.5 w-80 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-sm placeholder:text-slate-400"
            />
          </div>
          
          <NotificationsPopup />
        </div>
      </div>
    </header>
  );
};
