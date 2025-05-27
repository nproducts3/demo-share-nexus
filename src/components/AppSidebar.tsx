
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Users, User, Home, BarChart3, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';

export const AppSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const adminMenuItems = [
    { icon: Home, label: 'Dashboard', href: '/' },
    { icon: Calendar, label: 'Demo Sessions', href: '/sessions' },
    { icon: Users, label: 'User Management', href: '/users' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  const employeeMenuItems = [
    { icon: Home, label: 'Dashboard', href: '/' },
    { icon: Calendar, label: 'My Sessions', href: '/my-sessions' },
    { icon: BarChart3, label: 'My Progress', href: '/progress' },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : employeeMenuItems;

  return (
    <Sidebar className="border-r border-slate-200/60 bg-white/80 backdrop-blur-xl">
      <SidebarHeader className="border-b border-slate-200/60 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
            <Calendar className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Demo Tracker
            </h1>
            <p className="text-xs text-slate-500 font-medium">Knowledge Sharing Platform</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarMenu>
          {menuItems.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton
                onClick={() => navigate(item.href)}
                isActive={location.pathname === item.href}
                className={`w-full justify-start px-4 py-3 rounded-xl transition-all duration-200 group ${
                  location.pathname === item.href
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200/50 shadow-sm'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                  location.pathname === item.href ? 'text-blue-600' : 'text-slate-500'
                }`} />
                <span className="font-medium">{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator className="mx-4 bg-slate-200/60" />

      <SidebarFooter className="p-4">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200/60">
          <Avatar className="h-10 w-10 border-2 border-white shadow-md">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-sm">
              {user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize font-medium">{user?.role}</p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          onClick={logout}
          className="w-full mt-3 border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors duration-200"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
