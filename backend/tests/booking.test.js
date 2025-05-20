const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');

let userToken = '';
let adminToken = '';
let carId = '';
let bookingId = '';

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI, {});
  }
  // Clean DB for unique test data
    await User.deleteOne({ email: 'atlasuser@example.com' });
  await User.deleteMany({});
  await Car.deleteMany({});
  await Booking.deleteMany({});

  // Create admin
  const adminUser = new User({ name: 'Atlas Admin', email: 'atlasadminb@example.com', password: 'AdminPass1', isAdmin: true });
  await adminUser.save();
  let res = await request(app).post('/api/users/login').send({
    email: 'atlasadminb@example.com',
    password: 'AdminPass1'
  });
  adminToken = res.body.token;

  // Create user
  await request(app).post('/api/users/register').send({
    name: 'vamshi',
    email: 'atlasbooker@example.com',
    password: 'UserPass1',
    phone: '1111111111'
  });
  res = await request(app).post('/api/users/login').send({
    email: 'atlasbooker@example.com',
    password: 'UserPass1'
  });
  userToken = res.body.token;

  // Create car as admin
  res = await request(app).post('/api/cars')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      name: 'Atlas Honda',
      model: 'Civic',
      pricePerDay: 120,
      location: 'Atlas Airport',
      description: 'Atlas Booking Car'
    });
  carId = res.body._id;
});

afterAll(async () => {
  // Comment out if you want to see booking, car, user in Atlas after tests
  // await Booking.deleteMany({});
  // await Car.deleteMany({});
  // await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Booking API (Atlas)', () => {
  it('creates a booking and leaves it in Atlas', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        carId,
        startTime: new Date(Date.now() + 86400000).toISOString(), // tomorrow
        endTime: new Date(Date.now() + 2 * 86400000).toISOString(), // day after
        pickupLocation: 'Atlas Airport',
        dropoffLocation: 'Atlas Hotel'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.car).toBe(carId);
    bookingId = res.body._id;

    // Confirm directly in DB
    const booking = await Booking.findOne({ _id: bookingId });
    expect(booking).not.toBeNull();
  });
});