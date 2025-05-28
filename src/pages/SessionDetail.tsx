import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Save, X, Calendar, Clock, Users, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layout } from '../components/Layout';
import { useToast } from '@/hooks/use-toast';

interface SessionDetails {
  id: string;
  title: string;
  technology: string;
  date: string;
  time: string;
  description: string;
  createdBy: string;
  attendees: number;
  maxAttendees: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  location: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites?: string;
  duration?: string;
  sprintName: string;
  storyPoints: number;
  numberOfTasks: number;
  numberOfBugs: number;
  currentStatus: 'Planning' | 'In Progress' | 'Testing' | 'Completed' | 'On Hold';
  rating?: number;
  feedback?: string;
  type: 'Project-based' | 'Product-based';
}

const SessionDetail = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [session, setSession] = useState<SessionDetails | null>(null);
  const [editingFields, setEditingFields] = useState<Set<string>>(new Set());
  const [editValues, setEditValues] = useState<Partial<SessionDetails>>({});

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockSession: SessionDetails = {
      id: sessionId || '1',
      title: 'React Hooks Deep Dive',
      technology: 'React',
      date: '2024-01-15',
      time: '14:00',
      description: 'Advanced concepts in React Hooks including custom hooks and performance optimization.',
      createdBy: 'John Admin',
      attendees: 8,
      maxAttendees: 15,
      status: 'upcoming',
      location: 'Conference Room A',
      difficulty: 'Advanced',
      prerequisites: 'Basic React knowledge',
      duration: '120',
      sprintName: 'Sprint 2024-01',
      storyPoints: 8,
      numberOfTasks: 12,
      numberOfBugs: 3,
      currentStatus: 'In Progress',
      rating: 4.5,
      feedback: 'Great session with excellent examples and hands-on exercises.',
      type: 'Project-based'
    };
    setSession(mockSession);
    setEditValues(mockSession);
  }, [sessionId]);

  const startEditing = (field: string) => {
    setEditingFields(prev => new Set([...prev, field]));
  };

  const cancelEditing = (field: string) => {
    setEditingFields(prev => {
      const newSet = new Set(prev);
      newSet.delete(field);
      return newSet;
    });
    if (session) {
      setEditValues(prev => ({ ...prev, [field]: session[field as keyof SessionDetails] }));
    }
  };

  const saveField = (field: string) => {
    if (!session) return;

    const updatedSession = { ...session, [field]: editValues[field as keyof SessionDetails] };
    setSession(updatedSession);
    setEditingFields(prev => {
      const newSet = new Set(prev);
      newSet.delete(field);
      return newSet;
    });

    toast({
      title: "Field Updated",
      description: `${field.charAt(0).toUpperCase() + field.slice(1)} has been saved successfully.`,
    });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'upcoming': 'bg-blue-100 text-blue-800 border-blue-300',
      'completed': 'bg-green-100 text-green-800 border-green-300',
      'cancelled': 'bg-red-100 text-red-800 border-red-300'
    };
    return <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
  };

  const getCurrentStatusBadge = (status: string) => {
    const colors = {
      'Planning': 'bg-purple-100 text-purple-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Testing': 'bg-yellow-100 text-yellow-800',
      'Completed': 'bg-green-100 text-green-800',
      'On Hold': 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-800',
      'Intermediate': 'bg-yellow-100 text-yellow-800',
      'Advanced': 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[difficulty as keyof typeof colors]}>{difficulty}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      'Project-based': 'bg-indigo-100 text-indigo-800',
      'Product-based': 'bg-emerald-100 text-emerald-800'
    };
    return <Badge className={colors[type as keyof typeof colors]}>{type}</Badge>;
  };

  const renderEditableField = (field: string, value: any, type: 'text' | 'number' | 'textarea' | 'select' = 'text', options?: string[]) => {
    const isEditing = editingFields.has(field);
    
    if (!isEditing) {
      return (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-900">{value}</span>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => startEditing(field)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        {type === 'textarea' ? (
          <Textarea
            value={editValues[field as keyof SessionDetails] || ''}
            onChange={(e) => setEditValues(prev => ({ ...prev, [field]: e.target.value }))}
            className="flex-1"
          />
        ) : type === 'select' && options ? (
          <Select
            value={editValues[field as keyof SessionDetails] as string || ''}
            onValueChange={(value) => setEditValues(prev => ({ ...prev, [field]: value }))}
          >
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            type={type}
            value={editValues[field as keyof SessionDetails] || ''}
            onChange={(e) => setEditValues(prev => ({ 
              ...prev, 
              [field]: type === 'number' ? parseInt(e.target.value) || 0 : e.target.value 
            }))}
            className="flex-1"
          />
        )}
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0 text-green-600"
          onClick={() => saveField(field)}
        >
          <Save className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0 text-red-600"
          onClick={() => cancelEditing(field)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  if (!session) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Loading...</h2>
            <p className="text-gray-500">Please wait while we load the session details.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/demo-sessions')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Sessions</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{session.title}</h1>
            <p className="text-gray-600 mt-1">Session Details</p>
          </div>
        </div>

        {/* Session Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Session Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Technology</p>
                <Badge variant="outline">{session.technology}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Type</p>
                {editingFields.has('type') ? (
                  <div className="flex items-center space-x-2">
                    <Select
                      value={editValues.type || session.type}
                      onValueChange={(value) => setEditValues(prev => ({ ...prev, type: value as any }))}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Project-based">Project-based</SelectItem>
                        <SelectItem value="Product-based">Product-based</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 text-green-600"
                      onClick={() => saveField('type')}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 text-red-600"
                      onClick={() => cancelEditing('type')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-40">
                    {getTypeBadge(session.type)}
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => startEditing('type')}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                {getStatusBadge(session.status)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Difficulty</p>
                {getDifficultyBadge(session.difficulty)}
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{new Date(session.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{session.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{session.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{session.attendees}/{session.maxAttendees} attendees</span>
              </div>
              {session.rating && (
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm">{session.rating}/5</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sprint Information */}
        <Card>
          <CardHeader>
            <CardTitle>Sprint Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Sprint Name</p>
                {renderEditableField('sprintName', session.sprintName)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Story Points</p>
                {renderEditableField('storyPoints', session.storyPoints, 'number')}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Number of Tasks</p>
                {renderEditableField('numberOfTasks', session.numberOfTasks, 'number')}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Number of Bugs</p>
                {renderEditableField('numberOfBugs', session.numberOfBugs, 'number')}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Current Status</p>
              {editingFields.has('currentStatus') ? (
                <div className="flex items-center space-x-2">
                  <Select
                    value={editValues.currentStatus || session.currentStatus}
                    onValueChange={(value) => setEditValues(prev => ({ ...prev, currentStatus: value as any }))}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Testing">Testing</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 text-green-600"
                    onClick={() => saveField('currentStatus')}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 text-red-600"
                    onClick={() => cancelEditing('currentStatus')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between w-48">
                  {getCurrentStatusBadge(session.currentStatus)}
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => startEditing('currentStatus')}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Session Details */}
        <Card>
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                {renderEditableField('description', session.description, 'textarea')}
              </div>
              {session.prerequisites && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Prerequisites</p>
                  {renderEditableField('prerequisites', session.prerequisites, 'textarea')}
                </div>
              )}
              {session.feedback && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Feedback</p>
                  {renderEditableField('feedback', session.feedback, 'textarea')}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Duration (minutes)</p>
                  {renderEditableField('duration', session.duration, 'number')}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Created By</p>
                  <span className="text-sm text-gray-900">{session.createdBy}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SessionDetail;
