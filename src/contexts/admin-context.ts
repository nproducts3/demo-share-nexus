import { createContext } from 'react';

interface AdminProfile {
  id?: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  company: string;
  bio: string;
}

interface AdminContextType {
  adminProfile: AdminProfile;
  updateAdminProfile: (updates: Partial<AdminProfile>) => Promise<void>;
  isLoading: boolean;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined); 