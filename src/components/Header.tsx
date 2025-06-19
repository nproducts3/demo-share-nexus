
import React, { useState } from 'react';
import { Bell, Settings, LogOut, User, Search, Users, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../hooks/use-auth';
import { useNotifications } from '../contexts/NotificationsContext';
import { useNavigate } from 'react-router-dom';

// Define navigation items
const navigationItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Demo Sessions', href: '/demo-sessions' },
  { label: 'User Management', href: '/user-management' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'My Sessions', href: '/my-sessions' },
  { label: 'My Progress', href: '/my-progress' },
  { label: 'Settings', href: '/settings' },
  { label: 'Profile Settings', href: '/settings/profile' },
  { label: 'Team Settings', href: '/settings/team' },
  { label: 'Notification Settings', href: '/settings/notifications' },
  { label: 'API Keys', href: '/settings/api-keys' },
  { label: 'Advanced Settings', href: '/settings/advanced' },
];

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter navigation items based on search term
  const filteredItems = navigationItems.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle navigation
  const handleNavigation = (href: string) => {
    navigate(href);
    setSearchTerm(''); // Clear search after navigation
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center justify-between px-6 lg:px-8">
        {/* Search Bar */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search navigation..."
              className="pl-10 w-full bg-slate-50/50 border-slate-200 focus:bg-white focus:border-blue-300 transition-all duration-200 placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Navigation Items */}
            {searchTerm && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg">
                <div className="py-1">
                  <div className="flex flex-col">
                    {filteredItems.map((item) => (
                      <Button
                        key={item.href}
                        variant="ghost"
                        className="w-full justify-start text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-3 py-2"
                        onClick={() => handleNavigation(item.href)}
                      >
                        {item.label}
                      </Button>
                    ))}
                    {filteredItems.length === 0 && (
                      <div className="text-sm text-slate-500 py-2 px-3">No results found</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Actions - Moved to bottom right */}
        <div className="fixed bottom-4 right-4 flex items-center space-x-3 bg-white/95 backdrop-blur border border-slate-200 rounded-lg p-2 shadow-lg">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="relative h-9 w-9 rounded-full hover:bg-slate-100 transition-colors duration-200"
              onClick={() => navigate('/notifications')}
            >
              <Bell className="h-5 w-5 text-slate-600" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-500 border-2 border-white">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border border-slate-200 shadow-lg">
              <DropdownMenuLabel className="text-slate-900 font-semibold">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-200" />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Settings className="mr-3 h-4 w-4 text-slate-500" />
                  <span>Settings</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => navigate('/settings/profile')}>
                    <User className="mr-3 h-4 w-4 text-slate-500" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings/team')}>
                    <Users className="mr-3 h-4 w-4 text-slate-500" />
                    <span>Team</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings/notifications')}>
                    <Bell className="mr-3 h-4 w-4 text-slate-500" />
                    <span>Notifications</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings/api-keys')}>
                    <Key className="mr-3 h-4 w-4 text-slate-500" />
                    <span>API Keys</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings/advanced')}>
                    <Settings className="mr-3 h-4 w-4 text-slate-500" />
                    <span>Advanced</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator className="bg-slate-200" />
              <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                <LogOut className="mr-3 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
