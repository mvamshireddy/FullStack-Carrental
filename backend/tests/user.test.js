const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI, {});
  }
});

afterAll(async () => {
  // Comment out the next line if you want the user to remain in Atlas after the test!
  // await User.deleteMany({});
  await mongoose.connection.close();
});

describe('User API', () => {
  it('registers a new user and leaves it in Atlas', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Atlas User',
        email: 'atlasuser@example.com',
        password: 'Password123',
        phone: '9998887777'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe('atlasuser@example.com');
    // Optionally, check that the user is in the DB directly:
    const user = await User.findOne({ email: 'atlasuser@example.com' });
    expect(user).not.toBeNull();
  });
});