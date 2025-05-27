
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useNotifications } from '../contexts/NotificationsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Bell, Search, Filter, Archive, Trash2, CheckCheck, Settings, Download, Star, Clock, AlertCircle, CheckCircle, Info, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Notifications = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAllNotifications } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    desktopNotifications: true,
    marketingEmails: false,
    securityAlerts: true,
    systemUpdates: true,
    dailyDigest: true,
  });

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'read' && notification.read) ||
                         (filterStatus === 'unread' && !notification.read);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    const iconClass = "h-5 w-5";
    switch (type) {
      case 'success': return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'warning': return <AlertCircle className={`${iconClass} text-yellow-500`} />;
      case 'error': return <AlertCircle className={`${iconClass} text-red-500`} />;
      default: return <Info className={`${iconClass} text-blue-500`} />;
    }
  };

  const handleSelectNotification = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const handleBulkDelete = () => {
    selectedNotifications.forEach(id => deleteNotification(id));
    setSelectedNotifications([]);
    toast({
      title: "Notifications deleted",
      description: `${selectedNotifications.length} notifications have been deleted`,
    });
  };

  const handleBulkMarkAsRead = () => {
    selectedNotifications.forEach(id => markAsRead(id));
    setSelectedNotifications([]);
    toast({
      title: "Notifications marked as read",
      description: `${selectedNotifications.length} notifications have been marked as read`,
    });
  };

  const handleExportNotifications = () => {
    const exportData = JSON.stringify(filteredNotifications, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notifications-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export successful",
      description: "Notifications have been exported to JSON file",
    });
  };

  const updateNotificationSetting = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Setting updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`,
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Notifications
            </h1>
            <p className="text-slate-600 mt-1">
              Manage and customize your notification preferences
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-sm">
              {unreadCount} unread
            </Badge>
            <Button variant="outline" onClick={handleExportNotifications}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="inbox" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inbox" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Inbox</span>
            </TabsTrigger>
            <TabsTrigger value="archived" className="flex items-center space-x-2">
              <Archive className="h-4 w-4" />
              <span>Archived</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inbox" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Search notifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="unread">Unread</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedNotifications.length > 0 && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-900">
                      {selectedNotifications.length} notification{selectedNotifications.length !== 1 ? 's' : ''} selected
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={handleBulkMarkAsRead}>
                        <CheckCheck className="h-4 w-4 mr-2" />
                        Mark as Read
                      </Button>
                      <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedNotifications.length === filteredNotifications.length ? 'Deselect All' : 'Select All'}
                </Button>
                {unreadCount > 0 && (
                  <Button variant="outline" size="sm" onClick={markAllAsRead}>
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Mark All as Read
                  </Button>
                )}
              </div>
              <Button variant="destructive" size="sm" onClick={clearAllNotifications}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
              {filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="pt-12 pb-12 text-center">
                    <Bell className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No notifications found</h3>
                    <p className="text-slate-500">
                      {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                        ? 'Try adjusting your filters or search terms'
                        : 'You\'re all caught up! New notifications will appear here.'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                    } ${selectedNotifications.includes(notification.id) ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedNotifications.includes(notification.id)}
                            onChange={() => handleSelectNotification(notification.id)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-shrink-0">
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <h3 className={`font-medium ${!notification.read ? 'text-slate-900' : 'text-slate-700'}`}>
                                {notification.title}
                              </h3>
                              <Badge variant={notification.type === 'error' ? 'destructive' : 'secondary'} className="text-xs">
                                {notification.type}
                              </Badge>
                              {!notification.read && (
                                <Badge variant="default" className="text-xs">
                                  New
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-slate-500 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatTimestamp(new Date(notification.timestamp))}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            {notification.actionUrl && (
                              <Button variant="link" size="sm" className="p-0 h-auto text-blue-600">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View Details
                              </Button>
                            )}
                            {!notification.read && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                              >
                                Mark as Read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="archived" className="space-y-6">
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <Archive className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No archived notifications</h3>
                <p className="text-slate-500">Archived notifications will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose how you want to receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Email Notifications</Label>
                        <p className="text-sm text-slate-500">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => updateNotificationSetting('emailNotifications', checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Push Notifications</Label>
                        <p className="text-sm text-slate-500">Receive push notifications in your browser</p>
                      </div>
                      <Switch
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) => updateNotificationSetting('pushNotifications', checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">SMS Notifications</Label>
                        <p className="text-sm text-slate-500">Receive notifications via SMS</p>
                      </div>
                      <Switch
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked) => updateNotificationSetting('smsNotifications', checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Desktop Notifications</Label>
                        <p className="text-sm text-slate-500">Show desktop notifications</p>
                      </div>
                      <Switch
                        checked={notificationSettings.desktopNotifications}
                        onCheckedChange={(checked) => updateNotificationSetting('desktopNotifications', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Categories</CardTitle>
                  <CardDescription>
                    Control which types of notifications you receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Security Alerts</Label>
                        <p className="text-sm text-slate-500">Important security-related notifications</p>
                      </div>
                      <Switch
                        checked={notificationSettings.securityAlerts}
                        onCheckedChange={(checked) => updateNotificationSetting('securityAlerts', checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">System Updates</Label>
                        <p className="text-sm text-slate-500">Notifications about system maintenance and updates</p>
                      </div>
                      <Switch
                        checked={notificationSettings.systemUpdates}
                        onCheckedChange={(checked) => updateNotificationSetting('systemUpdates', checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Marketing Emails</Label>
                        <p className="text-sm text-slate-500">Promotional and marketing content</p>
                      </div>
                      <Switch
                        checked={notificationSettings.marketingEmails}
                        onCheckedChange={(checked) => updateNotificationSetting('marketingEmails', checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Daily Digest</Label>
                        <p className="text-sm text-slate-500">Daily summary of your notifications</p>
                      </div>
                      <Switch
                        checked={notificationSettings.dailyDigest}
                        onCheckedChange={(checked) => updateNotificationSetting('dailyDigest', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Notifications;
