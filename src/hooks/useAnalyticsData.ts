import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { sessionApi, userApi } from '../services/api';
import { DemoSession, User } from '../types/api';

interface AnalyticsData {
  totalSessions: number;
  activeUsers: number;
  averageSessionTime: string;
  conversionRate: number;
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
    conversionRate: 0,
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

    // Calculate total sessions (all sessions regardless of status)
    const totalSessions = sessions.length;

    // Calculate active users (users who have logged in within the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = users.filter(user => {
      const lastLogin = new Date(user.lastLogin);
      return lastLogin >= thirtyDaysAgo;
    }).length;

    // Calculate average session time from completed sessions
    const averageSessionTime = calculateAverageSessionTime(sessions);

    // Calculate conversion rate
    const conversionRate = calculateConversionRate(sessions);

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
      conversionRate,
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
  // Get all sessions (not just completed ones)
  const totalSessions = sessions.length;
  if (totalSessions === 0) return '0m';

  // Calculate total duration from all sessions
  const totalDuration = sessions.reduce((total, session) => {
    // Use duration if available, otherwise default to 60 minutes
    const sessionDuration = session.duration || 60;
    return total + sessionDuration;
  }, 0);

  // Calculate average duration
  const averageDuration = Math.round(totalDuration / totalSessions);

  // Format the duration
  if (averageDuration < 60) {
    return `${averageDuration}m`;
  } else {
    const hours = Math.floor(averageDuration / 60);
    const minutes = averageDuration % 60;
    return `${hours}h ${minutes}m`;
  }
};

const calculatePerformanceTrends = (sessions: DemoSession[]) => {
  // Get start of current week (Monday)
  const today = new Date();
  const day = today.getDay(); // 0 = Sunday, 1 = Monday
  const diffToMonday = day === 0 ? -6 : 1 - day; // if Sunday, go back 6 days, else go to Monday
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return daysOfWeek.map((dayName, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
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
  // Generate months for the current year from Jan (0) to Dec (11)
  const currentYear = new Date().getFullYear();
  const monthsOfYear = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(currentYear, i, 1);
    return date;
  });

  return monthsOfYear.map(date => {
    const monthIndex = date.getMonth();
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });

    // Users whose joinDate falls exactly in this month of currentYear
    const monthUsers = users.filter(user => {
      const userJoinDate = new Date(user.joinDate);
      return (
        userJoinDate.getFullYear() === currentYear &&
        userJoinDate.getMonth() === monthIndex
      );
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
    // Parse the session date and time from the API
    const sessionDate = new Date(session.date);
    const [hours, minutes] = session.time.split(':').map(Number);
    sessionDate.setHours(hours, minutes, 0, 0);

    if (sessionDate >= currentWeekStart) {
      // Find the user who created the session
      const creator = users.find(u => u.id === session.createdBy) || { name: session.createdBy || 'Unknown User' };
      
      let action = '';
      const status = session.status;

      switch (session.status) {
        case 'upcoming':
          action = `Scheduled ${session.technology} Demo`;
          break;
        case 'completed':
          action = `Completed ${session.technology} Demo`;
          break;
        case 'cancelled':
          action = `Cancelled ${session.technology} Demo`;
          break;
        default:
          action = `${session.status} ${session.technology} Demo`;
          break;
      }

      activities.push({
        user: creator.name,
        action,
        time: getRelativeTime(sessionDate),
        status: status,
        timestamp: sessionDate
      });
    }
  });

  // Add recent user activities
  users.forEach(user => {
    // Parse the actual dates from user data
    const joinDate = new Date(user.joinDate);
    const lastLogin = new Date(user.lastLogin);

    // Only add join activity if it's from this week
    if (joinDate >= currentWeekStart) {
      activities.push({
        user: user.name,
        action: `Created new account in ${user.department}`,
        time: getRelativeTime(joinDate),
        status: user.status || 'active',
        timestamp: joinDate
      });
    } 
    // Only add login activity if it's from this week AND not on the same day as join
    else if (lastLogin >= currentWeekStart && 
             lastLogin.toDateString() !== joinDate.toDateString()) {
      activities.push({
        user: user.name,
        action: `Logged in from ${user.department}`,
        time: getRelativeTime(lastLogin),
        status: user.status || 'active',
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
const calculateConversionRate = (sessions: DemoSession[]): number => {
  console.log('=== Conversion Rate Calculation ===');
  console.log('Total sessions:', sessions.length);
  
  const totalSessions = sessions.length;
  if (totalSessions === 0) {
    console.log('No sessions found, returning 0');
    return 0;
  }

  // Get sessions with ratings (completed sessions)
  const ratedSessions = sessions.filter(session => session.rating && session.rating > 0);
  console.log('Rated sessions:', ratedSessions.length);
  console.log('Session ratings:', ratedSessions.map(s => s.rating));

  // Calculate average rating
  const totalRating = ratedSessions.reduce((sum, session) => sum + (session.rating || 0), 0);
  const averageRating = ratedSessions.length > 0 ? totalRating / ratedSessions.length : 0;
  console.log('Average rating:', averageRating);

  // Calculate conversion rate based on rating
  // Consider sessions with rating >= 4 as successful conversions
  const successfulSessions = ratedSessions.filter(session => (session.rating || 0) >= 4).length;
  const conversionRate = (successfulSessions / totalSessions) * 100;
  console.log('Successful sessions:', successfulSessions);
  console.log('Raw conversion rate:', conversionRate);

  // Round to 1 decimal place
  const roundedRate = Math.round(conversionRate * 10) / 10;
  console.log('Final conversion rate:', roundedRate);
  console.log('=== End Conversion Rate Calculation ===\n');

  return roundedRate;
};

