import React, { useState } from 'react';
import { X, Plus, User, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { User as ApiUser } from '@/types/api';

export interface Participant {
  id: string;
  email: string;
  name: string;
  role: 'host' | 'co-host' | 'attendee';
}

interface ParticipantManagerProps {
  participants: Participant[];
  onParticipantsChange: (participants: Participant[]) => void;
  availableUsers: ApiUser[];
}

export const ParticipantManager: React.FC<ParticipantManagerProps> = ({
  participants,
  onParticipantsChange,
  availableUsers,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newParticipantRole, setNewParticipantRole] = useState<Participant['role']>('attendee');

  const addParticipant = () => {
    if (!selectedUserId) return;

    const userToAdd = availableUsers.find(u => u.id === selectedUserId);

    if (userToAdd && !participants.some(p => p.id === userToAdd.id)) {
      const newParticipant: Participant = {
        id: userToAdd.id,
        name: userToAdd.name,
        email: userToAdd.email,
        role: newParticipantRole,
      };
      onParticipantsChange([...participants, newParticipant]);
      setSelectedUserId(null); // Reset selection
      setNewParticipantRole('attendee'); // Reset role
    }
  };

  const removeParticipant = (id: string) => {
    onParticipantsChange(participants.filter(p => p.id !== id));
  };

  const updateParticipantRole = (id: string, role: Participant['role']) => {
    onParticipantsChange(
      participants.map(p => p.id === id ? { ...p, role } : p)
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'host': return 'bg-purple-100 text-purple-800';
      case 'co-host': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'host': return <Shield className="h-3 w-3" />;
      case 'co-host': return <User className="h-3 w-3" />;
      default: return <Users className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Add New Participant */}
      <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
        <div className="md:col-span-2">
            <Label htmlFor="participant-select">Participant</Label>
            <Select value={selectedUserId ?? ''} onValueChange={setSelectedUserId}>
                <SelectTrigger id="participant-select">
                    <SelectValue placeholder="Select a user to add" />
                </SelectTrigger>
                <SelectContent>
                    {availableUsers.map(user => (
                        <SelectItem key={user.id} value={user.id} disabled={participants.some(p => p.id === user.id)}>
                            {user.name} ({user.email})
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <Label htmlFor="participant-role">Role</Label>
            <Select 
              value={newParticipantRole} 
              onValueChange={(role: 'host' | 'co-host' | 'attendee') => 
                setNewParticipantRole(role)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="attendee">Attendee</SelectItem>
                <SelectItem value="co-host">Co-Host</SelectItem>
                <SelectItem value="host">Host</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            type="button"
            onClick={addParticipant}
            className="mt-6 bg-blue-600 hover:bg-blue-700"
            disabled={!selectedUserId}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {/* Participants List */}
      {participants.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">
            Added Participants ({participants.length})
          </p>
          <div className="space-y-2">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {participant.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{participant.name}</p>
                    <p className="text-sm text-slate-600">{participant.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Select
                    value={participant.role}
                    onValueChange={(role: 'host' | 'co-host' | 'attendee') => 
                      updateParticipantRole(participant.id, role)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="attendee">Attendee</SelectItem>
                      <SelectItem value="co-host">Co-Host</SelectItem>
                      <SelectItem value="host">Host</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Badge className={getRoleColor(participant.role)}>
                    {getRoleIcon(participant.role)}
                    <span className="ml-1 capitalize">{participant.role}</span>
                  </Badge>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeParticipant(participant.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
