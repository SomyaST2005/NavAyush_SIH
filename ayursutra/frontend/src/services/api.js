import axios from 'axios';

const resolvedBaseURL = process.env.REACT_APP_API_URL || (typeof window !== 'undefined' ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: resolvedBaseURL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(`${resolvedBaseURL}/auth/refresh`, {}, { withCredentials: true });
        return api(originalRequest);
      } catch {
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

export const appointmentAPI = {
  getAll: (params) => api.get('/appointments', { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (appointmentData) => api.post('/appointments', appointmentData),
  update: (id, appointmentData) => api.put(`/appointments/${id}`, appointmentData),
  cancel: (id) => api.put(`/appointments/${id}/cancel`),
};

export const patientAPI = {
  getAll: (params) => api.get('/patients', { params }),
  getById: (id) => api.get(`/patients/${id}`),
  create: (patientData) => api.post('/patients', patientData),
  update: (id, patientData) => api.put(`/patients/${id}`, patientData),
};

export const treatmentAPI = {
  getAll: (params) => api.get('/treatments', { params }),
  getById: (id) => api.get(`/treatments/${id}`),
  create: (treatmentData) => api.post('/treatments', treatmentData),
  update: (id, treatmentData) => api.put(`/treatments/${id}`, treatmentData),
};

export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

export const analyticsAPI = {
  getOverview: () => api.get('/analytics/overview'),
  getRevenue: () => api.get('/analytics/revenue'),
  getTreatmentEffectiveness: () => api.get('/analytics/treatment-effectiveness'),
  getPatientFlow: () => api.get('/analytics/patient-flow'),
};

export default api;
