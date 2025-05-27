
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Users, User, Home, BarChart3, Settings, PanelLeftClose } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export const AppSidebar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const adminMenuItems = [
    { icon: Home, label: 'Dashboard', href: '/' },
    { icon: Calendar, label: 'Demo Sessions', href: '/demo-sessions' },
    { icon: Users, label: 'User Management', href: '/user-management' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  const employeeMenuItems = [
    { icon: Home, label: 'Dashboard', href: '/' },
    { icon: Calendar, label: 'My Sessions', href: '/my-sessions' },
    { icon: BarChart3, label: 'My Progress', href: '/my-progress' },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : employeeMenuItems;

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200/60 bg-white shadow-sm">
      <SidebarHeader className="border-b border-slate-200/60 p-6 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 group-data-[collapsible=icon]:justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-blue-600/20">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                Demo Tracker
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Knowledge Sharing Platform</p>
            </div>
          </div>
          <SidebarTrigger className="h-8 w-8 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors" />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4 bg-gradient-to-b from-white to-slate-50/30">
        <SidebarMenu className="space-y-2">
          {menuItems.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton
                onClick={() => navigate(item.href)}
                isActive={location.pathname === item.href}
                tooltip={item.label}
                className={`w-full justify-start px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  location.pathname === item.href
                    ? 'bg-gradient-to-r from-blue-50 via-blue-50 to-indigo-50 text-blue-700 border border-blue-200/50 shadow-md hover:shadow-lg'
                    : 'text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 hover:text-slate-900 border border-transparent hover:border-slate-200/50'
                }`}
              >
                <div className="flex items-center space-x-3 relative z-10">
                  <item.icon className={`h-5 w-5 transition-all duration-300 group-hover:scale-110 ${
                    location.pathname === item.href ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'
                  }`} />
                  <span className="font-medium group-data-[collapsible=icon]:hidden">{item.label}</span>
                </div>
                {location.pathname === item.href && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-xl" />
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};
