import { AdvancedSettings } from '../types/advancedSettings';

const API_URL = 'http://localhost:8080/api/advanced-settings';

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const advancedSettingsApi = {
  async update(id: string, settings: Partial<AdvancedSettings>): Promise<AdvancedSettings> {
    console.log('=== Advanced Settings Update Debug ===');
    console.log('Settings ID:', id);
    console.log('Update payload:', settings);

    // Validate UUID format
    if (!UUID_REGEX.test(id)) {
      console.error('Invalid UUID format:', id);
      throw new Error('Invalid settings ID format');
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(settings),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Success response:', data);
      return data;
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  },

  // ... other methods ...
}; 