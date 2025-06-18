
import React, { useState } from 'react';
import { X, Plus, Mail, User, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export interface Participant {
  id: string;
  email: string;
  name: string;
  role: 'host' | 'co-host' | 'attendee';
}

interface ParticipantManagerProps {
  participants: Participant[];
  onParticipantsChange: (participants: Participant[]) => void;
}

export const ParticipantManager: React.FC<ParticipantManagerProps> = ({
  participants,
  onParticipantsChange,
}) => {
  const [newParticipant, setNewParticipant] = useState<{
    email: string;
    name: string;
    role: 'host' | 'co-host' | 'attendee';
  }>({
    email: '',
    name: '',
    role: 'attendee',
  });

  const addParticipant = () => {
    if (!newParticipant.email || !newParticipant.name) return;

    const participant: Participant = {
      id: Date.now().toString(),
      ...newParticipant,
    };

    onParticipantsChange([...participants, participant]);
    setNewParticipant({ email: '', name: '', role: 'attendee' });
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
      <div className="flex items-center mb-3">
        <Users className="h-5 w-5 mr-2 text-gray-600" />
        <h3 className="text-lg font-medium">Participants</h3>
      </div>

      {/* Add New Participant */}
      <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="participant-name">Name</Label>
            <Input
              id="participant-name"
              type="text"
              value={newParticipant.name}
              onChange={(e) => setNewParticipant(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter participant name"
            />
          </div>
          <div>
            <Label htmlFor="participant-email">Email</Label>
            <Input
              id="participant-email"
              type="email"
              value={newParticipant.email}
              onChange={(e) => setNewParticipant(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <Label htmlFor="participant-role">Role</Label>
            <Select 
              value={newParticipant.role} 
              onValueChange={(role: 'host' | 'co-host' | 'attendee') => 
                setNewParticipant(prev => ({ ...prev, role }))
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
            disabled={!newParticipant.email || !newParticipant.name}
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
                    <div className="flex items-center space-x-2">
                      <Mail className="h-3 w-3 text-slate-400" />
                      <p className="text-sm text-slate-600">{participant.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Select
                    value={participant.role}
                    onValueChange={(role: 'host' | 'co-host' | 'attendee') => 
                      updateParticipantRole(participant.id, role)
                    }
                  >
                    <SelectTrigger className="w-24">
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
