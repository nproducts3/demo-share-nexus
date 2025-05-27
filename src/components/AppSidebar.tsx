
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Users, User, Home, BarChart3, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
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

  const handleLogout = () => {
    try {
      logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

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
    <Sidebar className="border-r border-slate-200/60 bg-white shadow-sm">
      <SidebarHeader className="border-b border-slate-200/60 p-6 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-blue-600/20">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
              Demo Tracker
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Knowledge Sharing Platform</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4 bg-gradient-to-b from-white to-slate-50/30">
        <SidebarMenu className="space-y-2">
          {menuItems.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton
                onClick={() => navigate(item.href)}
                isActive={location.pathname === item.href}
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
                  <span className="font-medium">{item.label}</span>
                </div>
                {location.pathname === item.href && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-xl" />
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator className="mx-4 bg-slate-200/60" />

      <SidebarFooter className="p-4 bg-gradient-to-t from-slate-50/50 to-white">
        <div className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200/60 shadow-sm">
          <Avatar className="h-11 w-11 border-2 border-white shadow-md ring-1 ring-slate-200/50">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-sm">
              {user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize font-medium mt-0.5">{user?.role}</p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="w-full mt-3 border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all duration-200 font-medium"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
