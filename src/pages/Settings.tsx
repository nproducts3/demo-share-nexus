
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Database,
  Key,
  Mail,
  Globe,
  Trash2,
  Plus,
  Edit,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  Copy,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  joinedDate: string;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  created: string;
  lastUsed: string;
  isActive: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  company: string;
  timezone: string;
  language: string;
  avatar?: string;
  phone?: string;
  department?: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
  smsNotifications: boolean;
  desktopNotifications: boolean;
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  colorScheme: 'blue' | 'green' | 'purple' | 'orange';
  fontSize: 'sm' | 'md' | 'lg';
  sidebarCollapsed: boolean;
}

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  // Load data from localStorage or use defaults
  const [formData, setFormData] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : {
      name: 'John Doe',
      email: 'john.doe@company.com',
      company: 'Demo Corp',
      timezone: 'America/New_York',
      language: 'en',
      phone: '+1 (555) 123-4567',
      department: 'Engineering'
    };
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('teamMembers');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@company.com',
        role: 'Admin',
        status: 'active',
        lastLogin: '2 hours ago',
        joinedDate: '2024-01-15'
      },
      {
        id: '2',
        name: 'Mike Chen',
        email: 'mike@company.com',
        role: 'Employee',
        status: 'active',
        lastLogin: '1 day ago',
        joinedDate: '2024-02-01'
      },
      {
        id: '3',
        name: 'Emma Wilson',
        email: 'emma@company.com',
        role: 'Manager',
        status: 'inactive',
        lastLogin: '1 week ago',
        joinedDate: '2024-01-20'
      }
    ];
  });

  const [apiKeys, setApiKeys] = useState<ApiKey[]>(() => {
    const saved = localStorage.getItem('apiKeys');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        name: 'Production API',
        key: 'dk_live_1234567890abcdef',
        permissions: ['read', 'write'],
        created: '2024-01-15',
        lastUsed: '2 hours ago',
        isActive: true
      },
      {
        id: '2',
        name: 'Development API',
        key: 'dk_test_0987654321fedcba',
        permissions: ['read'],
        created: '2024-01-10',
        lastUsed: '1 day ago',
        isActive: true
      }
    ];
  });

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

  const [appearance, setAppearance] = useState<AppearanceSettings>(() => {
    const saved = localStorage.getItem('appearanceSettings');
    return saved ? JSON.parse(saved) : {
      theme: 'light',
      colorScheme: 'blue',
      fontSize: 'md',
      sidebarCollapsed: false,
    };
  });

  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'Employee',
    department: ''
  });

  const [newApiKey, setNewApiKey] = useState({
    name: '',
    permissions: [] as string[],
  });

  const [showNewMemberForm, setShowNewMemberForm] = useState(false);
  const [showNewApiKeyForm, setShowNewApiKeyForm] = useState(false);
  const [editingMember, setEditingMember] = useState<string | null>(null);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
  }, [apiKeys]);

  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('appearanceSettings', JSON.stringify(appearance));
  }, [appearance]);

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleAddTeamMember = () => {
    if (!newMember.name || !newMember.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate email
    if (teamMembers.find(member => member.email === newMember.email)) {
      toast({
        title: "Error",
        description: "A team member with this email already exists.",
        variant: "destructive"
      });
      return;
    }

    const member: TeamMember = {
      id: Date.now().toString(),
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      status: 'active',
      lastLogin: 'Never',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setTeamMembers([...teamMembers, member]);
    setNewMember({ name: '', email: '', role: 'Employee', department: '' });
    setShowNewMemberForm(false);
    
    toast({
      title: "Team Member Added",
      description: `${member.name} has been added to your team.`,
    });
  };

  const handleUpdateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id ? { ...member, ...updates } : member
    ));
    setEditingMember(null);
    toast({
      title: "Team Member Updated",
      description: "Team member information has been updated.",
    });
  };

  const handleRemoveTeamMember = (id: string) => {
    const member = teamMembers.find(m => m.id === id);
    setTeamMembers(teamMembers.filter(member => member.id !== id));
    toast({
      title: "Team Member Removed",
      description: `${member?.name} has been removed from your team.`,
    });
  };

  const handleToggleMemberStatus = (id: string) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id 
        ? { ...member, status: member.status === 'active' ? 'inactive' : 'active' }
        : member
    ));
    toast({
      title: "Status Updated",
      description: "Team member status has been updated.",
    });
  };

  const handleAddApiKey = () => {
    if (!newApiKey.name || newApiKey.permissions.length === 0) {
      toast({
        title: "Error",
        description: "Please provide a name and select at least one permission.",
        variant: "destructive"
      });
      return;
    }

    const apiKey: ApiKey = {
      id: Date.now().toString(),
      name: newApiKey.name,
      key: `dk_${Math.random().toString(36).substr(2, 20)}`,
      permissions: newApiKey.permissions,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      isActive: true
    };

    setApiKeys([...apiKeys, apiKey]);
    setNewApiKey({ name: '', permissions: [] });
    setShowNewApiKeyForm(false);
    
    toast({
      title: "API Key Created",
      description: "New API key has been generated successfully.",
    });
  };

  const handleRevokeApiKey = (id: string) => {
    const key = apiKeys.find(k => k.id === id);
    setApiKeys(apiKeys.map(key => 
      key.id === id ? { ...key, isActive: false } : key
    ));
    toast({
      title: "API Key Revoked",
      description: `${key?.name} has been revoked and is no longer valid.`,
    });
  };

  const handleDeleteApiKey = (id: string) => {
    const key = apiKeys.find(k => k.id === id);
    setApiKeys(apiKeys.filter(key => key.id !== id));
    toast({
      title: "API Key Deleted",
      description: `${key?.name} has been permanently deleted.`,
    });
  };

  const handleCopyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied to Clipboard",
      description: "API key has been copied to your clipboard.",
    });
  };

  const togglePermission = (permission: string) => {
    setNewApiKey(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Notification Updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}.`,
    });
  };

  const handleAppearanceChange = (key: keyof AppearanceSettings, value: any) => {
    setAppearance(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Appearance Updated",
      description: `${key} has been updated.`,
    });
  };

  const handleExportData = () => {
    const data = {
      profile: formData,
      teamMembers,
      apiKeys: apiKeys.map(key => ({ ...key, key: '***HIDDEN***' })), // Hide actual keys
      notifications,
      appearance,
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
    // In a real app, this would make an API call
    localStorage.clear();
    toast({
      title: "Account Deletion Requested",
      description: "Your account deletion request has been submitted.",
      variant: "destructive"
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-slate-600 mt-2">
            Manage your account, team, and application preferences
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white border border-slate-200 p-1 rounded-xl">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
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
            <TabsTrigger value="appearance" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span>Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>Advanced</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Profile Settings
                  </div>
                  <Button
                    variant={isEditing ? "outline" : "default"}
                    size="sm"
                    onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                  >
                    {isEditing ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </CardTitle>
                <CardDescription>
                  Manage your personal information and account settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={formData.department || ''}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select
                      id="timezone"
                      value={formData.timezone}
                      onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white disabled:bg-gray-50"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Paris">Paris (CET)</option>
                      <option value="Asia/Tokyo">Tokyo (JST)</option>
                    </select>
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-600" />
                    Team Management ({teamMembers.length} members)
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowNewMemberForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </CardTitle>
                <CardDescription>
                  Manage your team members and their permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {showNewMemberForm && (
                  <Card className="mb-6 border border-blue-200 bg-blue-50/50">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-name">Name *</Label>
                          <Input
                            id="new-name"
                            value={newMember.name}
                            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                            placeholder="Enter full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-email">Email *</Label>
                          <Input
                            id="new-email"
                            type="email"
                            value={newMember.email}
                            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                            placeholder="Enter email address"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-role">Role</Label>
                          <select
                            id="new-role"
                            value={newMember.role}
                            onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
                          >
                            <option value="Employee">Employee</option>
                            <option value="Manager">Manager</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowNewMemberForm(false)}
                        >
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleAddTeamMember}>
                          Add Member
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 rounded-lg bg-white border border-slate-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{member.name}</p>
                          <p className="text-sm text-slate-600">{member.email}</p>
                          <p className="text-xs text-slate-500">Joined: {member.joinedDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge 
                          variant={member.status === 'active' ? 'default' : 'secondary'}
                          className="cursor-pointer"
                          onClick={() => handleToggleMemberStatus(member.id)}
                        >
                          {member.status}
                        </Badge>
                        <Badge variant="outline">{member.role}</Badge>
                        <span className="text-sm text-slate-500 min-w-[80px]">{member.lastLogin}</span>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingMember(editingMember === member.id ? null : member.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveTeamMember(member.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
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
                        {key === 'emailNotifications' && 'Receive notifications via email'}
                        {key === 'pushNotifications' && 'Get push notifications in your browser'}
                        {key === 'weeklyReports' && 'Weekly summary of your activity'}
                        {key === 'securityAlerts' && 'Important security-related notifications'}
                        {key === 'marketingEmails' && 'Product updates and marketing content'}
                        {key === 'smsNotifications' && 'SMS notifications for urgent alerts'}
                        {key === 'desktopNotifications' && 'Desktop notifications when app is closed'}
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
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Key className="h-5 w-5 mr-2 text-purple-600" />
                    API Keys ({apiKeys.filter(k => k.isActive).length} active)
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowNewApiKeyForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Key
                  </Button>
                </CardTitle>
                <CardDescription>
                  Manage API keys for external integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {showNewApiKeyForm && (
                  <Card className="mb-6 border border-purple-200 bg-purple-50/50">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="api-name">Key Name *</Label>
                          <Input
                            id="api-name"
                            value={newApiKey.name}
                            onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
                            placeholder="Enter a descriptive name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Permissions *</Label>
                          <div className="flex flex-wrap gap-2">
                            {['read', 'write', 'delete', 'admin'].map((permission) => (
                              <Button
                                key={permission}
                                variant={newApiKey.permissions.includes(permission) ? "default" : "outline"}
                                size="sm"
                                onClick={() => togglePermission(permission)}
                              >
                                {permission}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowNewApiKeyForm(false)}
                        >
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleAddApiKey}>
                          Generate Key
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="flex items-center justify-between p-4 rounded-lg bg-white border border-slate-200">
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-slate-900">{apiKey.name}</p>
                          {!apiKey.isActive && <Badge variant="secondary">Revoked</Badge>}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-sm text-slate-600 font-mono">{apiKey.key}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyApiKey(apiKey.key)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex space-x-2 mt-2">
                          {apiKey.permissions.map((permission) => (
                            <Badge key={permission} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600">Created: {apiKey.created}</p>
                        <p className="text-sm text-slate-600">Last used: {apiKey.lastUsed}</p>
                        <div className="flex space-x-2 mt-2">
                          {apiKey.isActive && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRevokeApiKey(apiKey.id)}
                            >
                              Revoke
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteApiKey(apiKey.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
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
                            appearance.colorScheme === color ? 'border-slate-800' : 'border-transparent'
                          } hover:border-slate-300`}
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
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced">
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
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
