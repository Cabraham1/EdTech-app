import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add localStorage data
apiClient.interceptors.request.use(
  (config) => {
    // Get localStorage data if available
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('edtech_students');
        if (stored) {
          const students = JSON.parse(stored);
          if (students.length > 0) {
            config.headers['x-client-data'] = JSON.stringify(students);
          }
        }
      } catch (error) {
        // Ignore localStorage errors
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      return Promise.reject(error);
    } else if (error.request) {
      // Request made but no response
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      // Something else happened
      return Promise.reject(error);
    }
  }
);

export default apiClient;

