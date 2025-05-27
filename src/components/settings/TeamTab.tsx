
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Shield, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TeamMember } from '../../types/settings';

export const TeamTab = () => {
  const { toast } = useToast();
  const [showNewMemberForm, setShowNewMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'Employee', department: '' });
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('teamMembers');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@company.com',
        role: 'Admin',
        status: 'active',
        lastLogin: '2 hours ago',
        joinedDate: '2024-01-15'
      },
      {
        id: '2',
        name: 'Mike Chen',
        email: 'mike@company.com',
        role: 'Employee',
        status: 'active',
        lastLogin: '1 day ago',
        joinedDate: '2024-02-01'
      },
      {
        id: '3',
        name: 'Emma Wilson',
        email: 'emma@company.com',
        role: 'Manager',
        status: 'inactive',
        lastLogin: '1 week ago',
        joinedDate: '2024-01-20'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
  }, [teamMembers]);

  const handleAddTeamMember = () => {
    if (!newMember.name || !newMember.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (teamMembers.find(member => member.email === newMember.email)) {
      toast({
        title: "Error",
        description: "A team member with this email already exists.",
        variant: "destructive"
      });
      return;
    }

    const member: TeamMember = {
      id: Date.now().toString(),
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      status: 'active',
      lastLogin: 'Never',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setTeamMembers([...teamMembers, member]);
    setNewMember({ name: '', email: '', role: 'Employee', department: '' });
    setShowNewMemberForm(false);
    
    toast({
      title: "Team Member Added",
      description: `${member.name} has been added to your team.`,
    });
  };

  const handleRemoveTeamMember = (id: string) => {
    const member = teamMembers.find(m => m.id === id);
    setTeamMembers(teamMembers.filter(member => member.id !== id));
    toast({
      title: "Team Member Removed",
      description: `${member?.name} has been removed from your team.`,
    });
  };

  const handleToggleMemberStatus = (id: string) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id 
        ? { ...member, status: member.status === 'active' ? 'inactive' : 'active' }
        : member
    ));
    toast({
      title: "Status Updated",
      description: "Team member status has been updated.",
    });
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-green-600" />
            Team Management ({teamMembers.length} members)
          </div>
          <Button
            size="sm"
            onClick={() => setShowNewMemberForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </CardTitle>
        <CardDescription>
          Manage your team members and their permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showNewMemberForm && (
          <Card className="mb-6 border border-blue-200 bg-blue-50/50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-name">Name *</Label>
                  <Input
                    id="new-name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-email">Email *</Label>
                  <Input
                    id="new-email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-role">Role</Label>
                  <select
                    id="new-role"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
                  >
                    <option value="Employee">Employee</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewMemberForm(false)}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleAddTeamMember}>
                  Add Member
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 rounded-lg bg-white border border-slate-200">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{member.name}</p>
                  <p className="text-sm text-slate-600">{member.email}</p>
                  <p className="text-xs text-slate-500">Joined: {member.joinedDate}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge 
                  variant={member.status === 'active' ? 'default' : 'secondary'}
                  className="cursor-pointer"
                  onClick={() => handleToggleMemberStatus(member.id)}
                >
                  {member.status}
                </Badge>
                <Badge variant="outline">{member.role}</Badge>
                <span className="text-sm text-slate-500 min-w-[80px]">{member.lastLogin}</span>
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingMember(editingMember === member.id ? null : member.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveTeamMember(member.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
