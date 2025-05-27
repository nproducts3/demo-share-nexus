
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const { appearance, isDark } = useTheme();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider defaultOpen={!appearance.sidebarCollapsed}>
      <div className={cn(
        "min-h-screen flex w-full transition-all duration-300",
        isDark ? "dark" : ""
      )}>
        <AppSidebar />
        <SidebarInset className="flex-1">
          <Header />
          <main className={cn(
            "flex-1 p-6 bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800",
            "transition-all duration-300"
          )}>
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
