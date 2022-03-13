import request from 'supertest';
import { app } from '../app.js';
import { USER_ROLE } from '../constants.js';
import dbConnection from '../helpers/dbConnection.js';

const offerBody = {
  title: 'Super oferta',
  localisation: {
    address: 'ul. Hdueudg',
    latitude: 2137,
    longitude: 420,
  },
  price: 1.23,
  image: 'https://freepngimg.com/thumb/cat/22211-5-red-cat.png',
};

const incorrectOfferBody = {
  title: 'Super oferta',
  localisation: {
    latitude: 2137,
    longitude: 420,
  },
  image: 'https//freepngimg.com/thumb/cat/22211-5-red-cat.png',
};

const userBody = {
  email: `user@test.pl`,
  password: 's3cur3@pass',
  name: 'user',
  lastName: 'userowski',
  dob: '1994-05-23',
  role: USER_ROLE.USER,
  isActive: true,
};

const host1Body = {
  email: `host1@test.pl`,
  password: 's3cur3@pass',
  name: 'host1',
  lastName: 'pierwszy',
  dob: '1994-05-23',
  role: USER_ROLE.HOST,
  isActive: true,
};

const host2Body = {
  email: `host2@test.pl`,
  password: 's3cur3@pass',
  name: 'host2',
  lastName: 'drugi',
  dob: '1994-05-23',
  role: USER_ROLE.HOST,
  isActive: true,
};

const adminBody = {
  email: `admin@test.pl`,
  password: 's3cur3@pass',
  name: 'admin',
  lastName: 'adminowski',
  dob: '1994-05-23',
  role: USER_ROLE.ADMIN,
  isActive: true,
};

let userToken, host1Token, host2Token, adminToken, offerID;

const registerUsers = async () => {
  await request(app).post('/auth/register').send(host1Body);
  host1Token = (await request(app).post('/auth/login').send(host1Body)).body
    .token;
  await request(app).post('/auth/register').send(host2Body);
  host2Token = (await request(app).post('/auth/login').send(host2Body)).body
    .token;
  await request(app).post('/auth/register').send(userBody);
  userToken = (await request(app).post('/auth/login').send(userBody)).body
    .token;
  await request(app).post('/auth/register').send(adminBody);
  adminToken = (await request(app).post('/auth/login').send(adminBody)).body
    .token;
};

describe('offer endpoints', () => {
  beforeAll(async () => {
    await dbConnection.connect();
    await registerUsers();
  });

  afterAll(async () => {
    await dbConnection.disconnect();
  });

  it('should allow a POST to /offer when authorized', async () => {
    const res = await request(app)
      .post('/offer')
      .set('Authorization', host1Token)
      .send(offerBody);
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.data).toBe('object');
    expect(res.body.data).toMatchObject(offerBody);
    offerID = res.body.data._id;
  });

  it('should not allow a POST to /offer when unauthorized (no token)', async () => {
    const res = await request(app).post('/offer').send(offerBody);
    expect(res.status).toBe(401);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.errors).toBe('object');
  });

  it('should allow a POST to /offer when authorized (user role)', async () => {
    const res = await request(app)
      .post('/offer')
      .set('Authorization', userToken)
      .send(offerBody);
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.data).toBe('object');
    expect(res.body.data).toMatchObject(offerBody);
  });

  it('should not allow a POST to /offer with incorrect payload', async () => {
    const res = await request(app)
      .post('/offer')
      .set('Authorization', host1Token)
      .send(incorrectOfferBody);
    expect(res.status).toBe(400);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.errors).toBe('object');
  });

  it('should allow a PATCH to /offer/:id when authorized (host - owner)', async () => {
    const res = await request(app)
      .patch(`/offer/${offerID}`)
      .set('Authorization', host1Token)
      .send({ title: 'testPatchTitle' });
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.data).toBe('object');
    expect(res.body.data).toMatchObject({
      ...offerBody,
      title: 'testPatchTitle',
    });
  });

  it('should allow a PATCH to /offer/:id when authorized (admin)', async () => {
    const res = await request(app)
      .patch(`/offer/${offerID}`)
      .set('Authorization', adminToken)
      .send(offerBody);
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.data).toBe('object');
    expect(res.body.data).toMatchObject(offerBody);
  });

  it('should not allow a PATCH to /offer/:id when unauthorized (no token)', async () => {
    const res = await request(app).patch(`/offer/${offerID}`).send(offerBody);
    expect(res.status).toBe(401);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.errors).toBe('object');
  });

  it('should not allow a PATCH to /offer/:id when unauthorized (different host)', async () => {
    const res = await request(app)
      .patch(`/offer/${offerID}`)
      .set('Authorization', host2Token)
      .send(offerBody);
    expect(res.status).toBe(403);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.errors).toBe('object');
  });

  it('should not allow a PATCH to /offer/:id when unauthorized (different user)', async () => {
    const res = await request(app)
      .patch(`/offer/${offerID}`)
      .set('Authorization', userToken)
      .send(offerBody);
    expect(res.status).toBe(403);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.errors).toBe('object');
  });

  it('should not allow a PATCH to /offer/:id with incorrect payload', async () => {
    const res = await request(app)
      .patch(`/offer/${offerID}`)
      .set('Authorization', host1Token)
      .send(incorrectOfferBody);
    expect(res.status).toBe(400);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.errors).toBe('object');
  });

  it('should allow a GET to /offer', async () => {
    const res = await request(app).get('/offer');
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.data).toBe('object');
    expect(res.body.data[0]).toMatchObject(offerBody);
  });

  it('should allow a GET to /offer/:id', async () => {
    const res = await request(app).get(`/offer/${offerID}`);
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.data).toBe('object');
    expect(res.body.data).toMatchObject(offerBody);
  });

  it('should not allow a DELETE to /offer when unauthorized', async () => {
    const res = await request(app).delete(`/offer/${offerID}`);
    expect(res.status).toBe(401);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.errors).toBe('object');
  });

  it('should not allow a DELETE to /offer when unauthorized (different host)', async () => {
    const res = await request(app)
      .delete(`/offer/${offerID}`)
      .set('Authorization', host2Token);
    expect(res.status).toBe(403);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.errors).toBe('object');
  });

  it('should not allow a DELETE to /offer when unauthorized (different user)', async () => {
    const res = await request(app)
      .delete(`/offer/${offerID}`)
      .set('Authorization', userToken);
    expect(res.status).toBe(403);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.errors).toBe('object');
  });

  it('should allow a DELETE to /offer when authorized', async () => {
    const res = await request(app)
      .delete(`/offer/${offerID}`)
      .set('Authorization', host1Token);
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.data).toBe('object');
    expect(res.body.data).toMatchObject(offerBody);
  });
});
