
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AdminProfile {
  name: string;
  email: string;
  phone: string;
  department: string;
  company: string;
  bio: string;
}

interface AdminContextType {
  adminProfile: AdminProfile;
  updateAdminProfile: (updates: Partial<AdminProfile>) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [adminProfile, setAdminProfile] = useState<AdminProfile>({
    name: 'John Admin',
    email: 'admin@demo.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    company: 'Demo Corp',
    bio: 'Experienced admin managing demo sessions and user operations.'
  });

  const updateAdminProfile = (updates: Partial<AdminProfile>) => {
    setAdminProfile(prev => ({ ...prev, ...updates }));
  };

  return (
    <AdminContext.Provider value={{ adminProfile, updateAdminProfile }}>
      {children}
    </AdminContext.Provider>
  );
};
