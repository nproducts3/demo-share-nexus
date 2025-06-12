import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  RefreshCw,
  ChevronDown
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

  const downloadExcel = (data: any[], filename: string, headers: string[]) => {
    // Create CSV content (Excel can open CSV files)
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header.toLowerCase().replace(/\s+/g, '')] || row[header] || '';
        return `"${value}"`;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportSessionOverview = () => {
    const data = [{
      'Total Sessions': analyticsData.totalSessions,
      'Active Users': analyticsData.activeUsers,
      'Average Session Time': analyticsData.averageSessionTime,
      'Conversion Rate': `${analyticsData.conversionRate.toFixed(1)}%`
    }];
    
    downloadExcel(data, 'session_overview', ['Total Sessions', 'Active Users', 'Average Session Time', 'Conversion Rate']);
    
    toast({
      title: "Export Complete",
      description: "Session Overview data exported successfully.",
    });
  };

  const handleExportPerformanceTrends = () => {
    // Create data for all 7 days of the week
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    const data = daysOfWeek.map(day => {
      const existingData = analyticsData.performanceTrends.find(trend => {
        // Convert short day names (Mon, Tue, etc.) to full names for comparison
        const dayMap: { [key: string]: string } = {
          'Mon': 'Monday',
          'Tue': 'Tuesday', 
          'Wed': 'Wednesday',
          'Thu': 'Thursday',
          'Fri': 'Friday',
          'Sat': 'Saturday',
          'Sun': 'Sunday'
        };
        return dayMap[trend.name] === day;
      });

      return {
        Day: day,
        'Active Sessions': existingData?.activeSessions || 0,
        'Cancelled Sessions': existingData?.cancelledSessions || 0
      };
    });
    
    downloadExcel(data, 'performance_trends', ['Day', 'Active Sessions', 'Cancelled Sessions']);
    
    toast({
      title: "Export Complete",
      description: "Performance Trends data exported successfully.",
    });
  };

  const handleExportUserEngagement = () => {
    // Create data for all 12 months
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const data = monthNames.map(monthName => {
      const existingData = analyticsData.userEngagement.find(engagement => {
        // Convert short month names (Jan, Feb, etc.) to full names for comparison
        const monthMap: { [key: string]: string } = {
          'Jan': 'January',
          'Feb': 'February',
          'Mar': 'March',
          'Apr': 'April',
          'May': 'May',
          'Jun': 'June',
          'Jul': 'July',
          'Aug': 'August',
          'Sep': 'September',
          'Oct': 'October',
          'Nov': 'November',
          'Dec': 'December'
        };
        return monthMap[engagement.name] === monthName || engagement.name === monthName;
      });

      return {
        Month: monthName,
        Admins: existingData?.admins || 0,
        Employees: existingData?.employees || 0,
        'Inactive Users': existingData?.inactive || 0
      };
    });
    
    downloadExcel(data, 'user_engagement', ['Month', 'Admins', 'Employees', 'Inactive Users']);
    
    toast({
      title: "Export Complete",
      description: "User Engagement data exported successfully.",
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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleExportSessionOverview}>
                  <Download className="h-4 w-4 mr-2" />
                  Session Overview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPerformanceTrends}>
                  <Download className="h-4 w-4 mr-2" />
                  Performance Trends
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportUserEngagement}>
                  <Download className="h-4 w-4 mr-2" />
                  User Engagement
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
