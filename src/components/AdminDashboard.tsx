
import React, { useState } from 'react';
import { Calendar, Users, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { DemoSessionCard } from './DemoSessionCard';

interface DemoSession {
  id: string;
  title: string;
  technology: string;
  date: string;
  time: string;
  description: string;
  createdBy: string;
  attendees: number;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export const AdminDashboard: React.FC = () => {
  const [demoSessions, setDemoSessions] = useState<DemoSession[]>([
    {
      id: '1',
      title: 'React Hooks Deep Dive',
      technology: 'React',
      date: '2024-01-15',
      time: '14:00',
      description: 'Advanced concepts in React Hooks including custom hooks and performance optimization.',
      createdBy: 'John Admin',
      attendees: 8,
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'TypeScript Best Practices',
      technology: 'TypeScript',
      date: '2024-01-10',
      time: '10:00',
      description: 'Exploring TypeScript patterns and best practices for large applications.',
      createdBy: 'John Admin',
      attendees: 12,
      status: 'completed'
    }
  ]);

  const handleDeleteSession = (sessionId: string) => {
    setDemoSessions(prev => prev.filter(session => session.id !== sessionId));
  };

  const statsCards = [
    { title: 'Total Sessions', value: demoSessions.length, icon: Calendar, color: 'bg-blue-500' },
    { title: 'Upcoming Sessions', value: demoSessions.filter(s => s.status === 'upcoming').length, icon: Clock, color: 'bg-green-500' },
    { title: 'Total Attendees', value: demoSessions.reduce((sum, s) => sum + s.attendees, 0), icon: Users, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Demo Session Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Demo Sessions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Demo Sessions</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {demoSessions.map((session) => (
            <DemoSessionCard
              key={session.id}
              session={session}
              onEdit={() => {}}
              onDelete={handleDeleteSession}
              isAdmin={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
