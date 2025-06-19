

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

interface EmailSettings {
  provider: 'gmail' | 'outlook' | 'smtp';
  smtpHost?: string;
  smtpPort?: string;
  username?: string;
  password?: string;
  fromEmail?: string;
  fromName?: string;
}

interface EmailNotificationProps {
  sessionData?: {
    title: string;
    date: string;
    time: string;
    location: string;
    participants: Array<{ email: string; name: string; role: string }>;
  };
  onSendInvitations?: (emails: string[]) => void;
}

export const EmailIntegration: React.FC<EmailNotificationProps> = ({
  sessionData,
  onSendInvitations
}) => {
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    provider: 'gmail',
    fromEmail: '',
    fromName: 'Demo Tracker',
  });
  
  const [emailTemplate, setEmailTemplate] = useState({
    subject: 'You\'re invited to a demo session: {{sessionTitle}}',
    body: `Hi {{participantName}},

You've been invited to join a demo session!

📅 Session Details:
• Title: {{sessionTitle}}
• Date: {{sessionDate}}
• Time: {{sessionTime}}
• Location: {{sessionLocation}}
• Your Role: {{participantRole}}

Please mark your calendar and join us for this exciting session.

Best regards,
Demo Tracker Team`
  });

  const [notifications, setNotifications] = useState({
    sendInvitations: true,
    sendReminders: true,
    sendRecordings: true,
    reminderTime: '24', // hours before
  });

  const { toast } = useToast();

  const handleSendInvitations = async () => {
    if (!sessionData || !sessionData.participants.length) {
      toast({
        title: "No participants",
        description: "Please add participants before sending invitations.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate sending emails
      const emails = sessionData.participants.map(p => p.email);
      
      // Replace template variables with actual string replacement
      const personalizedEmails = sessionData.participants.map(participant => ({
        to: participant.email,
        subject: emailTemplate.subject
          .replace('{{sessionTitle}}', sessionData.title),
        body: emailTemplate.body
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
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Provider Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Email Provider Settings
          </CardTitle>
          <CardDescription>
            Configure your email provider for sending notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email-provider">Email Provider</Label>
            <Select 
              value={emailSettings.provider} 
              onValueChange={(value: 'gmail' | 'outlook' | 'smtp') => 
                setEmailSettings(prev => ({ ...prev, provider: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gmail">Gmail</SelectItem>
                <SelectItem value="outlook">Outlook</SelectItem>
                <SelectItem value="smtp">Custom SMTP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="from-email">From Email</Label>
              <Input
                id="from-email"
                type="email"
                value={emailSettings.fromEmail}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
                placeholder="demo@company.com"
              />
            </div>
            <div>
              <Label htmlFor="from-name">From Name</Label>
              <Input
                id="from-name"
                type="text"
                value={emailSettings.fromName}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, fromName: e.target.value }))}
                placeholder="Demo Tracker"
              />
            </div>
          </div>

          {emailSettings.provider === 'smtp' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="smtp-host">SMTP Host</Label>
                <Input
                  id="smtp-host"
                  type="text"
                  value={emailSettings.smtpHost || ''}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div>
                <Label htmlFor="smtp-port">SMTP Port</Label>
                <Input
                  id="smtp-port"
                  type="text"
                  value={emailSettings.smtpPort || ''}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPort: e.target.value }))}
                  placeholder="587"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Template */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Email Template
          </CardTitle>
          <CardDescription>
            Customize the invitation email template
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email-subject">Subject Line</Label>
            <Input
              id="email-subject"
              type="text"
              value={emailTemplate.subject}
              onChange={(e) => setEmailTemplate(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="You're invited to a demo session"
            />
          </div>
          
          <div>
            <Label htmlFor="email-body">Email Body</Label>
            <Textarea
              id="email-body"
              value={emailTemplate.body}
              onChange={(e) => setEmailTemplate(prev => ({ ...prev, body: e.target.value }))}
              rows={10}
              placeholder="Enter your email template..."
            />
            <p className="text-sm text-slate-500 mt-2">
              Available variables: {{participantName}}, {{sessionTitle}}, {{sessionDate}}, {{sessionTime}}, {{sessionLocation}}, {{participantRole}}
            </p>
          </div>
        </CardContent>
      </Card>

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
              checked={notifications.sendInvitations}
              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sendInvitations: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Send Reminders</Label>
              <p className="text-sm text-slate-500">Send reminder emails before sessions</p>
            </div>
            <Switch
              checked={notifications.sendReminders}
              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sendReminders: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Send Recordings</Label>
              <p className="text-sm text-slate-500">Send recording links after sessions</p>
            </div>
            <Switch
              checked={notifications.sendRecordings}
              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sendRecordings: checked }))}
            />
          </div>

          {notifications.sendReminders && (
            <div>
              <Label htmlFor="reminder-time">Reminder Time</Label>
              <Select 
                value={notifications.reminderTime} 
                onValueChange={(value) => setNotifications(prev => ({ ...prev, reminderTime: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour before</SelectItem>
                  <SelectItem value="24">24 hours before</SelectItem>
                  <SelectItem value="48">48 hours before</SelectItem>
                  <SelectItem value="168">1 week before</SelectItem>
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

              <Button onClick={handleSendInvitations} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Invitations to All Participants
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

