import { useContext } from 'react';
import { AdminContext } from '../contexts/admin-context';

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}; 