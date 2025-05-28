import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, Plus, Search, Download, Trash2, Edit, Eye, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Layout } from '../components/Layout';
import { CreateSessionModal } from '../components/CreateSessionModal';
import { useToast } from '@/hooks/use-toast';

interface DemoSession {
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
}

const DemoSessions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [technologyFilter, setTechnologyFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
      maxAttendees: 15,
      status: 'upcoming',
      location: 'Conference Room A',
      difficulty: 'Advanced',
      prerequisites: 'Basic React knowledge',
      duration: '120'
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
      maxAttendees: 20,
      status: 'completed',
      location: 'Main Hall',
      difficulty: 'Intermediate',
      prerequisites: 'JavaScript fundamentals',
      duration: '90'
    },
    {
      id: '3',
      title: 'Node.js Performance',
      technology: 'Node.js',
      date: '2024-01-20',
      time: '16:00',
      description: 'Optimizing Node.js applications for better performance.',
      createdBy: 'Sarah Smith',
      attendees: 0,
      maxAttendees: 12,
      status: 'upcoming',
      location: 'Tech Lab',
      difficulty: 'Advanced',
      prerequisites: 'Node.js basics',
      duration: '150'
    },
    {
      id: '4',
      title: 'Vue.js for Beginners',
      technology: 'Vue.js',
      date: '2024-01-25',
      time: '09:00',
      description: 'Introduction to Vue.js framework and its core concepts.',
      createdBy: 'Mike Johnson',
      attendees: 5,
      maxAttendees: 18,
      status: 'upcoming',
      location: 'Training Room 1',
      difficulty: 'Beginner',
      duration: '180'
    },
    {
      id: '5',
      title: 'Docker Containerization',
      technology: 'Docker',
      date: '2024-01-05',
      time: '13:00',
      description: 'Learn containerization with Docker and best practices.',
      createdBy: 'Sarah Smith',
      attendees: 15,
      maxAttendees: 15,
      status: 'completed',
      location: 'Auditorium',
      difficulty: 'Intermediate',
      prerequisites: 'Basic Linux knowledge',
      duration: '240'
    }
  ]);

  const filteredSessions = demoSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.technology.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    const matchesTechnology = technologyFilter === 'all' || session.technology === technologyFilter;
    const matchesDifficulty = difficultyFilter === 'all' || session.difficulty === difficultyFilter;
    
    return matchesSearch && matchesStatus && matchesTechnology && matchesDifficulty;
  });

  const technologies = Array.from(new Set(demoSessions.map(session => session.technology)));

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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSessions(filteredSessions.map(session => session.id));
    } else {
      setSelectedSessions([]);
    }
  };

  const handleSelectSession = (sessionId: string, checked: boolean) => {
    if (checked) {
      setSelectedSessions([...selectedSessions, sessionId]);
    } else {
      setSelectedSessions(selectedSessions.filter(id => id !== sessionId));
    }
  };

  const handleBulkAction = (action: string) => {
    const sessionTitles = demoSessions
      .filter(session => selectedSessions.includes(session.id))
      .map(session => session.title)
      .join(', ');

    toast({
      title: `Bulk Action: ${action}`,
      description: `Applied to: ${sessionTitles}`,
    });

    if (action === 'delete') {
      setDemoSessions(prev => prev.filter(session => !selectedSessions.includes(session.id)));
      setSelectedSessions([]);
    }
  };

  const handleCreateSession = (sessionData: any) => {
    const newSession: DemoSession = {
      ...sessionData,
      id: Date.now().toString(),
      createdBy: 'Current Admin',
    };
    
    setDemoSessions(prev => [...prev, newSession]);
    setIsCreateModalOpen(false);
    
    toast({
      title: "Session Created",
      description: `"${newSession.title}" has been created successfully.`,
    });
  };

  const handleEditSession = (sessionId: string) => {
    const session = demoSessions.find(s => s.id === sessionId);
    if (session) {
      // In a real app, this would open an edit modal with pre-filled data
      const updatedTitle = prompt('Edit session title:', session.title);
      if (updatedTitle && updatedTitle !== session.title) {
        setDemoSessions(prev => prev.map(s => 
          s.id === sessionId ? { ...s, title: updatedTitle } : s
        ));
        toast({
          title: "Session Updated",
          description: `"${session.title}" has been updated to "${updatedTitle}".`,
        });
      }
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    const session = demoSessions.find(s => s.id === sessionId);
    if (session && confirm(`Are you sure you want to delete "${session.title}"?`)) {
      setDemoSessions(prev => prev.filter(s => s.id !== sessionId));
      toast({
        title: "Session Deleted",
        description: `"${session.title}" has been deleted successfully.`,
        variant: "destructive"
      });
    }
  };

  const handleViewSession = (sessionId: string) => {
    navigate(`/session/${sessionId}`);
  };

  const exportSessions = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Title,Technology,Date,Time,Status,Attendees,Location,Difficulty,Duration,Prerequisites\n" +
      filteredSessions.map(session => 
        `"${session.title}","${session.technology}","${session.date}","${session.time}","${session.status}","${session.attendees}/${session.maxAttendees}","${session.location}","${session.difficulty}","${session.duration || 'N/A'}","${session.prerequisites || 'None'}"`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "demo_sessions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: `Exported ${filteredSessions.length} sessions to CSV.`,
    });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTechnologyFilter('all');
    setDifficultyFilter('all');
    setSelectedSessions([]);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Demo Sessions</h1>
            <p className="text-gray-600 mt-1">Manage and track all demo sessions</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={exportSessions}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Session
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-bold">{demoSessions.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold">{demoSessions.filter(s => s.status === 'upcoming').length}</p>
                </div>
                <Clock className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Attendees</p>
                  <p className="text-2xl font-bold">{demoSessions.reduce((sum, s) => sum + s.attendees, 0)}</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Attendance</p>
                  <p className="text-2xl font-bold">
                    {Math.round(demoSessions.reduce((sum, s) => sum + (s.attendees / s.maxAttendees * 100), 0) / demoSessions.length)}%
                  </p>
                </div>
                <Filter className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integrated Filters */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Search & Filter Sessions</CardTitle>
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search sessions, technology, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={technologyFilter} onValueChange={setTechnologyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Technologies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Technologies</SelectItem>
                  {technologies.map(tech => (
                    <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedSessions.length > 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800">
                  {selectedSessions.length} session(s) selected
                </span>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('export')}>
                    Export Selected
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('cancel')}>
                    Cancel Selected
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Selected
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sessions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Sessions ({filteredSessions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedSessions.length === filteredSessions.length && filteredSessions.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Technology</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Attendees</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedSessions.includes(session.id)}
                        onCheckedChange={(checked) => handleSelectSession(session.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div 
                          className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                          onClick={() => handleViewSession(session.id)}
                        >
                          {session.title}
                        </div>
                        <div className="text-sm text-gray-500">{session.location}</div>
                        {session.duration && (
                          <div className="text-xs text-gray-400">{session.duration} min</div>
                        )}
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
                      <div className="flex space-x-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewSession(session.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditSession(session.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
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

        {/* Create Session Modal */}
        <CreateSessionModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateSession}
        />
      </div>
    </Layout>
  );
};

export default DemoSessions;
