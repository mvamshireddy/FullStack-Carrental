const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Car = require('../models/Car');

let adminToken = '';
let carId = '';

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI, {});
  }
  // Create an admin user and get token
  await User.deleteMany({});
  const adminUser = new User({ name: 'Atlas Admin', email: 'atlasadmin@example.com', password: 'AdminPass1', isAdmin: true });
  await adminUser.save();
  const res = await request(app).post('/api/users/login').send({
    email: 'atlasadmin@example.com',
    password: 'AdminPass1'
  });
  adminToken = res.body.token;
});

afterAll(async () => {
  // Comment out if you want to see the car in Atlas after tests
  // await Car.deleteMany({});
  // await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Car API (Atlas)', () => {
  it('adds a car as admin and leaves it in Atlas', async () => {
    const res = await request(app)
      .post('/api/cars')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Atlas Toyota',
        model: 'Corolla',
        pricePerDay: 100,
        location: 'Atlas City',
        image: '',
        description: 'Atlas Test Car'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Atlas Toyota');
    carId = res.body._id;
    // Confirm directly in DB
    const car = await Car.findOne({ name: 'Atlas Toyota' });
    expect(car).not.toBeNull();
  });
});