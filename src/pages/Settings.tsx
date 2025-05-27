
import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Users, Bell, Key, Save, Shield, Mail, Phone, Building, User2, Edit, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Layout } from '../components/Layout';
import { useAdmin } from '../contexts/AdminContext';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { adminProfile, updateAdminProfile } = useAdmin();
  const { toast } = useToast();
  
  // Edit mode states for each tab
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [isEditingNotifications, setIsEditingNotifications] = useState(false);
  const [isEditingAdvanced, setIsEditingAdvanced] = useState(false);
  
  // Local state for form inputs
  const [profileForm, setProfileForm] = useState(adminProfile);
  const [originalProfileForm, setOriginalProfileForm] = useState(adminProfile);

  const [teamSettings, setTeamSettings] = useState({
    maxSessionsPerDay: '10',
    autoApproveRegistrations: true,
    requireManagerApproval: false,
    sessionReminderHours: '24'
  });
  const [originalTeamSettings, setOriginalTeamSettings] = useState({
    maxSessionsPerDay: '10',
    autoApproveRegistrations: true,
    requireManagerApproval: false,
    sessionReminderHours: '24'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    sessionReminders: true,
    weeklyReports: false,
    marketingEmails: false
  });
  const [originalNotificationSettings, setOriginalNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    sessionReminders: true,
    weeklyReports: false,
    marketingEmails: false
  });

  const [apiKeys] = useState([
    { id: '1', name: 'Production API', key: 'sk-***************8392', created: '2024-01-15', lastUsed: '2024-01-12' },
    { id: '2', name: 'Development API', key: 'sk-***************2847', created: '2024-01-20', lastUsed: '2024-01-11' }
  ]);

  const [advancedSettings, setAdvancedSettings] = useState({
    sessionTimeout: '30',
    maxFileSize: '10',
    enableDebugMode: false,
    autoBackup: true,
    maintenanceMode: false
  });
  const [originalAdvancedSettings, setOriginalAdvancedSettings] = useState({
    sessionTimeout: '30',
    maxFileSize: '10',
    enableDebugMode: false,
    autoBackup: true,
    maintenanceMode: false
  });

  const handleProfileEdit = () => {
    setIsEditingProfile(true);
    setOriginalProfileForm({ ...profileForm });
  };

  const handleProfileCancel = () => {
    setProfileForm({ ...originalProfileForm });
    setIsEditingProfile(false);
  };

  const handleProfileSave = () => {
    updateAdminProfile(profileForm);
    setIsEditingProfile(false);
    toast({
      title: "Profile Updated",
      description: "Your profile settings have been saved and are now reflected throughout the application.",
    });
  };

  const handleTeamEdit = () => {
    setIsEditingTeam(true);
    setOriginalTeamSettings({ ...teamSettings });
  };

  const handleTeamCancel = () => {
    setTeamSettings({ ...originalTeamSettings });
    setIsEditingTeam(false);
  };

  const handleTeamSave = () => {
    setIsEditingTeam(false);
    toast({
      title: "Team Settings Saved",
      description: "Team management settings have been updated successfully.",
    });
  };

  const handleNotificationEdit = () => {
    setIsEditingNotifications(true);
    setOriginalNotificationSettings({ ...notificationSettings });
  };

  const handleNotificationCancel = () => {
    setNotificationSettings({ ...originalNotificationSettings });
    setIsEditingNotifications(false);
  };

  const handleNotificationSave = () => {
    setIsEditingNotifications(false);
    toast({
      title: "Notification Settings Saved", 
      description: "Your notification preferences have been updated.",
    });
  };

  const handleAdvancedEdit = () => {
    setIsEditingAdvanced(true);
    setOriginalAdvancedSettings({ ...advancedSettings });
  };

  const handleAdvancedCancel = () => {
    setAdvancedSettings({ ...originalAdvancedSettings });
    setIsEditingAdvanced(false);
  };

  const handleAdvancedSave = () => {
    setIsEditingAdvanced(false);
    toast({
      title: "Advanced Settings Saved",
      description: "System settings have been updated successfully.",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your application preferences and configurations</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Team</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center space-x-2">
              <Key className="h-4 w-4" />
              <span>API Keys</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center space-x-2">
              <SettingsIcon className="h-4 w-4" />
              <span>Advanced</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      <User2 className="h-5 w-5 mr-2" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal information and profile settings
                    </CardDescription>
                  </div>
                  {!isEditingProfile ? (
                    <Button onClick={handleProfileEdit} variant="outline" className="flex items-center space-x-2">
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button onClick={handleProfileCancel} variant="outline" className="flex items-center space-x-2">
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </Button>
                      <Button onClick={handleProfileSave} className="flex items-center space-x-2">
                        <Save className="h-4 w-4" />
                        <span>Save</span>
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      readOnly={!isEditingProfile}
                      className={!isEditingProfile ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                        className={`pl-10 ${!isEditingProfile ? "bg-gray-50" : ""}`}
                        placeholder="Enter your email"
                        readOnly={!isEditingProfile}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        id="phone"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                        className={`pl-10 ${!isEditingProfile ? "bg-gray-50" : ""}`}
                        placeholder="Enter your phone number"
                        readOnly={!isEditingProfile}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <div className="relative">
                      <Building className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        id="department"
                        value={profileForm.department}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, department: e.target.value }))}
                        className={`pl-10 ${!isEditingProfile ? "bg-gray-50" : ""}`}
                        placeholder="Enter your department"
                        readOnly={!isEditingProfile}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={profileForm.company}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Enter your company name"
                      readOnly={!isEditingProfile}
                      className={!isEditingProfile ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                      rows={3}
                      readOnly={!isEditingProfile}
                      className={!isEditingProfile ? "bg-gray-50" : ""}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Team Management
                    </CardTitle>
                    <CardDescription>
                      Configure team-wide settings and policies
                    </CardDescription>
                  </div>
                  {!isEditingTeam ? (
                    <Button onClick={handleTeamEdit} variant="outline" className="flex items-center space-x-2">
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button onClick={handleTeamCancel} variant="outline" className="flex items-center space-x-2">
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </Button>
                      <Button onClick={handleTeamSave} className="flex items-center space-x-2">
                        <Save className="h-4 w-4" />
                        <span>Save</span>
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="maxSessions">Max Sessions Per Day</Label>
                    <Input
                      id="maxSessions"
                      type="number"
                      value={teamSettings.maxSessionsPerDay}
                      onChange={(e) => setTeamSettings(prev => ({ ...prev, maxSessionsPerDay: e.target.value }))}
                      readOnly={!isEditingTeam}
                      className={!isEditingTeam ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reminderHours">Session Reminder (Hours)</Label>
                    <Input
                      id="reminderHours"
                      type="number"
                      value={teamSettings.sessionReminderHours}
                      onChange={(e) => setTeamSettings(prev => ({ ...prev, sessionReminderHours: e.target.value }))}
                      readOnly={!isEditingTeam}
                      className={!isEditingTeam ? "bg-gray-50" : ""}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-approve Registrations</Label>
                      <p className="text-sm text-gray-500">Automatically approve new user registrations</p>
                    </div>
                    <Switch
                      checked={teamSettings.autoApproveRegistrations}
                      onCheckedChange={(checked) => setTeamSettings(prev => ({ ...prev, autoApproveRegistrations: checked }))}
                      disabled={!isEditingTeam}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Manager Approval</Label>
                      <p className="text-sm text-gray-500">Require manager approval for session creation</p>
                    </div>
                    <Switch
                      checked={teamSettings.requireManagerApproval}
                      onCheckedChange={(checked) => setTeamSettings(prev => ({ ...prev, requireManagerApproval: checked }))}
                      disabled={!isEditingTeam}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      <Bell className="h-5 w-5 mr-2" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription>
                      Manage how you receive notifications and updates
                    </CardDescription>
                  </div>
                  {!isEditingNotifications ? (
                    <Button onClick={handleNotificationEdit} variant="outline" className="flex items-center space-x-2">
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button onClick={handleNotificationCancel} variant="outline" className="flex items-center space-x-2">
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </Button>
                      <Button onClick={handleNotificationSave} className="flex items-center space-x-2">
                        <Save className="h-4 w-4" />
                        <span>Save</span>
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                        <p className="text-sm text-gray-500">
                          {key === 'emailNotifications' && 'Receive notifications via email'}
                          {key === 'pushNotifications' && 'Receive push notifications in browser'}
                          {key === 'sessionReminders' && 'Get reminded about upcoming sessions'}
                          {key === 'weeklyReports' && 'Receive weekly analytics reports'}
                          {key === 'marketingEmails' && 'Receive product updates and news'}
                        </p>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, [key]: checked }))}
                        disabled={!isEditingNotifications}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  API Keys
                </CardTitle>
                <CardDescription>
                  Manage your API keys for external integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {apiKeys.map((key) => (
                    <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{key.name}</div>
                        <div className="text-sm text-gray-500 font-mono">{key.key}</div>
                        <div className="text-xs text-gray-400">
                          Created: {new Date(key.created).toLocaleDateString()} • 
                          Last used: {new Date(key.lastUsed).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Regenerate</Button>
                        <Button variant="outline" size="sm" className="text-red-600">Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button>Generate New API Key</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Advanced Settings
                    </CardTitle>
                    <CardDescription>
                      Configure advanced system settings and preferences
                    </CardDescription>
                  </div>
                  {!isEditingAdvanced ? (
                    <Button onClick={handleAdvancedEdit} variant="outline" className="flex items-center space-x-2">
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button onClick={handleAdvancedCancel} variant="outline" className="flex items-center space-x-2">
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </Button>
                      <Button onClick={handleAdvancedSave} className="flex items-center space-x-2">
                        <Save className="h-4 w-4" />
                        <span>Save</span>
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={advancedSettings.sessionTimeout}
                      onChange={(e) => setAdvancedSettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                      readOnly={!isEditingAdvanced}
                      className={!isEditingAdvanced ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      value={advancedSettings.maxFileSize}
                      onChange={(e) => setAdvancedSettings(prev => ({ ...prev, maxFileSize: e.target.value }))}
                      readOnly={!isEditingAdvanced}
                      className={!isEditingAdvanced ? "bg-gray-50" : ""}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Debug Mode</Label>
                      <p className="text-sm text-gray-500">Enable debug logging and developer tools</p>
                    </div>
                    <Switch
                      checked={advancedSettings.enableDebugMode}
                      onCheckedChange={(checked) => setAdvancedSettings(prev => ({ ...prev, enableDebugMode: checked }))}
                      disabled={!isEditingAdvanced}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto Backup</Label>
                      <p className="text-sm text-gray-500">Automatically backup data daily</p>
                    </div>
                    <Switch
                      checked={advancedSettings.autoBackup}
                      onCheckedChange={(checked) => setAdvancedSettings(prev => ({ ...prev, autoBackup: checked }))}
                      disabled={!isEditingAdvanced}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-gray-500">Put the application in maintenance mode</p>
                    </div>
                    <Switch
                      checked={advancedSettings.maintenanceMode}
                      onCheckedChange={(checked) => setAdvancedSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                      disabled={!isEditingAdvanced}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
