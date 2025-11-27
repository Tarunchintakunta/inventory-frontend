import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true, // Important for HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect from interceptor - let React Router and AuthContext handle navigation
    // The interceptor should only reject the promise
    // ProtectedRoute and AuthContext will handle redirects appropriately
    return Promise.reject(error);
  }
);

export default api;
