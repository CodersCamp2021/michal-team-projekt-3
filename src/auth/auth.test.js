import request from 'supertest';
import { app } from '../app.js';
import { User } from '../user/user.model.js';
import { dbConnection, closeConnection } from '../helpers/dbConnection.js';

const userBody = {
  email: `example@test.pl`,
  password: 's3cur3@pass',
  name: 'jan',
  surname: 'kowalski',
  dob: '1994-05-23',
};

const incorrectUserBody = {
  email: `example`,
  password: 'test',
  name: 'jan',
  surname: 'kowalski',
  dob: '1994-05-23',
};

let token;

describe('auth endpoints', () => {
  beforeAll(async () => {
    await dbConnection();
  });
  afterAll(async () => {
    await User.deleteMany({});
    await closeConnection();
  });

  it('should allow a POST to /auth/register with correct data', async () => {
    const res = await request(app).post('/auth/register').send(userBody);
    expect(res.status).toBe(201);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.message).toBe('string');
    expect(typeof res.body.token).toBe('string');
    expect(res.body.message).toBe('Registered successfully');
  });

  it('should not allow a POST to /auth/register with empty body', async () => {
    const res = await request(app).post('/auth/register').send();
    expect(res.status).toBe(400);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.errors).toBe('object');
  });

  it('should not allow a POST to /auth/register with incorrect data', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(incorrectUserBody);
    expect(res.status).toBe(400);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.errors).toBe('object');
  });

  it('should not allow a POST to /auth/register with existing email', async () => {
    const res = await request(app).post('/auth/register').send(userBody);
    expect(res.status).toBe(400);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.errors).toBe('object');
    expect(res.body.errors[0].msg).toBe('Email already taken');
  });

  it('should allow a POST to /auth/login with correct data', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: userBody.email, password: userBody.password });
    expect(res.status).toBe(201);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.message).toBe('string');
    expect(typeof res.body.token).toBe('string');
    expect(res.body.message).toBe('Logged in successfully');
    token = res.body.token;
  });

  it('should not allow a POST to /auth/login with empty body', async () => {
    const res = await request(app).post('/auth/login').send();
    expect(res.status).toBe(400);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.errors).toBe('object');
  });

  it('should not allow a POST to /auth/login with incorrect password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: userBody.email, password: 'uNNWVATPK' });
    expect(res.status).toBe(400);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.message).toBe('string');
    expect(res.body.message).toBe('Invalid password');
  });

  it('should not allow a POST to /auth/login with incorrect data', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@test.pl', password: 'uNNWVATPK' });
    expect(res.status).toBe(400);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.message).toBe('string');
    expect(res.body.message).toBe('Invalid email or password');
  });

  it('should allow a GET to /auth/protected with access token', async () => {
    const res = await request(app)
      .get('/auth/protected')
      .set('Authorization', token);

    expect(res.status).toEqual(200);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.message).toBe('string');
    expect(res.body.message).toEqual('protected route');
  });

  it('should not allow a GET to /auth/protected without access token', async () => {
    const res = await request(app).get('/auth/protected');
    expect(res.status).toEqual(401);
  });
});
