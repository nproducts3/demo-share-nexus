
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '../../contexts/ThemeContext';

export const AppearanceTab = () => {
  const { toast } = useToast();
  const { appearance, updateAppearance } = useTheme();

  const handleAppearanceChange = (key: keyof typeof appearance, value: any) => {
    updateAppearance(key, value);
    toast({
      title: "Appearance Updated",
      description: `${key} has been updated.`,
    });
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Palette className="h-5 w-5 mr-2 text-pink-600" />
          Appearance Settings
        </CardTitle>
        <CardDescription>
          Customize the look and feel of your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Theme</Label>
            <div className="grid grid-cols-3 gap-2">
              {['light', 'dark', 'system'].map((theme) => (
                <Button
                  key={theme}
                  variant={appearance.theme === theme ? "default" : "outline"}
                  className="justify-start capitalize"
                  onClick={() => handleAppearanceChange('theme', theme)}
                >
                  {theme}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Color Scheme</Label>
            <div className="flex space-x-2">
              {[
                { color: 'blue', bg: 'bg-blue-500' },
                { color: 'green', bg: 'bg-green-500' },
                { color: 'purple', bg: 'bg-purple-500' },
                { color: 'orange', bg: 'bg-orange-500' }
              ].map(({ color, bg }) => (
                <div
                  key={color}
                  className={`w-8 h-8 rounded-full ${bg} cursor-pointer border-2 ${
                    appearance.colorScheme === color ? 'border-slate-800 dark:border-slate-200' : 'border-transparent'
                  } hover:border-slate-300 dark:hover:border-slate-600`}
                  onClick={() => handleAppearanceChange('colorScheme', color)}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Font Size</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { size: 'sm', label: 'Small' },
                { size: 'md', label: 'Medium' },
                { size: 'lg', label: 'Large' }
              ].map(({ size, label }) => (
                <Button
                  key={size}
                  variant={appearance.fontSize === size ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => handleAppearanceChange('fontSize', size)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Sidebar</Label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={!appearance.sidebarCollapsed}
                onCheckedChange={(checked) => handleAppearanceChange('sidebarCollapsed', !checked)}
              />
              <span className="text-sm">Keep sidebar expanded</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
