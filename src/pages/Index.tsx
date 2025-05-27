
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoginForm } from '../components/LoginForm';
import { LandingPage } from '../components/LandingPage';
import { AdminDashboard } from '../components/AdminDashboard';
import { EmployeeDashboard } from '../components/EmployeeDashboard';
import { Layout } from '../components/Layout';

const Index = () => {
  const { user, isLoading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, show landing page or login form
  if (!user) {
    if (showLogin) {
      return <LoginForm onBackToLanding={() => setShowLogin(false)} />;
    }
    return <LandingPage onLoginClick={() => setShowLogin(true)} />;
  }

  // If user is logged in, show the appropriate dashboard
  return (
    <Layout>
      {user.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />}
    </Layout>
  );
};

export default Index;
