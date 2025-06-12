import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  Clock,
  Target,
  Activity,
  Download,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import { useQueryClient } from '@tanstack/react-query';

const Analytics = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: analyticsData, isLoading } = useAnalyticsData();

  // Helper functions to calculate changes and trends
  const calculateChange = (current: number, historical: Array<{ activeSessions?: number; admins?: number; employees?: number }>) => {
    if (historical.length < 2) return '0%';
    const previous = historical[historical.length - 2];
    const change = ((current - (previous.activeSessions || previous.admins || previous.employees || 0)) / (previous.activeSessions || previous.admins || previous.employees || 1)) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const calculateTrend = (current: number, historical: Array<{ activeSessions?: number; admins?: number; employees?: number }>) => {
    if (historical.length < 2) return 'neutral';
    const previous = historical[historical.length - 2];
    return current >= (previous.activeSessions || previous.admins || previous.employees || 0) ? 'up' : 'down';
  };

  const calculateTimeChange = (current: string) => {
    // Parse current time string (e.g., "1h 30m" or "45m")
    const [hours, minutes] = current.split('h').map(part => {
      const match = part.match(/(\d+)m/);
      return match ? parseInt(match[1]) : 0;
    });
    const totalMinutes = (hours || 0) * 60 + (minutes || 0);
    
    // For demo purposes, we'll use a simple comparison
    // In a real app, you'd compare with historical data
    return totalMinutes > 60 ? '+5.0%' : '-2.0%';
  };

  const calculateTimeTrend = (current: string) => {
    const [hours, minutes] = current.split('h').map(part => {
      const match = part.match(/(\d+)m/);
      return match ? parseInt(match[1]) : 0;
    });
    const totalMinutes = (hours || 0) * 60 + (minutes || 0);
    return totalMinutes > 60 ? 'up' : 'down';
  };

  const metrics = [
    {
      title: 'Total Sessions',
      value: analyticsData.totalSessions.toString(),
      change: calculateChange(analyticsData.totalSessions, analyticsData.performanceTrends),
      trend: calculateTrend(analyticsData.totalSessions, analyticsData.performanceTrends),
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Users',
      value: analyticsData.activeUsers.toString(),
      change: calculateChange(analyticsData.activeUsers, analyticsData.userEngagement),
      trend: calculateTrend(analyticsData.activeUsers, analyticsData.userEngagement),
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Avg Session Time',
      value: analyticsData.averageSessionTime,
      change: calculateTimeChange(analyticsData.averageSessionTime),
      trend: calculateTimeTrend(analyticsData.averageSessionTime),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Conversion Rate',
      value: `${analyticsData.conversionRate.toFixed(1)}%`,
      change: calculateChange(analyticsData.conversionRate, analyticsData.performanceTrends),
      trend: calculateTrend(analyticsData.conversionRate, analyticsData.performanceTrends),
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const handleRefresh = async () => {
    toast({
      title: "Refreshing Data",
      description: "Updating analytics data...",
    });
    
    await queryClient.invalidateQueries({ queryKey: ['sessions'] });
    await queryClient.invalidateQueries({ queryKey: ['users'] });
    
    toast({
      title: "Data Refreshed",
      description: "Analytics data has been updated successfully.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Exporting Data",
      description: "Exporting analytics data to CSV...",
    });
    
    // Create CSV content based on current data
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Metric,Value\n" +
      `"Total Sessions","${analyticsData.totalSessions}"\n` +
      `"Active Users","${analyticsData.activeUsers}"\n` +
      `"Average Session Time","${analyticsData.averageSessionTime}"\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "analytics_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: "Analytics data exported successfully.",
    });
  };

  const getActivityBadge = (status: string) => {
    const badgeColors: Record<string, string> = {
      // Session statuses
      'upcoming': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      // User statuses
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800'
    };

    const colorClass = badgeColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
    const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {displayStatus}
      </span>
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg">Loading analytics data...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-slate-600 mt-2">
              Track performance and gain insights from your demo sessions
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{metric.value}</p>
                    <div className="flex items-center mt-2">
                      {metric.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${metric.bgColor}`}>
                    <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Performance Trends */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Performance Trends (Last 7 Days)
              </CardTitle>
              <CardDescription>
                Daily trends for active and cancelled sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.performanceTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="activeSessions" 
                    stackId="1"
                    stroke="#3b82f6" 
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    name="Active Sessions"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cancelledSessions" 
                    stackId="1"
                    stroke="#ef4444" 
                    fill="#ef4444"
                    fillOpacity={0.6}
                    name="Cancelled Sessions"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* User Engagement Chart */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-600" />
              User Engagement (Monthly)
            </CardTitle>
            <CardDescription>
              Track admins, employees, and inactive users over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={analyticsData.userEngagement}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="admins" 
                  stackId="1"
                  stroke="#10b981" 
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="Admins"
                />
                <Area 
                  type="monotone" 
                  dataKey="employees" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  name="Employees"
                />
                <Area 
                  type="monotone" 
                  dataKey="inactive" 
                  stackId="1"
                  stroke="#f59e0b" 
                  fill="#f59e0b"
                  fillOpacity={0.6}
                  name="Inactive Users"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest demo sessions and user interactions from this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.recentActivity.length > 0 ? (
                analyticsData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white border border-slate-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{activity.user}</p>
                        <p className="text-sm text-slate-600">{activity.action}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getActivityBadge(activity.status)}
                      <span className="text-sm text-slate-500">{activity.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                  <p>No recent activity from this week</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Analytics;
