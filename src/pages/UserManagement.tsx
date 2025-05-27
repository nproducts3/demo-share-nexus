
import React, { useState } from 'react';
import { Users, Plus, Search, UserCheck, UserX, Mail, Phone, Calendar, Edit, Trash2, Shield, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Layout } from '../components/Layout';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastLogin: string;
  department: string;
  sessionsAttended: number;
  sessionsCreated: number;
  totalHours: number;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  phone?: string;
  avatar?: string;
}

const UserManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [skillLevelFilter, setSkillLevelFilter] = useState('all');

  const [users, setUsers] = useState<User[]>([
    {
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
      phone: '+1 (555) 123-4567'
    },
    {
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
      phone: '+1 (555) 987-6543'
    },
    {
      id: '3',
      name: 'Alice Smith',
      email: 'alice@demo.com',
      role: 'employee',
      status: 'active',
      joinDate: '2023-09-20',
      lastLogin: '2024-01-10',
      department: 'Design',
      sessionsAttended: 8,
      sessionsCreated: 2,
      totalHours: 32,
      skillLevel: 'Beginner',
      phone: '+1 (555) 456-7890'
    },
    {
      id: '4',
      name: 'Bob Wilson',
      email: 'bob@demo.com',
      role: 'employee',
      status: 'inactive',
      joinDate: '2023-03-05',
      lastLogin: '2023-12-15',
      department: 'Marketing',
      sessionsAttended: 5,
      sessionsCreated: 1,
      totalHours: 20,
      skillLevel: 'Beginner'
    },
    {
      id: '5',
      name: 'Sarah Johnson',
      email: 'sarah@demo.com',
      role: 'employee',
      status: 'pending',
      joinDate: '2024-01-01',
      lastLogin: '2024-01-01',
      department: 'Marketing',
      sessionsAttended: 0,
      sessionsCreated: 0,
      totalHours: 0,
      skillLevel: 'Beginner',
      phone: '+1 (555) 111-2222'
    },
    {
      id: '6',
      name: 'Mike Davis',
      email: 'mike@demo.com',
      role: 'admin',
      status: 'active',
      joinDate: '2023-02-20',
      lastLogin: '2024-01-09',
      department: 'Operations',
      sessionsAttended: 18,
      sessionsCreated: 8,
      totalHours: 85,
      skillLevel: 'Advanced',
      phone: '+1 (555) 333-4444'
    }
  ]);

  const departments = Array.from(new Set(users.map(user => user.department)));

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter;
    const matchesSkillLevel = skillLevelFilter === 'all' || user.skillLevel === skillLevelFilter;
    
    return matchesSearch && matchesRole && matchesStatus && matchesDepartment && matchesSkillLevel;
  });

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
      <Badge className="bg-purple-100 text-purple-800 border-purple-300">
        <Shield className="h-3 w-3 mr-1" />
        Admin
      </Badge> :
      <Badge variant="outline">Employee</Badge>;
  };

  const getSkillBadge = (skill: string) => {
    const colors = {
      'Beginner': 'bg-blue-100 text-blue-800',
      'Intermediate': 'bg-yellow-100 text-yellow-800',
      'Advanced': 'bg-green-100 text-green-800'
    };
    return <Badge className={colors[skill as keyof typeof colors]}>{skill}</Badge>;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleEditUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    toast({
      title: "Edit User",
      description: `Opening editor for ${user?.name}`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
    toast({
      title: "User Deleted",
      description: `${user?.name} has been removed from the system.`,
    });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setStatusFilter('all');
    setDepartmentFilter('all');
    setSkillLevelFilter('all');
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const avgSessionsPerUser = users.length > 0 ? Math.round(users.reduce((sum, u) => sum + u.sessionsAttended, 0) / users.length) : 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage users, roles, and permissions</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold">{activeUsers}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Admins</p>
                  <p className="text-2xl font-bold">{adminUsers}</p>
                </div>
                <Shield className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Sessions</p>
                  <p className="text-2xl font-bold">{avgSessionsPerUser}</p>
                </div>
                <Award className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">All Users</TabsTrigger>
            <TabsTrigger value="analytics">User Analytics</TabsTrigger>
            <TabsTrigger value="roles">Role Management</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            {/* Integrated Filters */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Search & Filter Users</CardTitle>
                  <Button variant="outline" size="sm" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  <div className="lg:col-span-2">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        placeholder="Search users, email, or department..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={skillLevelFilter} onValueChange={setSkillLevelFilter}>
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

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>Users ({filteredUsers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sessions</TableHead>
                      <TableHead>Skill Level</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {user.email}
                              </div>
                              {user.phone && (
                                <div className="text-sm text-gray-500 flex items-center">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {user.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm font-medium">Attended: {user.sessionsAttended}</div>
                            {user.role === 'admin' && (
                              <div className="text-sm text-gray-500">Created: {user.sessionsCreated}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getSkillBadge(user.skillLevel)}</TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(user.lastLogin).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditUser(user.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteUser(user.id)}
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
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* User Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Engagement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.sessionsAttended} sessions</div>
                        </div>
                      </div>
                      <Progress value={(user.sessionsAttended / 30) * 100} className="w-20" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Department Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {departments.map((dept) => {
                    const deptUsers = users.filter(u => u.department === dept);
                    const percentage = (deptUsers.length / totalUsers) * 100;
                    return (
                      <div key={dept} className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{dept}</div>
                          <div className="text-xs text-gray-500">{deptUsers.length} users</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={percentage} className="w-20" />
                          <span className="text-xs text-gray-600">{Math.round(percentage)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {users
                    .sort((a, b) => b.sessionsAttended - a.sessionsAttended)
                    .slice(0, 3)
                    .map((user, index) => (
                      <div key={user.id} className="text-center p-4 border rounded-lg">
                        <div className="relative">
                          <Avatar className="h-16 w-16 mx-auto mb-3">
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          {index === 0 && (
                            <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                              1
                            </div>
                          )}
                        </div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.department}</div>
                        <div className="text-lg font-bold text-blue-600">{user.sessionsAttended}</div>
                        <div className="text-xs text-gray-500">sessions attended</div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-6">
            {/* Role Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Permissions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm">Create Demo Sessions</span>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm">Manage Users</span>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm">View Analytics</span>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm">Export Data</span>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Employee Permissions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm">View Demo Sessions</span>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm">Join Sessions</span>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm">View Own Profile</span>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm">Create Sessions</span>
                    <Badge className="bg-red-100 text-red-800">Disabled</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UserManagement;
