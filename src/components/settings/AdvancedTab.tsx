
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Database, CheckCircle, Download, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AdvancedTab = () => {
  const { toast } = useToast();

  const handleExportData = () => {
    const data = {
      profile: JSON.parse(localStorage.getItem('userProfile') || '{}'),
      teamMembers: JSON.parse(localStorage.getItem('teamMembers') || '[]'),
      apiKeys: JSON.parse(localStorage.getItem('apiKeys') || '[]').map((key: any) => ({ ...key, key: '***HIDDEN***' })),
      notifications: JSON.parse(localStorage.getItem('notificationSettings') || '{}'),
      appearance: JSON.parse(localStorage.getItem('appearanceSettings') || '{}'),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `settings-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: "Your data has been exported successfully.",
    });
  };

  const handleDeleteAccount = () => {
    localStorage.clear();
    toast({
      title: "Account Deletion Requested",
      description: "Your account deletion request has been submitted.",
      variant: "destructive"
    });
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 mr-2 text-red-600" />
          Advanced Settings
        </CardTitle>
        <CardDescription>
          Dangerous settings that can affect your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
            <div>
              <h4 className="font-medium text-green-900">Data Management</h4>
              <p className="text-sm text-green-700">
                Export your data or manage your account information.
              </p>
            </div>
          </div>
          
          <Separator className="my-4 bg-green-200" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-green-900">Export Data</p>
                <p className="text-sm text-green-700">Download all your data in JSON format</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
            <div>
              <h4 className="font-medium text-red-900">Danger Zone</h4>
              <p className="text-sm text-red-700">
                These actions are irreversible and will permanently affect your account.
              </p>
            </div>
          </div>
          
          <Separator className="my-4 bg-red-200" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-900">Delete Account</p>
                <p className="text-sm text-red-700">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
