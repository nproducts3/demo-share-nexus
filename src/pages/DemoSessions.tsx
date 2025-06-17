import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, Plus, Search, Download, Trash2, Edit, Eye, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Layout } from '../components/Layout';
import { CreateSessionModal } from '../components/CreateSessionModal';
import { EditSessionModal } from '../components/EditSessionModal';
import { useToast } from '@/hooks/use-toast';
import { sessionApi, DemoSession } from '../services/api';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import { updateSessionsWithAttendees } from '../utils/updateSampleData';

interface PaginatedSessionsResponse {
  data: DemoSession[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
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
  const [editingType, setEditingType] = useState<string | null>(null);
  const [demoSessions, setDemoSessions] = useState<DemoSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<DemoSession | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<DemoSession | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(10);

  // Fetch sessions with pagination
  const fetchSessions = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await sessionApi.getAll(page, pageSize);
      
      // Handle both paginated and non-paginated responses
      if (response && typeof response === 'object' && 'data' in response) {
        const paginatedResponse = response as PaginatedSessionsResponse;
        setDemoSessions(paginatedResponse.data || []);
        setTotalPages(paginatedResponse.totalPages || 1);
        setTotalItems(paginatedResponse.totalItems || 0);
        setCurrentPage(paginatedResponse.currentPage || 1);
      } else {
        // Fallback for non-paginated response
        const sessions = Array.isArray(response) ? response : [];
        setDemoSessions(sessions);
        setTotalPages(1);
        setTotalItems(sessions.length);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sessions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch sessions on component mount and page change
  useEffect(() => {
    fetchSessions(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSelectedSessions([]); // Clear selections when changing pages
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleUpdateSampleData = async () => {
    try {
      await updateSessionsWithAttendees();
      // Refresh the sessions data
      await fetchSessions(currentPage);
      toast({
        title: "Sample Data Updated",
        description: "Sessions have been updated with attendee data to demonstrate metrics.",
      });
    } catch (error) {
      console.error('Error updating sample data:', error);
      toast({
        title: "Error",
        description: "Failed to update sample data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredSessions = Array.isArray(demoSessions) ? demoSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.technology.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    const matchesTechnology = technologyFilter === 'all' || session.technology === technologyFilter;
    const matchesDifficulty = difficultyFilter === 'all' || session.difficulty === difficultyFilter;
    
    return matchesSearch && matchesStatus && matchesTechnology && matchesDifficulty;
  }) : [];

  const technologies = Array.isArray(demoSessions) ? Array.from(new Set(demoSessions.map(session => session.technology))) : [];

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

  const getTypeBadge = (type: string) => {
    const colors = {
      'PRODUCT_BASED': 'bg-indigo-100 text-indigo-800',
      'PROJECT_BASED': 'bg-emerald-100 text-emerald-800'
    };
    const displayNames = {
      'PRODUCT_BASED': 'Product-based',
      'PROJECT_BASED': 'Project-based'
    };
    return <Badge className={colors[type as keyof typeof colors]}>
      {displayNames[type as keyof typeof displayNames] || type}
    </Badge>;
  };

  const handleTypeEdit = async (sessionId: string, newType: 'PROJECT_BASED' | 'PRODUCT_BASED') => {
    try {
      const result = await sessionApi.update(sessionId, { type: newType });
      setDemoSessions(prev => prev.map(session => 
        session.id === sessionId ? { ...session, type: newType } : session
      ));
      setEditingType(null);
      toast({
        title: "Type Updated",
        description: "Session type has been updated successfully.",
      });
    } catch (error: unknown) {
      console.error('Error updating session type:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update session type. Please try again.",
        variant: "destructive"
      });
    }
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

  const handleBulkAction = async (action: string) => {
    const sessionTitles = demoSessions
      .filter(session => selectedSessions.includes(session.id))
      .map(session => session.title)
      .join(', ');

    if (action === 'delete') {
      try {
        await Promise.all(selectedSessions.map(id => sessionApi.delete(id)));
        await fetchSessions(currentPage); // Refresh current page
        setSelectedSessions([]);
        toast({
          title: "Sessions Deleted",
          description: `Deleted sessions: ${sessionTitles}`,
        });
      } catch (error) {
        console.error('Error deleting sessions:', error);
        toast({
          title: "Error",
          description: "Failed to delete some sessions. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: `Bulk Action: ${action}`,
        description: `Applied to: ${sessionTitles}`,
      });
    }
  };

  const handleCreateSession = async (sessionData: {
    title: string;
    technology: string;
    date: string;
    time: string;
    description: string;
    location: string;
    maxAttendees: number;
    attendees: number;
    difficulty: string;
    prerequisites: string;
    duration: string;
    createdBy: string;
    status: string;
  }) => {
    setLoading(true);
    try {
      const newSession = await sessionApi.create({
        ...sessionData,
        type: 'PROJECT_BASED' as const,
        duration: parseInt(sessionData.duration) || 0,
        difficulty: sessionData.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
        status: sessionData.status as 'upcoming' | 'completed' | 'cancelled'
      });
      setDemoSessions(prev => [newSession, ...prev]);
      setIsCreateModalOpen(false);
      toast({
        title: "Success",
        description: "Demo session created successfully.",
      });
    } catch (error: unknown) {
      console.error('Error creating session:', error);
      toast({
        title: "Error",
        description: "Failed to create session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditSession = async (sessionId: string) => {
    const session = demoSessions.find(s => s.id === sessionId);
    if (session) {
      setEditingSession(session);
      setEditModalOpen(true);
    }
  };

  const handleEditSessionSubmit = async (updatedSession: DemoSession) => {
    setEditLoading(true);
    try {
      const result = await sessionApi.update(updatedSession.id, updatedSession);
      setDemoSessions(prev => prev.map(s => s.id === updatedSession.id ? result : s));
      setEditModalOpen(false);
      setEditingSession(null);
      toast({
        title: "Success",
        description: `Session "${result.title}" has been updated successfully.`,
      });
    } catch (error: unknown) {
      console.error('Error updating session:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    const session = demoSessions.find(s => s.id === sessionId);
    if (session) {
      setSessionToDelete(session);
      setDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!sessionToDelete) return;
    
    setDeleteLoading(true);
    try {
      await sessionApi.delete(sessionToDelete.id);
      await fetchSessions(currentPage); // Refresh current page
      setDeleteModalOpen(false);
      setSessionToDelete(null);
      toast({
        title: "Session Deleted",
        description: `"${sessionToDelete.title}" has been deleted successfully.`,
        variant: "destructive"
      });
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: "Error",
        description: "Failed to delete session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleViewSession = (sessionId: string) => {
    navigate(`/session/${sessionId}`);
  };

  const exportSessions = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Title,Type,Technology,Date,Time,Status,Attendees,Location,Difficulty,Duration,Prerequisites\n" +
      filteredSessions.map(session => 
        `"${session.title}","${session.type}","${session.technology}","${session.date}","${session.time}","${session.status}","${session.attendees}/${session.maxAttendees}","${session.location}","${session.difficulty}","${session.duration || 'N/A'}","${session.prerequisites || 'None'}"`
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

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading sessions...</div>
        </div>
      </Layout>
    );
  }

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
            <Button variant="outline" onClick={handleUpdateSampleData}>
              Update Sample Data
            </Button>
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
                  <p className="text-2xl font-bold">{totalItems}</p>
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
                  <p className="text-2xl font-bold">{demoSessions.reduce((sum, s) => sum + (s.attendees || 0), 0)}</p>
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
                    {(() => {
                      const totalAttendees = demoSessions.reduce((sum, s) => sum + (s.attendees || 0), 0);
                      const totalMax = demoSessions.reduce((sum, s) => sum + (s.maxAttendees || 0), 0);
                      return totalMax > 0 ? `${Math.round((totalAttendees / totalMax) * 100)}%` : '0%';
                    })()}
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
                 
                  <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Selected
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sessions Table with Horizontal ScrollArea */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Sessions ({filteredSessions.length} of {totalItems})</CardTitle>
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className={`w-full ${filteredSessions.length === 0 ? 'h-[100px]' : 'h-auto'}`}>
              <div className="min-w-[1200px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedSessions.length === filteredSessions.length && filteredSessions.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="min-w-[200px]">Session</TableHead>
                      <TableHead className="min-w-[150px]">Type</TableHead>
                      <TableHead className="min-w-[120px]">Technology</TableHead>
                      <TableHead className="min-w-[150px]">Date & Time</TableHead>
                      <TableHead className="min-w-[100px]">Attendees</TableHead>
                      <TableHead className="min-w-[120px]">Status</TableHead>
                      <TableHead className="min-w-[100px]">Difficulty</TableHead>
                      <TableHead className="min-w-[150px]">Location</TableHead>
                      <TableHead className="min-w-[100px]">Duration</TableHead>
                      <TableHead className="min-w-[120px]">Actions</TableHead>
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
                            <div className="text-sm text-gray-500 truncate max-w-[180px]">
                              {session.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {editingType === session.id ? (
                            <div className="flex items-center space-x-1">
                              <Select
                                value={session.type}
                                onValueChange={(value: 'PROJECT_BASED' | 'PRODUCT_BASED') => handleTypeEdit(session.id, value)}
                              >
                                <SelectTrigger className="w-32 h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="PROJECT_BASED">PROJECT_BASED</SelectItem>
                                  <SelectItem value="PRODUCT_BASED">PRODUCT_BASED</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 w-6 p-0"
                                onClick={() => setEditingType(null)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1">
                              {getTypeBadge(session.type)}
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 w-6 p-0"
                                onClick={() => setEditingType(session.id)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
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
                            <span>{session.maxAttendees}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(session.status)}</TableCell>
                        <TableCell>{getDifficultyBadge(session.difficulty)}</TableCell>
                        <TableCell>
                          <div className="truncate max-w-[120px]" title={session.location}>
                            {session.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{session.duration ? `${session.duration} min` : 'N/A'}</span>
                        </TableCell>
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
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {/* Enhanced Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} sessions
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage <= 1}
                    className="flex items-center space-x-1"
                  >
                    <span>Previous</span>
                  </Button>
                  
                  <Select
                    value={currentPage.toString()}
                    onValueChange={(value) => handlePageChange(parseInt(value))}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder={`Page ${currentPage}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        return (
                          <SelectItem key={page} value={page.toString()}>
                            Page {page}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                    className="flex items-center space-x-1"
                  >
                    <span>Next</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Session Modal */}
        <CreateSessionModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateSession}
        />

        {/* Edit Session Modal */}
        <EditSessionModal
          open={editModalOpen}
          setOpen={setEditModalOpen}
          session={editingSession}
          onEditSession={handleEditSessionSubmit}
          loading={editLoading}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          open={deleteModalOpen}
          setOpen={setDeleteModalOpen}
          title="Delete Session"
          description={`Are you sure you want to delete "${sessionToDelete?.title}"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          loading={deleteLoading}
        />
      </div>
    </Layout>
  );
};

export default DemoSessions;
