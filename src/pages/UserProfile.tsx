
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Mail, Phone, Calendar, MapPin, Award, Clock, TrendingUp } from 'lucide-react';

// Mock user data - in a real app, this would come from an API
const mockUsers: any = {
  '1': {
    id: '1',
    name: 'John Admin',
    email: 'admin@demo.com',
    role: 'admin',
    status: 'active',
    joinDate: '2023-01-15',
    lastLogin: '2024-01-12',
    department: 'Engineering',
    sessionsAttended: 25,
    sessionsCreated: 15,
    totalHours: 120,
    skillLevel: 'Advanced',
    phone: '+1 (555) 123-4567',
    bio: 'Experienced system administrator with expertise in cloud infrastructure and team management.',
    location: 'San Francisco, CA',
    recentActivity: [
      { date: '2024-01-12', action: 'Created demo session "Advanced React Patterns"' },
      { date: '2024-01-11', action: 'Attended "Team Leadership Workshop"' },
      { date: '2024-01-10', action: 'Updated user permissions for Engineering team' }
    ]
  },
  '2': {
    id: '2',
    name: 'Jane Employee',
    email: 'employee@demo.com',
    role: 'employee',
    status: 'active',
    joinDate: '2023-06-10',
    lastLogin: '2024-01-11',
    department: 'Engineering',
    sessionsAttended: 12,
    sessionsCreated: 0,
    totalHours: 48,
    skillLevel: 'Intermediate',
    phone: '+1 (555) 987-6543',
    bio: 'Frontend developer passionate about creating user-friendly interfaces and learning new technologies.',
    location: 'New York, NY',
    recentActivity: [
      { date: '2024-01-11', action: 'Completed "JavaScript Fundamentals" session' },
      { date: '2024-01-09', action: 'Joined "UI/UX Best Practices" workshop' },
      { date: '2024-01-08', action: 'Updated profile information' }
    ]
  }
};

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = mockUsers[userId || '1'];

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h1>
          <Button onClick={() => navigate('/user-management')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to User Management
          </Button>
        </div>
      </Layout>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Inactive</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    return role === 'admin' ? 
      <Badge className="bg-purple-100 text-purple-800 border-purple-300">Admin</Badge> :
      <Badge variant="outline">Employee</Badge>;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate('/user-management')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to User Management
          </Button>
        </div>

        {/* User Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                  {getStatusBadge(user.status)}
                  {getRoleBadge(user.role)}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {user.email}
                  </div>
                  {user.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {user.phone}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Joined {new Date(user.joinDate).toLocaleDateString()}
                  </div>
                  {user.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {user.location}
                    </div>
                  )}
                </div>
                {user.bio && (
                  <p className="mt-4 text-gray-700">{user.bio}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats and Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Sessions Attended</p>
                  <p className="text-2xl font-bold">{user.sessionsAttended}</p>
                </div>
                <Award className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          {user.role === 'admin' && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Sessions Created</p>
                    <p className="text-2xl font-bold">{user.sessionsCreated}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Hours</p>
                  <p className="text-2xl font-bold">{user.totalHours}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Skill Level</p>
                <Badge className={
                  user.skillLevel === 'Beginner' ? 'bg-blue-100 text-blue-800' :
                  user.skillLevel === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }>
                  {user.skillLevel}
                </Badge>
                <Progress 
                  value={
                    user.skillLevel === 'Beginner' ? 33 :
                    user.skillLevel === 'Intermediate' ? 66 : 100
                  } 
                  className="mt-2" 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.recentActivity?.map((activity: any, index: number) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default UserProfile;
