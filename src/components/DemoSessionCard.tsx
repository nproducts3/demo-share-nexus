
import React from 'react';
import { Calendar, Clock, Users, Edit, Trash, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

interface DemoSessionCardProps {
  session: DemoSession;
  onEdit?: (session: DemoSession) => void;
  onDelete?: (sessionId: string) => void;
  isAdmin?: boolean;
}

export const DemoSessionCard: React.FC<DemoSessionCardProps> = ({
  session,
  onEdit,
  onDelete,
  isAdmin = false
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Upcoming</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTechnologyColor = (tech: string) => {
    const colors: Record<string, string> = {
      'React': 'bg-blue-500',
      'Angular': 'bg-red-500',
      'Vue.js': 'bg-green-500',
      'Node.js': 'bg-green-600',
      'Python': 'bg-yellow-500',
      'TypeScript': 'bg-blue-600',
      'JavaScript': 'bg-yellow-400',
    };
    return colors[tech] || 'bg-gray-500';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center space-x-2">
              <span>{session.title}</span>
              <div className={`w-3 h-3 rounded-full ${getTechnologyColor(session.technology)}`} />
            </CardTitle>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(session.date).toLocaleDateString()}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{session.time}</span>
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            {getStatusBadge(session.status)}
            {isAdmin && (
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit?.(session)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete?.(session.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="bg-gray-50">
              {session.technology}
            </Badge>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>{session.attendees} attendees</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 line-clamp-2">
            {session.description}
          </p>
          
          <div className="flex items-center space-x-2 text-xs text-gray-500 pt-2 border-t">
            <User className="h-3 w-3" />
            <span>Created by {session.createdBy}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
