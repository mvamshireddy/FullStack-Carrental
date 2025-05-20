const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

beforeAll(async () => {
  // Only connect if not connected
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect('mongodb://localhost:27017/car_rental_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('User API', () => {
  it('registers a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'Password123',
        phone: '1234567890'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe('testuser@example.com');
  });

  it('logs in the user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'testuser@example.com',
        password: 'Password123'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});