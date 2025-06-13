
import { BASE_URL } from './apiConfig';
import { User } from '../types/api';

// Define pagination interface for users
interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
  nextPage: number | null;
  previousPage: number | null;
}

// User Management API functions
export const userApi = {
  // Fetch all users with pagination
  getAll: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<User> | User[]> => {
    const response = await fetch(`${BASE_URL}/api/users?page=${page}&limit=${limit}`);
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
      body: JSON.stringify({
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }),
    });

    const responseData = await response.json();

    if (responseData && responseData.id) {
      return responseData;
    }

    const error = new Error(responseData.message || 'Failed to create user') as any;
    error.status = response.status;
    error.data = responseData;
    throw error;
  },

  // Update user by ID
  update: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await fetch(`${BASE_URL}/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...userData,
        updatedAt: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error('Failed to update user') as any;
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    return response.json();
  },

  // Delete user by ID
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/users/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error('Failed to delete user') as any;
      error.status = response.status;
      error.data = errorData;
      throw error;
    }
  },

  // Get user by ID
  getById: async (id: string): Promise<User> => {
    const response = await fetch(`${BASE_URL}/api/users/${id}`);
    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error('Failed to fetch user') as any;
      error.status = response.status;
      error.data = errorData;
      throw error;
    }
    return response.json();
  }
};
