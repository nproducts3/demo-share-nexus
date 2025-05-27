
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  joinedDate: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  created: string;
  lastUsed: string;
  isActive: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  company: string;
  timezone: string;
  language: string;
  avatar?: string;
  phone?: string;
  department?: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
  smsNotifications: boolean;
  desktopNotifications: boolean;
}
