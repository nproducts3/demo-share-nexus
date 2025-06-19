
import React from 'react';
import { useAuth } from '../hooks/use-auth';
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

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
      <SidebarInset className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30 min-h-0 sticky top-16">
          <div className="h-full p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto h-full">
              {children}
            </div>
          </div>
        </main>
      </SidebarInset>
    </>
  );
};
