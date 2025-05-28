import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, Plus, Search, Filter, Download, Trash2, Edit, Eye, MapPin, Star, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Layout } from '../components/Layout';

interface MySession {
  id: string;
  title: string;
  technology: string;
  date: string;
  time: string;
  description: string;
  attendees: number;
  maxAttendees: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  location: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rating?: number;
  feedback?: string;
}

const MySessions = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [technologyFilter, setTechnologyFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<MySession | null>(null);
  const [newSession, setNewSession] = useState<Partial<MySession>>({
    title: '',
    technology: '',
    date: '',
    time: '',
    description: '',
    maxAttendees: 10,
    location: '',
    difficulty: 'Beginner'
  });

  const [mySessions, setMySessions] = useState<MySession[]>([
    {
      id: '1',
      title: 'React Hooks Workshop',
      technology: 'React',
      date: '2024-01-20',
      time: '14:00',
      description: 'Comprehensive workshop on React Hooks including useState, useEffect, and custom hooks.',
      attendees: 12,
      maxAttendees: 15,
      status: 'upcoming',
      location: 'Conference Room A',
      difficulty: 'Intermediate',
    },
    {
      id: '2',
      title: 'JavaScript ES6+ Features',
      technology: 'JavaScript',
      date: '2024-01-15',
      time: '10:00',
      description: 'Deep dive into modern JavaScript features and best practices.',
      attendees: 8,
      maxAttendees: 12,
      status: 'completed',
      location: 'Tech Lab',
      difficulty: 'Advanced',
      rating: 4.8,
      feedback: 'Excellent session with great examples!'
    }
  ]);

  const filteredSessions = mySessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.technology.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    const matchesTechnology = technologyFilter === 'all' || session.technology === technologyFilter;
    
    return matchesSearch && matchesStatus && matchesTechnology;
  });

  const technologies = Array.from(new Set(mySessions.map(session => session.technology)));

  const handleCreateSession = () => {
    if (!newSession.title || !newSession.technology || !newSession.date || !newSession.time) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const session: MySession = {
      id: Date.now().toString(),
      title: newSession.title!,
      technology: newSession.technology!,
      date: newSession.date!,
      time: newSession.time!,
      description: newSession.description || '',
      attendees: 0,
      maxAttendees: newSession.maxAttendees || 10,
      status: 'upcoming',
      location: newSession.location || 'TBD',
      difficulty: newSession.difficulty as 'Beginner' | 'Intermediate' | 'Advanced'
    };

    setMySessions([...mySessions, session]);
    setNewSession({
      title: '',
      technology: '',
      date: '',
      time: '',
      description: '',
      maxAttendees: 10,
      location: '',
      difficulty: 'Beginner'
    });
    setIsCreateModalOpen(false);
    toast({
      title: "Session Created",
      description: "Your demo session has been successfully created.",
    });
  };

  const handleEditSession = () => {
    if (!selectedSession) return;

    const updatedSessions = mySessions.map(session =>
      session.id === selectedSession.id ? selectedSession : session
    );
    setMySessions(updatedSessions);
    setIsEditModalOpen(false);
    setSelectedSession(null);
    toast({
      title: "Session Updated",
      description: "Your demo session has been successfully updated.",
    });
  };

  const handleDeleteSession = (sessionId: string) => {
    const updatedSessions = mySessions.filter(session => session.id !== sessionId);
    setMySessions(updatedSessions);
    toast({
      title: "Session Deleted",
      description: "The demo session has been successfully deleted.",
    });
  };

  const handleCancelSession = (sessionId: string) => {
    const updatedSessions = mySessions.map(session =>
      session.id === sessionId ? { ...session, status: 'cancelled' as const } : session
    );
    setMySessions(updatedSessions);
    toast({
      title: "Session Cancelled",
      description: "The demo session has been cancelled.",
    });
  };

  const exportSessions = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Title,Technology,Date,Time,Status,Attendees,Location,Difficulty\n" +
      filteredSessions.map(session => 
        `"${session.title}","${session.technology}","${session.date}","${session.time}","${session.status}","${session.attendees}/${session.maxAttendees}","${session.location}","${session.difficulty}"`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_sessions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-800',
      'Intermediate': 'bg-yellow-100 text-yellow-800',
      'Advanced': 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[difficulty as keyof typeof colors]}>{difficulty}</Badge>;
  };

  const handleViewSessionDetail = (sessionId: string) => {
    navigate(`/session/${sessionId}`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-blue-800 bg-clip-text text-transparent">My Sessions</h1>
            <p className="text-slate-600 mt-1">Manage your demo sessions and track engagement</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={exportSessions} className="shadow-md hover:shadow-lg transition-shadow">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all">
                  <Plus className="h-4 w-4 mr-2" />
                  New Session
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Demo Session</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new demo session.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">Title</Label>
                    <Input
                      id="title"
                      value={newSession.title}
                      onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                      className="col-span-3"
                      placeholder="Session title"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="technology" className="text-right">Technology</Label>
                    <Input
                      id="technology"
                      value={newSession.technology}
                      onChange={(e) => setNewSession({...newSession, technology: e.target.value})}
                      className="col-span-3"
                      placeholder="React, JavaScript, etc."
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newSession.date}
                      onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="time" className="text-right">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newSession.time}
                      onChange={(e) => setNewSession({...newSession, time: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">Location</Label>
                    <Input
                      id="location"
                      value={newSession.location}
                      onChange={(e) => setNewSession({...newSession, location: e.target.value})}
                      className="col-span-3"
                      placeholder="Conference Room A"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="difficulty" className="text-right">Difficulty</Label>
                    <Select value={newSession.difficulty} onValueChange={(value) => setNewSession({...newSession, difficulty: value as any})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="maxAttendees" className="text-right">Max Attendees</Label>
                    <Input
                      id="maxAttendees"
                      type="number"
                      value={newSession.maxAttendees}
                      onChange={(e) => setNewSession({...newSession, maxAttendees: parseInt(e.target.value)})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <Textarea
                      id="description"
                      value={newSession.description}
                      onChange={(e) => setNewSession({...newSession, description: e.target.value})}
                      className="col-span-3"
                      placeholder="Session description..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleCreateSession}>Create Session</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Total Sessions</p>
                  <p className="text-2xl font-bold text-blue-900">{mySessions.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">Completed</p>
                  <p className="text-2xl font-bold text-green-900">{mySessions.filter(s => s.status === 'completed').length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700 font-medium">Upcoming</p>
                  <p className="text-2xl font-bold text-orange-900">{mySessions.filter(s => s.status === 'upcoming').length}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-medium">Avg Rating</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {mySessions.filter(s => s.rating).length > 0 
                      ? (mySessions.filter(s => s.rating).reduce((sum, s) => sum + (s.rating || 0), 0) / mySessions.filter(s => s.rating).length).toFixed(1)
                      : 'N/A'
                    }
                  </p>
                </div>
                <Star className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search sessions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={technologyFilter} onValueChange={setTechnologyFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Technology" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tech</SelectItem>
                  {technologies.map(tech => (
                    <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Sessions Table */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>My Sessions ({filteredSessions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session</TableHead>
                  <TableHead>Technology</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Attendees</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <div>
                        <div 
                          className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                          onClick={() => handleViewSessionDetail(session.id)}
                        >
                          {session.title}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {session.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{session.technology}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{new Date(session.date).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500">{session.time}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{session.attendees}/{session.maxAttendees}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(session.status)}</TableCell>
                    <TableCell>{getDifficultyBadge(session.difficulty)}</TableCell>
                    <TableCell>
                      {session.rating ? (
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span>{session.rating}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewSessionDetail(session.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setSelectedSession(session);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {session.status === 'upcoming' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0 text-orange-600"
                            onClick={() => handleCancelSession(session.id)}
                          >
                            <Filter className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 w-8 p-0 text-red-600"
                          onClick={() => handleDeleteSession(session.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* View Session Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedSession?.title}</DialogTitle>
              <DialogDescription>Session Details</DialogDescription>
            </DialogHeader>
            {selectedSession && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-medium">Technology</Label>
                    <p>{selectedSession.technology}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Difficulty</Label>
                    <p>{selectedSession.difficulty}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Date & Time</Label>
                    <p>{new Date(selectedSession.date).toLocaleDateString()} at {selectedSession.time}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Location</Label>
                    <p>{selectedSession.location}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Attendees</Label>
                    <p>{selectedSession.attendees} / {selectedSession.maxAttendees}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedSession.status)}</div>
                  </div>
                </div>
                <div>
                  <Label className="font-medium">Description</Label>
                  <p className="mt-1">{selectedSession.description || 'No description provided.'}</p>
                </div>
                {selectedSession.feedback && (
                  <div>
                    <Label className="font-medium">Feedback</Label>
                    <p className="mt-1">{selectedSession.feedback}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Session Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Demo Session</DialogTitle>
              <DialogDescription>
                Update the session details.
              </DialogDescription>
            </DialogHeader>
            {selectedSession && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-title" className="text-right">Title</Label>
                  <Input
                    id="edit-title"
                    value={selectedSession.title}
                    onChange={(e) => setSelectedSession({...selectedSession, title: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-technology" className="text-right">Technology</Label>
                  <Input
                    id="edit-technology"
                    value={selectedSession.technology}
                    onChange={(e) => setSelectedSession({...selectedSession, technology: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-date" className="text-right">Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={selectedSession.date}
                    onChange={(e) => setSelectedSession({...selectedSession, date: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-time" className="text-right">Time</Label>
                  <Input
                    id="edit-time"
                    type="time"
                    value={selectedSession.time}
                    onChange={(e) => setSelectedSession({...selectedSession, time: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-location" className="text-right">Location</Label>
                  <Input
                    id="edit-location"
                    value={selectedSession.location}
                    onChange={(e) => setSelectedSession({...selectedSession, location: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="edit-description" className="text-right">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={selectedSession.description}
                    onChange={(e) => setSelectedSession({...selectedSession, description: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="submit" onClick={handleEditSession}>Update Session</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default MySessions;
