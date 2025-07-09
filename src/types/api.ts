// API Error interfaces
export interface ApiError extends Error {
  status?: number;
  data?: {
    message?: string;
  };
}

export interface ApiErrorResponse {
  message?: string;
  status?: number;
  data?: {
    message?: string;
  };
}

// Participant interface
export interface Participant {
  id: string;
  email: string;
  name: string;
  role: 'host' | 'co-host' | 'attendee';
  status?: 'invited' | 'accepted' | 'declined';
}

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  department: string;
  phone?: string;
  skillLevel: string;
  joinDate: string;
  lastLogin: string;
  sessionsAttended: number;
  sessionsCreated: number;
  totalHours: number;
  avatar?: string;
}

// Demo Session interface
export interface DemoSession {
  id: string;
  title: string;
  technology: string;
  date: string;
  time: string;
  description: string;
  name: string | User | string[];
  createdBy: string | User;
  attendees: number;
  maxAttendees: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  location: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites?: string;
  duration?: number;
  type: 'PROJECT_BASED' | 'PRODUCT_BASED';
  feedback?: string;
  sprintName?: string;
  storyPoints?: number;
  numberOfTasks?: number;
  numberOfBugs?: number;
  currentStatus?: 'Planning' | 'In Progress' | 'Testing' | 'Completed' | 'On Hold';
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
  participants?: Participant[] | Array<{
    name: string;
    email: string;
    role: 'HOST' | 'CO_HOST' | 'ATTENDEE';
  }>;
  meetingLink?: string;
  recordingUrl?: string;
  emailProvider?: 'GMAIL' | 'OUTLOOK' | 'SMTP';
  fromEmail?: string;
  fromName?: string;
  emailSubject?: string;
  emailBody?: string;
  sendInvitations?: boolean;
  sendReminders?: boolean;
  sendRecordings?: boolean;
  reminderTime?: string;
  userIds?: string[];
  role?: 'HOST' | 'CO_HOST' | 'ATTENDEE';
}
