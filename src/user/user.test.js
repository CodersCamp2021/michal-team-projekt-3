import request from 'supertest';
import { app } from '../app.js';
import { USER_ROLE } from '../constants.js';
import { connect, disconnect } from '../helpers/dbConnection.js';

const userBody = {
  email: `user@test.pl`,
  password: 's3cur3@pass',
  name: 'user',
  lastName: 'userowski',
  dob: '1994-05-23',
  role: USER_ROLE.USER,
  isActive: true,
};

const hostBody = {
  email: `host@test.pl`,
  password: 's3cur3@pass',
  name: 'host',
  lastName: 'hostowski',
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

let users, userToken, adminToken, host, user;

const registerUsers = async () => {
  await request(app).post('/auth/register').send(hostBody);
  await request(app).post('/auth/register').send(userBody);
  userToken = (await request(app).post('/auth/login').send(userBody)).body
    .token;
  await request(app).post('/auth/register').send(adminBody);
  adminToken = (await request(app).post('/auth/login').send(adminBody)).body
    .token;
};

const getUsersData = async (token) => {
  users = (await request(app).get('/user').set('Authorization', token)).body
    .data;
  host = users[0];
  user = users[1];
};

describe('user endpoints', () => {
  beforeAll(async () => {
    await connect();
    await registerUsers();
    await getUsersData(adminToken);
  });

  afterAll(async () => {
    await disconnect();
  });

  describe('admin user', () => {
    it('should allow a GET to /user when authorized and admin', async () => {
      const res = await request(app)
        .get('/user')
        .set('Authorization', adminToken);

      expect(res.status).toBe(200);
      expect(typeof res.body).toBe('object');
      expect(typeof res.body.data).toBe('object');
      expect(res.body.data).toStrictEqual(users);
    });

    it('should allow a GET to /user/:id when authorized and admin role', async () => {
      const res = await request(app)
        .get(`/user/${host._id}`)
        .set('Authorization', adminToken);

      expect(res.status).toBe(200);
      expect(typeof res.body).toBe('object');
      expect(typeof res.body.data).toBe('object');
      expect(res.body.data).toStrictEqual(host);
    });

    it('should allow a PATCH to /user/:id when authorized and admin role', async () => {
      const res = await request(app)
        .patch(`/user/${host._id}`)
        .set('Authorization', adminToken)
        .send({ name: 'testUserName' });

      expect(res.status).toBe(200);
      expect(typeof res.body).toBe('object');
      expect(typeof res.body.data).toBe('object');
      expect(res.body.data).toStrictEqual({ ...host, name: 'testUserName' });
    });

    it('should allow a DELETE to /user/:id when authorized and admin role', async () => {
      const res = await request(app)
        .delete(`/user/${host._id}`)
        .set('Authorization', adminToken);

      expect(res.status).toBe(200);
      expect(typeof res.body).toBe('object');
      expect(res.body.message).toBe(
        `User with id: ${host._id} has been successfully deleted`,
      );
    });
  });

  describe('unauthorized user', () => {
    it('should not allow a GET to /user when unauthorized (no token)', async () => {
      const res = await request(app).get('/user');

      expect(res.status).toBe(401);
      expect(typeof res.body).toBe('object');
      expect(res.body.message).toBe('Unauthorized');
    });

    it('should not allow a GET to /user/:id when unauthorized (no token)', async () => {
      const res = await request(app).get(`/user/${host._id}`);

      expect(res.status).toBe(401);
      expect(typeof res.body).toBe('object');
      expect(res.body.message).toBe('Unauthorized');
    });

    it('should not allow a PATCH to /user/:id when unauthorized (no token)', async () => {
      const res = await request(app)
        .patch(`/user/${host._id}`)
        .send({ name: 'testName' });

      expect(res.status).toBe(401);
      expect(typeof res.body).toBe('object');
      expect(res.body.message).toBe('Unauthorized');
    });

    it('should not allow a DELETE to /user/:id when unauthorized (no token)', async () => {
      const res = await request(app).delete(`/user/${host._id}`);

      expect(res.status).toBe(401);
      expect(typeof res.body).toBe('object');
      expect(res.body.message).toBe('Unauthorized');
    });
  });

  describe('authorized user', () => {
    it('should not allow a GET to /user when authorized but insufficient role', async () => {
      const res = await request(app)
        .get('/user')
        .set('Authorization', userToken);
      expect(res.status).toBe(403);
      expect(typeof res.body).toBe('object');
      expect(res.body.message).toBe('Access denied.');
    });
    it('should not allow a GET to /user/:id when authorized but insufficient role', async () => {
      const res = await request(app)
        .get(`/user/${host._id}`)
        .set('Authorization', userToken);
      expect(res.status).toBe(403);
      expect(typeof res.body).toBe('object');
      expect(res.body.message).toBe('Access denied.');
    });
    it('should allow a GET to /user/me when authorized', async () => {
      const res = await request(app)
        .get(`/user/me`)
        .set('Authorization', userToken);
      expect(res.status).toBe(200);
      expect(typeof res.body).toBe('object');
      expect(typeof res.body.data).toBe('object');
      expect(res.body.data).toStrictEqual(user);
    });
    it('should allow a PATCH to /user/me when authorized', async () => {
      const res = await request(app)
        .patch(`/user/me`)
        .send({ name: 'superName' })
        .set('Authorization', userToken);
      expect(res.status).toBe(200);
      expect(typeof res.body).toBe('object');
      expect(typeof res.body.data).toBe('object');
      expect(res.body.data).toStrictEqual({ ...user, name: 'superName' });
    });
    it('should allow a DELETE to /user/me when authorized', async () => {
      const res = await request(app)
        .delete(`/user/me`)
        .set('Authorization', userToken);
      expect(res.status).toBe(200);
      expect(typeof res.body).toBe('object');
      expect(res.body.message).toBe(
        `User with id: ${user._id} has been successfully deleted`,
      );
    });
  });
});
