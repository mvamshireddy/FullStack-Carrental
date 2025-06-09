import api from './axios';

// Get all bookings (for the logged-in user)
export function getBookings() {
  return api.get('/api/bookings');
}

// Create a new booking
export function createBooking(bookingData) {
  return api.post('/api/bookings', bookingData);
}

export const cancelBooking = (bookingId) => {
  // Adjust endpoint/method as per your backend
  return api.patch(`/api/bookings/${bookingId}/cancel`);
};