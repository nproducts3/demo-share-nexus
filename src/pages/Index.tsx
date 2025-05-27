
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoginForm } from '../components/LoginForm';
import { AdminDashboard } from '../components/AdminDashboard';
import { EmployeeDashboard } from '../components/EmployeeDashboard';
import { Layout } from '../components/Layout';

const Index = () => {
  const { user, isLoading } = useAuth();

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

  if (!user) {
    return <LoginForm />;
  }

  return (
    <Layout>
      {user.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />}
    </Layout>
  );
};

export default Index;
