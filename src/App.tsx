
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { Toaster } from '@/components/ui/toaster';
import Index from './pages/Index';
import DemoSessions from './pages/DemoSessions';
import UserManagement from './pages/UserManagement';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import MySessions from './pages/MySessions';
import MyProgress from './pages/MyProgress';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <NotificationsProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/demo-sessions" element={<DemoSessions />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/my-sessions" element={<MySessions />} />
                <Route path="/my-progress" element={<MyProgress />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </NotificationsProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
