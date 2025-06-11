
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { sessionApi, userApi } from '../services/api';
import { DemoSession, User } from '../types/api';

interface AnalyticsData {
  totalSessions: number;
  activeUsers: number;
  averageSessionTime: string;
  performanceTrends: Array<{
    name: string;
    activeSessions: number;
    cancelledSessions: number;
  }>;
  userEngagement: Array<{
    name: string;
    admins: number;
    employees: number;
    inactive: number;
  }>;
  recentActivity: Array<{
    user: string;
    action: string;
    time: string;
    status: string;
  }>;
}

export const useAnalyticsData = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalSessions: 0,
    activeUsers: 0,
    averageSessionTime: '0m 0s',
    performanceTrends: [],
    userEngagement: [],
    recentActivity: []
  });

  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: sessionApi.getAll,
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: userApi.getAll,
  });

  useEffect(() => {
    if (!sessions || !users) return;

    // Calculate total sessions
    const totalSessions = sessions.length;

    // Calculate active users (status !== 'inactive')
    const activeUsers = users.filter(user => user.status !== 'inactive').length;

    // Calculate average session time
    const averageSessionTime = calculateAverageSessionTime(sessions);

    // Calculate performance trends (last 7 days)
    const performanceTrends = calculatePerformanceTrends(sessions);

    // Calculate user engagement (monthly)
    const userEngagement = calculateUserEngagement(users);

    // Calculate recent activity (current week)
    const recentActivity = calculateRecentActivity(sessions, users);

    setAnalyticsData({
      totalSessions,
      activeUsers,
      averageSessionTime,
      performanceTrends,
      userEngagement,
      recentActivity
    });
  }, [sessions, users]);

  return {
    data: analyticsData,
    isLoading: sessionsLoading || usersLoading
  };
};

const calculateAverageSessionTime = (sessions: DemoSession[]): string => {
  const completedSessions = sessions.filter(session => session.status === 'completed');
  
  if (completedSessions.length === 0) return '0m 0s';

  const totalMinutes = completedSessions.reduce((total, session) => {
    return total + (session.duration || 60); // Default to 60 minutes if duration is not set
  }, 0);

  const averageMinutes = Math.round(totalMinutes / completedSessions.length);
  const hours = Math.floor(averageMinutes / 60);
  const minutes = averageMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m 0s`;
};

const calculatePerformanceTrends = (sessions: DemoSession[]) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  return last7Days.map(date => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayString = date.toISOString().split('T')[0];

    const daySessions = sessions.filter(session => {
      const sessionDate = new Date(session.date).toISOString().split('T')[0];
      return sessionDate === dayString;
    });

    const activeSessions = daySessions.filter(session => 
      session.status === 'upcoming' || session.status === 'completed'
    ).length;

    const cancelledSessions = daySessions.filter(session => 
      session.status === 'cancelled'
    ).length;

    return {
      name: dayName,
      activeSessions,
      cancelledSessions
    };
  });
};

const calculateUserEngagement = (users: User[]) => {
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    return date;
  });

  return last6Months.map(date => {
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    const monthString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    const monthUsers = users.filter(user => {
      const userJoinDate = new Date(user.joinDate);
      const userMonthString = `${userJoinDate.getFullYear()}-${String(userJoinDate.getMonth() + 1).padStart(2, '0')}`;
      return userMonthString <= monthString;
    });

    const admins = monthUsers.filter(user => user.role.toLowerCase().includes('admin')).length;
    const employees = monthUsers.filter(user => user.role.toLowerCase().includes('employee')).length;
    const inactive = monthUsers.filter(user => user.status === 'inactive').length;

    return {
      name: monthName,
      admins,
      employees,
      inactive
    };
  });
};

const calculateRecentActivity = (sessions: DemoSession[], users: User[]) => {
  const currentWeekStart = new Date();
  currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());
  currentWeekStart.setHours(0, 0, 0, 0);

  const activities: Array<{
    user: string;
    action: string;
    time: string;
    status: string;
    timestamp: Date;
  }> = [];

  // Add recent session activities
  sessions.forEach(session => {
    const sessionDate = new Date(session.date);
    if (sessionDate >= currentWeekStart) {
      const user = session.createdBy || 'Unknown User';
      let action = '';
      let status = '';

      switch (session.status) {
        case 'upcoming':
          action = `Scheduled ${session.technology} Demo`;
          status = 'scheduled';
          break;
        case 'completed':
          action = `Completed ${session.technology} Demo`;
          status = 'success';
          break;
        case 'cancelled':
          action = `Cancelled ${session.technology} Demo`;
          status = 'cancelled';
          break;
      }

      activities.push({
        user,
        action,
        time: getRelativeTime(sessionDate),
        status,
        timestamp: sessionDate
      });
    }
  });

  // Add recent user activities
  users.forEach(user => {
    const joinDate = new Date(user.joinDate);
    if (joinDate >= currentWeekStart) {
      activities.push({
        user: user.name,
        action: 'Joined the platform',
        time: getRelativeTime(joinDate),
        status: 'success',
        timestamp: joinDate
      });
    }

    const lastLogin = new Date(user.lastLogin);
    if (lastLogin >= currentWeekStart) {
      activities.push({
        user: user.name,
        action: 'Logged in',
        time: getRelativeTime(lastLogin),
        status: 'active',
        timestamp: lastLogin
      });
    }
  });

  // Sort by timestamp (most recent first) and return top 5
  return activities
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5)
    .map(({ timestamp, ...activity }) => activity);
};

const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
};
