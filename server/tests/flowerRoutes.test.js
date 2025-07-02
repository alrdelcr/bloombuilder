// flowerRoutes.test.js

const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const flowerRoutes = require('../routes/flowers.js');
const Flower = require('../models/Flower.js');


let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);

  app = express();
  app.use(express.json());
  app.use('/flowers', flowerRoutes);

  app.use((err, req, res, next) => {
    console.error('🔥 TEST ERROR MIDDLEWARE TRIGGERED');
    console.error(err.name);
    console.error(err.message);

    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  });

});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Flower.deleteMany();
});

describe('Flower API', () => {

  it('should create a new flower', async () => {
    const flowerData = {
      name: 'Rose',
      type: 'focal',
      color: 'red',
      price: 2.5,
      quantity: 100,
      imageUrl: 'https://example.com/rose.jpg'
    };

    const res = await request(app)
      .post('/flowers')
      .send(flowerData);

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Rose');
    expect(res.body.price).toBe(2.5);
  });

  it('should fetch all flowers', async () => {
    await Flower.create({ name: 'Lily', type: 'focal', color: 'white', price: 1.5, quantity: 50 });
    await Flower.create({ name: 'Fern', type: 'foliage', color: 'green', price: 0.8, quantity: 70 });

    const res = await request(app).get('/flowers');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it('should update a flower', async () => {
    const flower = await Flower.create({ name: 'Daisy', type: 'filler', color: 'yellow', price: 1.0, quantity: 30 });
    const res = await request(app)
      .put(`/flowers/${flower._id}`)
      .send({ price: 1.2 });

    expect(res.statusCode).toBe(200);
    expect(res.body.price).toBe(1.2);
  });

  it('should delete a flower', async () => {
    const flower = await Flower.create({ name: 'Tulip', type: 'focal', color: 'pink', price: 2.0, quantity: 20 });
    const res = await request(app).delete(`/flowers/${flower._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const found = await Flower.findById(flower._id);
    expect(found).toBeNull();
  });
});

describe('Validation and Edge Case Tests', () => {

  it('should fail to create a flower with missing required field (name)', async () => {
    const res = await request(app)
      .post('/flowers')
      .send({
        type: 'focal',
        color: 'red',
        price: 2.5,
        quantity: 10
      });

    expect(res.statusCode).toBe(400); // or 500 if unhandled
  });

  it('should fail to create a flower with invalid price (string instead of number)', async () => {
    const res = await request(app)
      .post('/flowers')
      .send({
        name: 'Rose',
        type: 'focal',
        color: 'red',
        price: "ten",
        quantity: 10
      });

    expect(res.statusCode).toBe(400);
  });
  it('should fail to create a flower with negative quantity', async () => {
    const res = await request(app)
      .post('/flowers')
      .send({
        name: 'Lily',
        type: 'focal',
        color: 'white',
        price: 2.0,
        quantity: -5
      });

    expect(res.statusCode).toBe(400);
  });
  it('should fail with empty body on POST', async () => {
    const res = await request(app)
      .post('/flowers')
      .send({});

    expect(res.statusCode).toBe(400);
  });

  it('should return 404 for GET with invalid ObjectId', async () => {
    const res = await request(app).get('/flowers/123abc');
    expect(res.statusCode).toBe(404); 
  });

  it('should return 404 when trying to delete a non-existent flower', async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/flowers/${id}`);
    expect(res.statusCode).toBe(404);
  });

  it('should return 404 when trying to put into a non-existent flower', async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await request(app).put(`/flowers/${id}`).send({ price: 1.2 });;
    expect(res.statusCode).toBe(404);
  });
});