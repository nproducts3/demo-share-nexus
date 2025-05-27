
import React, { useState } from 'react';
import { Calendar, Users, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DemoSessionModal } from './DemoSessionModal';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<DemoSession | undefined>();
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

  const handleCreateSession = (sessionData: Omit<DemoSession, 'id' | 'createdBy' | 'attendees' | 'status'>) => {
    const newSession: DemoSession = {
      ...sessionData,
      id: Date.now().toString(),
      createdBy: 'John Admin',
      attendees: 0,
      status: 'upcoming'
    };
    setDemoSessions(prev => [...prev, newSession]);
    setIsModalOpen(false);
  };

  const handleEditSession = (sessionData: Omit<DemoSession, 'id' | 'createdBy' | 'attendees' | 'status'>) => {
    if (editingSession) {
      setDemoSessions(prev => prev.map(session => 
        session.id === editingSession.id 
          ? { ...session, ...sessionData }
          : session
      ));
      setEditingSession(undefined);
      setIsModalOpen(false);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    setDemoSessions(prev => prev.filter(session => session.id !== sessionId));
  };

  const openEditModal = (session: DemoSession) => {
    setEditingSession(session);
    setIsModalOpen(true);
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
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Session</span>
        </Button>
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
              onEdit={openEditModal}
              onDelete={handleDeleteSession}
              isAdmin={true}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <DemoSessionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSession(undefined);
        }}
        onSubmit={editingSession ? handleEditSession : handleCreateSession}
        editingSession={editingSession}
      />
    </div>
  );
};
