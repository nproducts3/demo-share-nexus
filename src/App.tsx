import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { Toaster } from '@/components/ui/toaster';

import Index from './pages/Index';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import UserManagement from './pages/UserManagement';
import DemoSessions from './pages/DemoSessions';
import MySessions from './pages/MySessions';
import MyProgress from './pages/MyProgress';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';

import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <NotificationsProvider>
            <Router>
              <div className="min-h-screen bg-background text-foreground">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/users" element={<UserManagement />} />
                  <Route path="/demo-sessions" element={<DemoSessions />} />
                  <Route path="/my-sessions" element={<MySessions />} />
                  <Route path="/my-progress" element={<MyProgress />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
                <Toaster />
              </div>
            </Router>
          </NotificationsProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
