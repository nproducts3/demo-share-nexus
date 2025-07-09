import React, { useState } from 'react';
import { Mail, Send, Settings, Calendar, Clock, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface EmailNotificationProps {
  sessionData?: {
    title: string;
    date: string;
    time: string;
    location: string;
    participants: Array<{ email: string; name: string; role: string }>;
  };
  onSendInvitations?: (emails: string[]) => void;
  onCreateAndSendSession?: () => Promise<void>;
  formData?: {
    emailProvider: string;
    fromEmail: string;
    fromName: string;
    emailSubject: string;
    emailBody: string;
    sendInvitations: boolean;
    sendReminders: boolean;
    sendRecordings: boolean;
    reminderTime: string;
  };
  onInputChange?: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

// Utility function to replace email template placeholders
const processEmailTemplate = (
  template: string, 
  sessionData: { title: string; date: string; time: string; location: string }, 
  participantData?: { name: string; role: string }
) => {
  let processedTemplate = template;
  
  // Replace session-related placeholders
  processedTemplate = processedTemplate.replace(/\{\{sessionTitle\}\}/g, sessionData.title || '');
  processedTemplate = processedTemplate.replace(/\{\{sessionDate\}\}/g, sessionData.date || '');
  processedTemplate = processedTemplate.replace(/\{\{sessionTime\}\}/g, sessionData.time || '');
  processedTemplate = processedTemplate.replace(/\{\{sessionLocation\}\}/g, sessionData.location || '');
  
  // Replace participant-related placeholders if participant data is provided
  if (participantData) {
    processedTemplate = processedTemplate.replace(/\{\{participantName\}\}/g, participantData.name || '');
    
    // Convert role enum to readable text
    const roleText = participantData.role === 'HOST' ? 'Host' : 
                    participantData.role === 'CO_HOST' ? 'Co-Host' : 
                    participantData.role === 'ATTENDEE' ? 'Attendee' : 
                    participantData.role;
    
    processedTemplate = processedTemplate.replace(/\{\{participantRole\}\}/g, roleText);
  }
  
  return processedTemplate;
};

export const EmailIntegration: React.FC<EmailNotificationProps> = ({
  sessionData,
  onSendInvitations,
  onCreateAndSendSession,
  formData,
  onInputChange,
  errors
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSendInvitations = async () => {
    if (!sessionData || !sessionData.participants.length) {
      toast({
        title: "No participants",
        description: "Please add participants before sending invitations.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // If we have a callback to create and send the session, use it
      if (onCreateAndSendSession) {
        await onCreateAndSendSession();
        return;
      }

      // Fallback to the old behavior for backward compatibility
      const emails = sessionData.participants.map(p => p.email);
      
      // Replace template variables
      const personalizedEmails = sessionData.participants.map(participant => ({
        to: participant.email,
        subject: formData?.emailSubject || 'You\'re invited to a demo session: {{sessionTitle}}'
          .replace('{{sessionTitle}}', sessionData.title),
        body: formData?.emailBody || 'Hi {{participantName}},\n\nYou\'ve been invited to join a demo session!\n\n📅 Session Details:\n• Title: {{sessionTitle}}\n• Date: {{sessionDate}}\n• Time: {{sessionTime}}\n• Location: {{sessionLocation}}\n• Your Role: {{participantRole}}\n\nPlease mark your calendar and join us for this exciting session.\n\nBest regards,\nDemo Tracker Team'
          .replace('{{participantName}}', participant.name)
          .replace('{{sessionTitle}}', sessionData.title)
          .replace('{{sessionDate}}', sessionData.date)
          .replace('{{sessionTime}}', sessionData.time)
          .replace('{{sessionLocation}}', sessionData.location)
          .replace('{{participantRole}}', participant.role)
      }));

      console.log('Sending invitations:', personalizedEmails);
      
      if (onSendInvitations) {
        onSendInvitations(emails);
      }

      toast({
        title: "Invitations sent!",
        description: `Email invitations sent to ${emails.length} participants.`,
      });
    } catch (error) {
      console.error('Error sending invitations:', error);
      toast({
        title: "Error",
        description: "Failed to send invitations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Configure when and what notifications to send
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Send Invitations</Label>
              <p className="text-sm text-slate-500">Send email invitations when creating sessions</p>
            </div>
            <Switch
              checked={formData?.sendInvitations || false}
              onCheckedChange={(checked) => onInputChange?.('sendInvitations', checked.toString())}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Send Reminders</Label>
              <p className="text-sm text-slate-500">Send reminder emails before sessions</p>
            </div>
            <Switch
              checked={formData?.sendReminders || false}
              onCheckedChange={(checked) => onInputChange?.('sendReminders', checked.toString())}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Send Recordings</Label>
              <p className="text-sm text-slate-500">Send recording links after sessions</p>
            </div>
            <Switch
              checked={formData?.sendRecordings || false}
              onCheckedChange={(checked) => onInputChange?.('sendRecordings', checked.toString())}
            />
          </div>

          {formData?.sendReminders && (
            <div>
              <Label htmlFor="reminder-time">Reminder Time</Label>
              <Select 
                value={formData.reminderTime} 
                onValueChange={(value) => onInputChange?.('reminderTime', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ONE_HOUR">1 hour before</SelectItem>
                  <SelectItem value="TWENTY_FOUR_HOURS">24 hours before</SelectItem>
                  <SelectItem value="FORTY_EIGHT_HOURS">48 hours before</SelectItem>
                  <SelectItem value="ONE_WEEK">1 week before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Send Invitations */}
      {sessionData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="h-5 w-5 mr-2" />
              Send Invitations
            </CardTitle>
            <CardDescription>
              Send email invitations to all participants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium mb-2">Session Preview</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                    <span>{sessionData.title}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-slate-500" />
                    <span>{sessionData.date} at {sessionData.time}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                    <span>{sessionData.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-slate-500" />
                    <span>{sessionData.participants.length} participants</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {sessionData.participants.map((participant, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center">
                    <Mail className="h-3 w-3 mr-1" />
                    {participant.email}
                  </Badge>
                ))}
              </div>

              <Button onClick={handleSendInvitations} className="w-full" disabled={isLoading}>
                <Send className="h-4 w-4 mr-2" />
                {isLoading ? 'Creating Session...' : 'Create Session & Send Invitations'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
