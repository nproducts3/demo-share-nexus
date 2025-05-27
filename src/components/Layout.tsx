
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';
import { SidebarInset } from '@/components/ui/sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <>
      <AppSidebar />
      <SidebarInset className="flex-1">
        <Header />
        <main className="flex-1 p-6 bg-gradient-to-br from-slate-50/50 to-white">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </SidebarInset>
    </>
  );
};
