
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { NotificationSettings } from '../../types/settings';

export const NotificationsTab = () => {
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? JSON.parse(saved) : {
      emailNotifications: true,
      pushNotifications: false,
      weeklyReports: true,
      securityAlerts: true,
      marketingEmails: false,
      smsNotifications: false,
      desktopNotifications: true,
    };
  });

  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(notifications));
  }, [notifications]);

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Notification Updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}.`,
    });
  };

  const notificationDescriptions = {
    emailNotifications: 'Receive notifications via email',
    pushNotifications: 'Get push notifications in your browser',
    weeklyReports: 'Weekly summary of your activity',
    securityAlerts: 'Important security-related notifications',
    marketingEmails: 'Product updates and marketing content',
    smsNotifications: 'SMS notifications for urgent alerts',
    desktopNotifications: 'Desktop notifications when app is closed'
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="h-5 w-5 mr-2 text-orange-600" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Configure how you want to receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <p className="font-medium capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </p>
              <p className="text-sm text-slate-600">
                {notificationDescriptions[key as keyof NotificationSettings]}
              </p>
            </div>
            <Switch
              checked={value}
              onCheckedChange={(checked) =>
                handleNotificationChange(key as keyof NotificationSettings, checked)
              }
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
