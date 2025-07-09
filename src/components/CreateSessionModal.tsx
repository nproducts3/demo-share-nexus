import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, MapPin, BookOpen, Mail, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ParticipantManager, Participant } from './ParticipantManager';
import { EmailIntegration } from './EmailIntegration';
import { sessionApi } from '../services/sessionApi';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/types/api';

interface PaginatedUsersResponse {
  data: User[];
}

function isPaginated(response: User[] | PaginatedUsersResponse): response is PaginatedUsersResponse {
  return (response as PaginatedUsersResponse).data !== undefined;
}

interface SessionData {
  title: string;
  technology: string;
  date: string;
  time: string;
  description: string;
  location: string;
  maxAttendees: string;
  attendees: string;
  difficulty: string;
  prerequisites: string;
  duration: string;
  createdBy: string;
  status: string;
  name: string;
  type: string;
  userIds: string[];
  role: string;
  emailProvider: string;
  fromEmail: string;
  fromName: string;
  emailSubject: string;
  emailBody: string;
  sendInvitations: boolean;
  sendReminders: boolean;
  sendRecordings: boolean;
  reminderTime: string;
  participants: Array<{
    name: string;
    email: string;
    role: 'HOST' | 'CO_HOST' | 'ATTENDEE';
  }>;
}

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sessionData: {
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
    duration: number;
    createdBy: string;
    name: string[];
    type: string;
    role: string;
    status: string;
    emailProvider: string;
    fromEmail: string;
    fromName: string;
    emailSubject: string;
    emailBody: string;
    sendInvitations: boolean;
    sendReminders: boolean;
    sendRecordings: boolean;
    reminderTime: string;
    userIds: string[];
  }) => void;
}

const technologies = [
  'React', 'Angular', 'Vue.js', 'Node.js', 'Python', 'Java', 'TypeScript', 
  'JavaScript', 'MongoDB', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'Azure',
  'GraphQL', 'REST API', 'Firebase', 'Next.js', 'Express.js', 'Django'
];

const locations = [
  'Conference Room A', 'Conference Room B', 'Main Hall', 'Tech Lab', 
  'Training Room 1', 'Training Room 2', 'Auditorium', 'Virtual/Online'
];

export const CreateSessionModal: React.FC<CreateSessionModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SessionData>({
    title: '',
    technology: '',
    date: '',
    time: '',
    description: '',
    location: '',
    maxAttendees: '',
    attendees: '0',
    difficulty: '',
    prerequisites: '',
    duration: '',
    createdBy: '',
    name: '',
    type: 'PROJECT_BASED',
    userIds: [],
    role: 'HOST',
    emailProvider: 'GMAIL' as 'GMAIL' | 'OUTLOOK' | 'SMTP',
    fromEmail: '',
    fromName: 'Demo Tracker',
    emailSubject: 'You\'re invited to a demo session: {{sessionTitle}}',
    emailBody: 'Hi {{participantName}},\n\nYou\'ve been invited to join a demo session!\n\n📅 Session Details:\n• Title: {{sessionTitle}}\n• Date: {{sessionDate}}\n• Time: {{sessionTime}}\n• Location: {{sessionLocation}}\n• Your Role: {{participantRole}}\n\nPlease mark your calendar and join us for this exciting session.\n\nBest regards,\nDemo Tracker Team',
    sendInvitations: true,
    sendReminders: true,
    sendRecordings: false,
    reminderTime: 'TWENTY_FOUR_HOURS',
    status: 'upcoming',
    participants: []
  });

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const { toast } = useToast();

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 1) {
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.technology) newErrors.technology = 'Technology is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.maxAttendees || parseInt(formData.maxAttendees) < 1) {
      newErrors.maxAttendees = 'Valid max attendees is required';
    }
    if (!formData.difficulty) newErrors.difficulty = 'Difficulty level is required';
    if (!formData.createdBy.trim()) newErrors.createdBy = 'Creator name is required';
    }
    
    if (currentStep === 3) {
      if (!formData.fromEmail.trim()) newErrors.fromEmail = 'From email is required';
      if (!formData.fromName.trim()) newErrors.fromName = 'From name is required';
      if (!formData.emailSubject.trim()) newErrors.emailSubject = 'Email subject is required';
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.fromEmail && !emailRegex.test(formData.fromEmail)) {
        newErrors.fromEmail = 'Please enter a valid email address';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      setErrors({});
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      return;
    }

    try {
      // Prepare the data to be sent with participants
      const sessionDataToSend = {
        title: formData.title,
        technology: formData.technology,
        date: formData.date,
        time: formData.time,
        description: formData.description,
        location: formData.location,
        maxAttendees: parseInt(formData.maxAttendees),
        attendees: parseInt(formData.attendees),
        difficulty: formData.difficulty,
        prerequisites: formData.prerequisites || '',
        duration: parseInt(formData.duration) || 0,
        createdBy: formData.createdBy,
        name: participants.map(p => p.id),
        type: formData.type,
        role: formData.role,
        status: 'upcoming',
        emailProvider: formData.emailProvider,
        fromEmail: formData.fromEmail,
        fromName: formData.fromName,
        emailSubject: formData.emailSubject,
        emailBody: formData.emailBody,
        sendInvitations: formData.sendInvitations,
        sendReminders: formData.sendReminders,
        sendRecordings: formData.sendRecordings,
        reminderTime: formData.reminderTime,
        userIds: participants.map(p => p.id),
      };

      console.log('=== CREATE SESSION MODAL DEBUG ===');
      console.log('Form data:', formData);
      console.log('Participants:', participants);
      console.log('Prepared session data:', sessionDataToSend);

      // Submit the form with all required fields
      await onSubmit(sessionDataToSend);

      // Show success message
      toast({
        title: "Session created successfully!",
        description: `Session "${formData.title}" has been created successfully.`,
      });

      // Reset form and participants
      setFormData({
        title: '',
        technology: '',
        date: '',
        time: '',
        description: '',
        location: '',
        maxAttendees: '',
        attendees: '0',
        difficulty: '',
        prerequisites: '',
        duration: '',
        createdBy: '',
        name: '',
        type: 'PROJECT_BASED',
        userIds: [],
        role: 'HOST',
        emailProvider: 'GMAIL' as 'GMAIL' | 'OUTLOOK' | 'SMTP',
        fromEmail: '',
        fromName: 'Demo Tracker',
        emailSubject: 'You\'re invited to a demo session: {{sessionTitle}}',
        emailBody: 'Hi {{participantName}},\n\nYou\'ve been invited to join a demo session!\n\n📅 Session Details:\n• Title: {{sessionTitle}}\n• Date: {{sessionDate}}\n• Time: {{sessionTime}}\n• Location: {{sessionLocation}}\n• Your Role: {{participantRole}}\n\nPlease mark your calendar and join us for this exciting session.\n\nBest regards,\nDemo Tracker Team',
        sendInvitations: true,
        sendReminders: true,
        sendRecordings: false,
        reminderTime: 'TWENTY_FOUR_HOURS',
        status: 'upcoming',
        participants: []
      });
      setParticipants([]);
      setErrors({});
      setCurrentStep(1);
    } catch (error) {
      console.error('Error creating session:', error);
      setErrors({
        submit: 'Failed to create session. Please try again.'
      });
    }
  };

  const handleCreateAndSendSession = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    try {
      // Process email templates to show preview
      const sessionDataForTemplate = {
        title: formData.title,
        date: formData.date,
        time: formData.time,
        location: formData.location
      };

      // Process subject and body templates
      const processedSubject = processEmailTemplate(formData.emailSubject, sessionDataForTemplate);
      const processedBody = processEmailTemplate(formData.emailBody, sessionDataForTemplate, participants.length > 0 ? {
        name: participants[0].name,
        role: participants[0].role
      } : undefined);

      console.log('=== EMAIL TEMPLATE PROCESSING ===');
      console.log('Original Subject:', formData.emailSubject);
      console.log('Processed Subject:', processedSubject);
      console.log('Original Body:', formData.emailBody);
      console.log('Processed Body Preview:', processedBody.substring(0, 200) + '...');

      // Show preview of what participants will receive
      if (participants.length > 0) {
        const firstParticipant = participants[0];
        const personalizedBody = processEmailTemplate(formData.emailBody, sessionDataForTemplate, {
          name: firstParticipant.name,
          role: firstParticipant.role
        });
        
        console.log('=== PERSONALIZED EMAIL PREVIEW ===');
        console.log('To:', firstParticipant.email);
        console.log('Subject:', processedSubject);
        console.log('Body:', personalizedBody);
      }

      // Prepare the data to be sent with participants
      const sessionDataToSend = {
        title: formData.title,
        technology: formData.technology,
        date: formData.date,
        time: formData.time,
        description: formData.description,
        location: formData.location,
        maxAttendees: parseInt(formData.maxAttendees),
        attendees: parseInt(formData.attendees),
        difficulty: formData.difficulty,
        prerequisites: formData.prerequisites || '',
        duration: parseInt(formData.duration) || 0,
        createdBy: formData.createdBy,
        name: participants.map(p => p.id),
        type: formData.type,
        role: formData.role,
        status: 'upcoming',
        emailProvider: formData.emailProvider,
        fromEmail: formData.fromEmail,
        fromName: formData.fromName,
        emailSubject: processedSubject, // Send processed subject with placeholders replaced
        emailBody: processedBody, // Send processed body with placeholders replaced
        sendInvitations: true, // Force send invitations when using this button
        sendReminders: formData.sendReminders,
        sendRecordings: formData.sendRecordings,
        reminderTime: formData.reminderTime,
        userIds: participants.map(p => p.id),
      };

      console.log('=== CREATE AND SEND SESSION DEBUG ===');
      console.log('Form data:', formData);
      console.log('Participants:', participants);
      console.log('Prepared session data:', sessionDataToSend);

      // Submit the form with all required fields
      await onSubmit(sessionDataToSend);

      // Show success message
      toast({
        title: "Session created successfully!",
        description: `Session "${formData.title}" has been created and invitations sent to ${participants.length} participants.`,
      });

      // Reset form and participants
      setFormData({
        title: '',
        technology: '',
        date: '',
        time: '',
        description: '',
        location: '',
        maxAttendees: '',
        attendees: '0',
        difficulty: '',
        prerequisites: '',
        duration: '',
        createdBy: '',
        name: '',
        type: 'PROJECT_BASED',
        userIds: [],
        role: 'HOST',
        emailProvider: 'GMAIL' as 'GMAIL' | 'OUTLOOK' | 'SMTP',
        fromEmail: '',
        fromName: 'Demo Tracker',
        emailSubject: 'You\'re invited to a demo session: {{sessionTitle}}',
        emailBody: 'Hi {{participantName}},\n\nYou\'ve been invited to join a demo session!\n\n📅 Session Details:\n• Title: {{sessionTitle}}\n• Date: {{sessionDate}}\n• Time: {{sessionTime}}\n• Location: {{sessionLocation}}\n• Your Role: {{participantRole}}\n\nPlease mark your calendar and join us for this exciting session.\n\nBest regards,\nDemo Tracker Team',
        sendInvitations: true,
        sendReminders: true,
        sendRecordings: false,
        reminderTime: 'TWENTY_FOUR_HOURS',
        status: 'upcoming',
        participants: []
      });
      setParticipants([]);
      setErrors({});
      setCurrentStep(1);
    } catch (error) {
      console.error('Error creating and sending session:', error);
      setErrors({
        submit: 'Failed to create session and send invitations. Please try again.'
      });
    }
  };

  const sessionDataForEmail = formData.title && formData.date && formData.time ? {
    title: formData.title,
    date: formData.date,
    time: formData.time,
    location: formData.location,
    participants: participants.map(p => ({
      email: p.email,
      name: p.name,
      role: p.role
    }))
  } : undefined;

  // Compute processed email templates for display
  const processedEmailSubject = formData.title && formData.date && formData.time ? 
    processEmailTemplate(formData.emailSubject, {
      title: formData.title,
      date: formData.date,
      time: formData.time,
      location: formData.location
    }) : formData.emailSubject;

  const processedEmailBody = formData.title && formData.date && formData.time ? 
    processEmailTemplate(formData.emailBody, {
      title: formData.title,
      date: formData.date,
      time: formData.time,
      location: formData.location
    }, participants.length > 0 ? {
      name: participants[0].name,
      role: participants[0].role
    } : undefined) : formData.emailBody;

  // Debug logging
  console.log('=== COMPUTED EMAIL TEMPLATES DEBUG ===');
  console.log('Form title:', formData.title);
  console.log('Original email subject:', formData.emailSubject);
  console.log('Processed email subject:', processedEmailSubject);
  console.log('Original email body:', formData.emailBody);
  console.log('Processed email body:', processedEmailBody);

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Session Details';
      case 2: return 'Participants';
      case 3: return 'Email Setup';
      default: return 'Session Details';
    }
  };

  const getStepIcon = () => {
    switch (currentStep) {
      case 1: return <BookOpen className="h-5 w-5" />;
      case 2: return <Users className="h-5 w-5" />;
      case 3: return <Mail className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (isOpen) {
        setLoadingUsers(true);
        try {
          const usersData = await sessionApi.getUsers();
          if (isPaginated(usersData)) {
            setUsers(usersData.data);
          } else {
            setUsers(usersData);
          }
        } catch (error) {
          console.error('Error fetching users:', error);
          // Set some default users for testing
          setUsers([
            { 
              id: 'dxcfgvbhnjm', 
              name: 'Test User', 
              email: 'test@example.com',
              role: 'employee',
              status: 'active',
              department: 'Engineering',
              skillLevel: 'Beginner',
              joinDate: '2024-01-01',
              lastLogin: new Date().toISOString(),
              sessionsAttended: 0,
              sessionsCreated: 0,
              totalHours: 0,
            }
          ]);
        } finally {
          setLoadingUsers(false);
        }
      }
    };

    fetchUsers();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-semibold flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-blue-600" />
            Create New Demo Session
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep >= step 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-2">
            <span className="text-sm font-medium text-gray-700">{getStepTitle()}</span>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Session Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center mb-3">
                {getStepIcon()}
                <h3 className="text-lg font-medium ml-2">Session Details</h3>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="flex items-center mb-3">
                    <BookOpen className="h-5 w-5 mr-2 text-gray-600" />
                    <h3 className="text-lg font-medium">Basic Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="title">Session Title *</Label>
                      <Input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="e.g., React Hooks Deep Dive"
                        className={errors.title ? 'border-red-500' : ''}
                      />
                      {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="technology">Technology *</Label>
                      <Select value={formData.technology} onValueChange={(value) => handleInputChange('technology', value)}>
                        <SelectTrigger className={errors.technology ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select Technology" />
                        </SelectTrigger>
                        <SelectContent>
                          {technologies.map((tech) => (
                            <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.technology && <p className="text-red-500 text-sm mt-1">{errors.technology}</p>}
                    </div>

                    <div>
                      <Label htmlFor="difficulty">Difficulty Level *</Label>
                      <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                        <SelectTrigger className={errors.difficulty ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select Difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.difficulty && <p className="text-red-500 text-sm mt-1">{errors.difficulty}</p>}
                    </div>

                    <div>
                      <Label htmlFor="type">Session Type *</Label>
                      <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Session Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PROJECT_BASED">Project-based</SelectItem>
                          <SelectItem value="PRODUCT_BASED">Product-based</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="status">Session Status *</Label>
                      <Select value={formData.status || 'upcoming'} onValueChange={(value) => handleInputChange('status', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe what will be covered in this session..."
                      rows={3}
                      className={errors.description ? 'border-red-500' : ''}
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>

                  <div>
                    <Label htmlFor="prerequisites">Prerequisites</Label>
                    <Input
                      id="prerequisites"
                      type="text"
                      value={formData.prerequisites}
                      onChange={(e) => handleInputChange('prerequisites', e.target.value)}
                      placeholder="e.g., Basic JavaScript knowledge"
                    />
                  </div>
                </div>

                {/* Schedule & Location */}
                <div className="space-y-4">
                  <div className="flex items-center mb-3">
                    <Clock className="h-5 w-5 mr-2 text-gray-600" />
                    <h3 className="text-lg font-medium">Schedule & Location</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className={errors.date ? 'border-red-500' : ''}
                      />
                      {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="time">Time *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => handleInputChange('time', e.target.value)}
                        className={errors.time ? 'border-red-500' : ''}
                      />
                      {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                    </div>

                    <div>
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration}
                        onChange={(e) => handleInputChange('duration', e.target.value)}
                        placeholder="e.g., 90"
                        min="15"
                        max="480"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                        <SelectTrigger className={errors.location ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select Location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>{location}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                    </div>

                    <div>
                      <Label htmlFor="maxAttendees">Max Attendees *</Label>
                      <Input
                        id="maxAttendees"
                        type="number"
                        value={formData.maxAttendees}
                        onChange={(e) => handleInputChange('maxAttendees', e.target.value)}
                        placeholder="e.g., 20"
                        min="1"
                        max="100"
                        className={errors.maxAttendees ? 'border-red-500' : ''}
                      />
                      {errors.maxAttendees && <p className="text-red-500 text-sm mt-1">{errors.maxAttendees}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="createdBy">Created By *</Label>
                    <Select value={formData.createdBy} onValueChange={(value) => handleInputChange('createdBy', value)}>
                      <SelectTrigger className={errors.createdBy ? 'border-red-500' : ''}>
                        <SelectValue placeholder={loadingUsers ? "Loading users..." : "Select user"} />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(users) && users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.createdBy && <p className="text-red-500 text-sm mt-1">{errors.createdBy}</p>}
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Step 2: Participants */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center mb-3">
                {getStepIcon()}
                <h3 className="text-lg font-medium ml-2">Participants</h3>
              </div>
              
              <ParticipantManager
                participants={participants}
                onParticipantsChange={setParticipants}
                availableUsers={users}
              />
            </div>
          )}

          {/* Step 3: Email Setup */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center mb-3">
                {getStepIcon()}
                <h3 className="text-lg font-medium ml-2">Email Setup</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fromEmail">From Email *</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      value={formData.fromEmail}
                      onChange={(e) => handleInputChange('fromEmail', e.target.value)}
                      placeholder="demo@company.com"
                      className={errors.fromEmail ? 'border-red-500' : ''}
                    />
                    {errors.fromEmail && <p className="text-red-500 text-sm mt-1">{errors.fromEmail}</p>}
                  </div>
                  <div>
                    <Label htmlFor="fromName">From Name *</Label>
                    <Input
                      id="fromName"
                      type="text"
                      value={formData.fromName}
                      onChange={(e) => handleInputChange('fromName', e.target.value)}
                      placeholder="Demo Tracker"
                      className={errors.fromName ? 'border-red-500' : ''}
                    />
                    {errors.fromName && <p className="text-red-500 text-sm mt-1">{errors.fromName}</p>}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="emailSubject">Email Subject *</Label>
                  <Input
                    id="emailSubject"
                    type="text"
                    value={processedEmailSubject}
                    onChange={(e) => handleInputChange('emailSubject', e.target.value)}
                    placeholder="You're invited to a demo session"
                    className={errors.emailSubject ? 'border-red-500' : ''}
                  />
                  {errors.emailSubject && <p className="text-red-500 text-sm mt-1">{errors.emailSubject}</p>}
                </div>
                
                <div>
                  <Label htmlFor="emailProvider">Email Provider *</Label>
                  <Select value={formData.emailProvider} onValueChange={(value) => handleInputChange('emailProvider', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select email provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GMAIL">Gmail</SelectItem>
                      <SelectItem value="OUTLOOK">Outlook</SelectItem>
                      <SelectItem value="SMTP">Custom SMTP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="emailBody">Email Body</Label>
                  <Textarea
                    id="emailBody"
                    value={processedEmailBody}
                    onChange={(e) => handleInputChange('emailBody', e.target.value)}
                    rows={8}
                    placeholder="Enter your email template..."
                  />
                  <p className="text-sm text-slate-500 mt-2">
                    Available variables: {'{{participantName}}, {{sessionTitle}}, {{sessionDate}}, {{sessionTime}}, {{sessionLocation}}, {{participantRole}}'}
                  </p>
                </div>
              </div>
              
              <EmailIntegration
                sessionData={sessionDataForEmail}
                formData={formData}
                onInputChange={handleInputChange}
                errors={errors}
                onCreateAndSendSession={handleCreateAndSendSession}
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between space-x-3 pt-6 border-t mt-6">
            <div className="flex space-x-3">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={handlePrevious}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
            
            <div className="flex space-x-3">
              {currentStep < 3 ? (
                <Button type="button" onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button type="button" onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                  Create Session
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
