
import { useTheme } from '../contexts/ThemeContext';

export const useSidebar = () => {
  const { appearance, updateAppearance } = useTheme();
  
  const toggleSidebar = () => {
    updateAppearance('sidebarCollapsed', !appearance.sidebarCollapsed);
  };

  const setSidebarCollapsed = (collapsed: boolean) => {
    updateAppearance('sidebarCollapsed', collapsed);
  };

  return {
    isCollapsed: appearance.sidebarCollapsed,
    toggleSidebar,
    setSidebarCollapsed,
  };
};
