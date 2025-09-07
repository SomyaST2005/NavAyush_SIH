import axios from 'axios';

// Determine base URL: prefer explicit env; use same-origin "/api" in production; fallback to local dev
const resolvedBaseURL = process.env.REACT_APP_API_URL || (typeof window !== 'undefined' ? '/api' : 'http://localhost:5000/api');

// Create axios instance with base configuration
const api = axios.create({
  baseURL: resolvedBaseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${resolvedBaseURL}/auth/refresh`, { refreshToken });

          const { token } = response.data;
          localStorage.setItem('authToken', token);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  getCurrentUser: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
};

export const appointmentAPI = {
  getAll: () => api.get('/appointments'),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (appointmentData) => api.post('/appointments', appointmentData),
  update: (id, appointmentData) => api.put(`/appointments/${id}`, appointmentData),
  cancel: (id) => api.put(`/appointments/${id}/cancel`),
  reschedule: (id, newDateTime) => api.put(`/appointments/${id}/reschedule`, newDateTime),
  getAvailableSlots: (practitionerId, date) => api.get(`/appointments/available-slots?practitionerId=${practitionerId}&date=${date}`),
};

export const patientAPI = {
  getProfile: () => api.get('/patient/profile'),
  updateProfile: (profileData) => api.put('/patient/profile', profileData),
  getProgress: () => api.get('/patient/progress'),
  updateProgress: (progressData) => api.post('/patient/progress', progressData),
  getTreatmentPlan: () => api.get('/patient/treatment-plan'),
  getMedicalHistory: () => api.get('/patient/medical-history'),
};

export const practitionerAPI = {
  getAll: () => api.get('/practitioners'),
  getById: (id) => api.get(`/practitioners/${id}`),
  getAvailability: (id, date) => api.get(`/practitioners/${id}/availability?date=${date}`),
  getSpecializations: () => api.get('/practitioners/specializations'),
};

export const treatmentAPI = {
  getAll: () => api.get('/treatments'),
  getById: (id) => api.get(`/treatments/${id}`),
  getByType: (type) => api.get(`/treatments?type=${type}`),
  getProtocols: () => api.get('/treatments/protocols'),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  delete: (id) => api.delete(`/notifications/${id}`),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

export const aiSchedulingAPI = {
  scheduleAppointment: (appointmentRequest) => api.post('/ai-scheduling/schedule', appointmentRequest),
  getOptimalSlots: (params) => api.get('/ai-scheduling/optimal-slots', { params }),
  rescheduleAppointment: (appointmentId, preferences) => api.put(`/ai-scheduling/reschedule/${appointmentId}`, preferences),
  getInsights: (practitionerId, dateRange) => api.get(`/ai-scheduling/insights/${practitionerId}`, { params: dateRange }),
};

export default api;
