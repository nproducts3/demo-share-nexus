
import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface Invitation {
  id: string;
  sessionTitle: string;
  technology: string;
  date: string;
  time: string;
  description: string;
  status: 'pending' | 'accepted' | 'declined';
  host: string;
}

export const EmployeeDashboard: React.FC = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      id: '1',
      sessionTitle: 'React Hooks Deep Dive',
      technology: 'React',
      date: '2024-01-15',
      time: '14:00',
      description: 'Advanced concepts in React Hooks including custom hooks and performance optimization.',
      status: 'pending',
      host: 'John Admin'
    },
    {
      id: '2',
      sessionTitle: 'Node.js Performance Optimization',
      technology: 'Node.js',
      date: '2024-01-20',
      time: '11:00',
      description: 'Best practices for optimizing Node.js applications for production.',
      status: 'accepted',
      host: 'John Admin'
    },
    {
      id: '3',
      sessionTitle: 'TypeScript Best Practices',
      technology: 'TypeScript',
      date: '2024-01-10',
      time: '10:00',
      description: 'Exploring TypeScript patterns and best practices for large applications.',
      status: 'accepted',
      host: 'John Admin'
    }
  ]);

  const handleInvitationResponse = (invitationId: string, response: 'accepted' | 'declined') => {
    setInvitations(prev => prev.map(inv => 
      inv.id === invitationId ? { ...inv, status: response } : inv
    ));
    
    toast({
      title: `Invitation ${response}`,
      description: `You have ${response} the demo session invitation.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Pending</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Accepted</Badge>;
      case 'declined':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Declined</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const pendingInvitations = invitations.filter(inv => inv.status === 'pending');
  const acceptedInvitations = invitations.filter(inv => inv.status === 'accepted');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Demo Sessions</h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Invitations</p>
                <p className="text-2xl font-bold text-gray-900">{pendingInvitations.length}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-500">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{acceptedInvitations.length}</p>
              </div>
              <div className="p-3 rounded-full bg-green-500">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Sessions</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Invitations */}
      {pendingInvitations.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Invitations</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingInvitations.map((invitation) => (
              <Card key={invitation.id} className="hover:shadow-lg transition-shadow border-yellow-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{invitation.sessionTitle}</CardTitle>
                      <CardDescription>
                        Technology: {invitation.technology} • Host: {invitation.host}
                      </CardDescription>
                    </div>
                    {getStatusBadge(invitation.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(invitation.date).toLocaleDateString()}</span>
                      <Clock className="h-4 w-4 ml-4" />
                      <span>{invitation.time}</span>
                    </div>
                    <p className="text-sm text-gray-700">{invitation.description}</p>
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleInvitationResponse(invitation.id, 'accepted')}
                        className="flex items-center space-x-1"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Accept</span>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleInvitationResponse(invitation.id, 'declined')}
                        className="flex items-center space-x-1"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Decline</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Accepted/Upcoming Sessions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">My Upcoming Sessions</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {acceptedInvitations.map((invitation) => (
            <Card key={invitation.id} className="hover:shadow-lg transition-shadow border-green-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{invitation.sessionTitle}</CardTitle>
                    <CardDescription>
                      Technology: {invitation.technology} • Host: {invitation.host}
                    </CardDescription>
                  </div>
                  {getStatusBadge(invitation.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(invitation.date).toLocaleDateString()}</span>
                    <Clock className="h-4 w-4 ml-4" />
                    <span>{invitation.time}</span>
                  </div>
                  <p className="text-sm text-gray-700">{invitation.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
