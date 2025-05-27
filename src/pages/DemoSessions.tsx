
import React, { useState } from 'react';
import { Calendar, Clock, Users, Plus, Search, Filter, Download, Trash2, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Layout } from '../components/Layout';

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
}

const DemoSessions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [technologyFilter, setTechnologyFilter] = useState('all');
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);

  const demoSessions: DemoSession[] = [
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
      difficulty: 'Advanced'
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
      difficulty: 'Intermediate'
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
      difficulty: 'Advanced'
    }
  ];

  const filteredSessions = demoSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.technology.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    const matchesTechnology = technologyFilter === 'all' || session.technology === technologyFilter;
    
    return matchesSearch && matchesStatus && matchesTechnology;
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
    console.log(`Performing ${action} on sessions:`, selectedSessions);
    // Implement bulk actions
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
    link.setAttribute("download", "demo_sessions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <Button>
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

        {/* Filters and Search */}
        <Card>
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
                      checked={selectedSessions.length === filteredSessions.length}
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
                        <div className="font-medium">{session.title}</div>
                        <div className="text-sm text-gray-500">{session.location}</div>
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
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600">
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
      </div>
    </Layout>
  );
};

export default DemoSessions;
