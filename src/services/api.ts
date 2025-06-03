
const BASE_URL = 'http://localhost:8080';

// Demo Session API
export interface DemoSession {
  id: string;
  title: string;
  technology: string;
  date: string;
  time: string;
  description: string;
  createdBy: string;
  attendees: number;
  maxAttendees: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  location: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites?: string;
  duration?: string;
    type: 'PROJECT_BASED' | 'PROJECT_BASED';
}

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
}

// Demo Session API functions
export const sessionApi = {
  // Fetch all sessions
  getAll: async (): Promise<DemoSession[]> => {
    const response = await fetch(`${BASE_URL}/api/sessions`);
    if (!response.ok) {
      throw new Error('Failed to fetch sessions');
    }
    return response.json();
  },

  // Create new session
  create: async (sessionData: Omit<DemoSession, 'id'>): Promise<DemoSession> => {
    const response = await fetch(`${BASE_URL}/api/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });
    if (!response.ok) {
      throw new Error('Failed to create session');
    }
    return response.json();
  },

  // Update session by ID
  update: async (id: string, sessionData: Partial<DemoSession>): Promise<DemoSession> => {
    const response = await fetch(`${BASE_URL}/api/sessions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });
    if (!response.ok) {
      throw new Error('Failed to update session');
    }
    return response.json();
  },

  // Delete session by ID
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/sessions/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete session');
    }
  },
};

// User Management API functions
export const userApi = {
  // Fetch all users
  getAll: async (): Promise<User[]> => {
    const response = await fetch(`${BASE_URL}/api/users`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  },

  // Create new user
  create: async (userData: Omit<User, 'id'>): Promise<User> => {
    const response = await fetch(`${BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    return response.json();
  },

  // Update user by ID
  update: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await fetch(`${BASE_URL}/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    return response.json();
  },

  // Delete user by ID
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  },
};
