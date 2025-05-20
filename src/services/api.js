import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Car services
export const getCars = (filters = {}) => api.get('/cars', { params: filters });
export const getCarById = (id) => api.get(`/cars/${id}`);

// User services
export const registerUser = (userData) => api.post('/users/register', userData);
export const loginUser = (credentials) => api.post('/users/login', credentials);
export const getCurrentUser = () => api.get('/users/me');
export const updateUserProfile = (profileData) => api.put('/users/profile', profileData);

// Booking services
export const createBooking = (bookingData) => api.post('/bookings', bookingData);
export const getUserBookings = () => api.get('/bookings/user');
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const cancelBooking = (id) => api.post(`/bookings/${id}/cancel`);
export const getBookingByReference = (reference) => api.get(`/bookings/reference/${reference}`);

// Payment services
export const processPayment = (paymentData) => api.post('/payments', paymentData);
export const getUserPayments = () => api.get('/payments/user');
export const getPaymentById = (id) => api.get(`/payments/${id}`);

export default api;