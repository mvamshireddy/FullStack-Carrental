const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let token = '';
let userId = '';
let bookingId = '';
let bookingReference = '';

const testAPI = async () => {
  try {
    console.log('Starting API tests...');

    // Register user
    console.log('\nTesting user registration...');
    const registerRes = await axios.post(`${API_URL}/users/register`, {
      name: 'Test User',
      email: `test${Date.now()}@example.com`, // Unique email
      password: 'password123',
      phone: '1234567890'
    });
    console.log('Registration successful:', registerRes.data.success);
    
    // Login
    console.log('\nTesting login...');
    const loginRes = await axios.post(`${API_URL}/users/login`, {
      email: registerRes.data.data.email,
      password: 'password123'
    });
    console.log('Login successful:', loginRes.data.success);
    token = loginRes.data.token;
    userId = loginRes.data.data._id;
    
    // Get cars
    console.log('\nTesting get cars...');
    const carsRes = await axios.get(`${API_URL}/cars`);
    console.log('Got cars:', carsRes.data.count);
    
    if (carsRes.data.count === 0) {
      console.log('No cars in database. Add some cars before testing booking.');
      return;
    }
    
    const carId = carsRes.data.data[0]._id;
    
    // Create booking
    console.log('\nTesting create booking...');
    const bookingRes = await axios.post(
      `${API_URL}/bookings`,
      {
        carId,
        startDate: new Date(Date.now() + 86400000), // Tomorrow
        endDate: new Date(Date.now() + 86400000 * 5), // 5 days later
        pickupLocation: 'Airport',
        dropoffLocation: 'City Center',
        paymentMethod: 'card',
        additionalServices: [
          { name: 'GPS', price: 10 }
        ]
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('Booking created:', bookingRes.data.success);
    bookingId = bookingRes.data.data._id;
    bookingReference = bookingRes.data.data.bookingReference;
    
    // Process payment
    console.log('\nTesting process payment...');
    const paymentRes = await axios.post(
      `${API_URL}/payments`,
      {
        bookingId,
        paymentMethod: 'card',
        cardDetails: {
          number: '4111111111111111',
          expiryMonth: '12',
          expiryYear: '2027',
          cardType: 'visa'
        }
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('Payment processed:', paymentRes.data.success);
    
    // Get booking by reference
    console.log('\nTesting get booking by reference...');
    const bookingRefRes = await axios.get(`${API_URL}/bookings/reference/${bookingReference}`);
    console.log('Got booking by reference:', bookingRefRes.data.success);
    
    console.log('\nAll tests completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error.response ? error.response.data : error.message);
  }
};

testAPI();