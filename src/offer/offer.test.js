import faker from '@faker-js/faker';
import request from 'supertest';
import { app } from '../app.js';
import { USER_ROLE, ACCOMODATION_TYPE, LANGUAGE } from '../constants.js';
import dbConnection from '../helpers/dbConnection.js';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockReturnValue(() => {}),
  }),
}));

const generateUser = (overrideProps = {}) => {
  const user = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    name: faker.name.firstName(),
    lastName: faker.name.lastName(),
    dob: faker.date.past().toISOString().split('T')[0],
    role: faker.random.arrayElement(Object.values(USER_ROLE)),
    languages: faker.random.arrayElements(Object.values(LANGUAGE)),
    isActive: true,
  };
  return { ...user, ...overrideProps };
};

const generateOffer = (overrideProps = {}) => {
  const offer = {
    title: faker.lorem.sentence(),
    accomodationType: faker.random.arrayElement(
      Object.values(ACCOMODATION_TYPE),
    ),
    localisation: {
      address: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.country()}`,
      latitude: parseFloat(faker.address.latitude()),
      longitude: parseFloat(faker.address.longitude()),
    },
    price: faker.datatype.number(),
    image: faker.image.imageUrl(),
  };
  return { ...offer, ...overrideProps };
};

const offers = {
  correct: generateOffer({
    localisation: {
      address: `${faker.address.streetAddress()}, Poznan, Poland`,
      latitude: 52.4344961949815,
      longitude: 16.90361414078944,
    },
  }),
  price_lt_100: generateOffer({
    localisation: {
      address: `${faker.address.streetAddress()}, Warsaw, Poland`,
      latitude: 52.27154078468702,
      longitude: 21.01387258304672,
    },
    price: Math.random() * 100,
  }),
  price_eq_100: generateOffer({
    localisation: {
      address: `${faker.address.streetAddress()}, Warsaw, Poland`,
      latitude: 52.26492258027281,
      longitude: 20.93799825730854,
    },
    price: 100.0,
  }),
  price_gt_100: generateOffer({
    localisation: {
      address: `${faker.address.streetAddress()}, Warsaw, Poland`,
      latitude: 52.3290596476168,
      longitude: 20.95245600249534,
    },
    price: 100 + Math.random() * 100,
  }),
  accomodationType_not_hostel: generateOffer({
    localisation: {
      address: `${faker.address.streetAddress()}, Warsaw, Poland`,
      latitude: 52.20931945796322,
      longitude: 21.142784419662664,
    },
    accomodationType: faker.random.arrayElement(
      Object.values(ACCOMODATION_TYPE).filter(
        (x) => x !== ACCOMODATION_TYPE.HOSTEL,
      ),
    ),
  }),
  accomodationType_hostel: generateOffer({
    localisation: {
      address: `${faker.address.streetAddress()}, Warsaw, Poland`,
      latitude: 52.26254422994122,
      longitude: 20.90244623982127,
    },
    accomodationType: ACCOMODATION_TYPE.HOSTEL,
  }),
  language_not_english: generateOffer({
    localisation: {
      address: `${faker.address.streetAddress()}, Warsaw, Poland`,
      latitude: 52.191963180958766,
      longitude: 20.971219979390394,
    },
  }),
  language_english: generateOffer({
    localisation: {
      address: `${faker.address.streetAddress()}, Warsaw, Poland`,
      latitude: 52.20222669491406,
      longitude: 21.20622085313584,
    },
  }),
};

const offer_ids = {};

const users = {
  user: generateUser({ role: USER_ROLE.USER }),
  host1: generateUser({ role: USER_ROLE.HOST }),
  host2: generateUser({ role: USER_ROLE.HOST }),
  admin: generateUser({ role: USER_ROLE.ADMIN }),
  language_not_english: generateUser({
    role: USER_ROLE.HOST,
    languages: faker.random.arrayElement(
      Object.values(LANGUAGE).filter((x) => x !== LANGUAGE.ENGLISH),
    ),
  }),
  language_english: generateUser({
    role: USER_ROLE.HOST,
    languages: LANGUAGE.ENGLISH,
  }),
};

const user_tokens = {};

const registerUser = async (user) => {
  await request(app).post('/auth/register').send(user);
  return (await request(app).post('/auth/login').send(user)).body.token;
};

const registerUsers = async () => {
  for (const key of Object.keys(users)) {
    user_tokens[key] = await registerUser(users[key]);
  }
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
    for (const key of Object.keys(offers)) {
      let token = user_tokens.host1;
      if (Object.keys(users).includes(key)) token = user_tokens[key];
      const res = await request(app)
        .post('/offer')
        .set('Authorization', token)
        .send(offers[key]);
      expect(res.status).toBe(200);
      expect(typeof res.body).toBe('object');
      expect(typeof res.body.data).toBe('object');
      expect(res.body.data).toMatchObject(offers[key]);
      offer_ids[key] = res.body.data._id;
    }
  });

  it('should not allow a POST to /offer when unauthorized (no token)', async () => {
    const res = await request(app).post('/offer').send(offers.correct);
    expect(res.status).toBe(401);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.errors).toBe('object');
  });

  it('should not allow a POST to /offer with incorrect payload', async () => {
    const res = await request(app)
      .post('/offer')
      .set('Authorization', user_tokens.host1)
      .send({ ...offers.correct, price: null, title: '' });
    expect(res.status).toBe(400);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.errors).toBe('object');
  });

  it('should allow a PATCH to /offer/:id when authorized (host - owner)', async () => {
    const res = await request(app)
      .patch(`/offer/${offer_ids.correct}`)
      .set('Authorization', user_tokens.host1)
      .send({ title: 'testPatchTitle' });
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.data).toBe('object');
    expect(res.body.data).toMatchObject({
      ...offers.correct,
      title: 'testPatchTitle',
    });
  });

  it('should allow a PATCH to /offer/:id when authorized (admin)', async () => {
    const res = await request(app)
      .patch(`/offer/${offer_ids.correct}`)
      .set('Authorization', user_tokens.admin)
      .send(offers.correct);
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.data).toBe('object');
    expect(res.body.data).toMatchObject(offers.correct);
  });

  it('should not allow a PATCH to /offer/:id when unauthorized (no token)', async () => {
    const res = await request(app)
      .patch(`/offer/${offer_ids.correct}`)
      .send(offers.correct);
    expect(res.status).toBe(401);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.errors).toBe('object');
  });

  it('should not allow a PATCH to /offer/:id when unauthorized (different host)', async () => {
    const res = await request(app)
      .patch(`/offer/${offer_ids.correct}`)
      .set('Authorization', user_tokens.host2)
      .send(offers.correct);
    expect(res.status).toBe(403);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.errors).toBe('object');
  });

  it('should not allow a PATCH to /offer/:id when unauthorized (different user)', async () => {
    const res = await request(app)
      .patch(`/offer/${offer_ids.correct}`)
      .set('Authorization', user_tokens.user)
      .send(offers.correct);
    expect(res.status).toBe(403);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.errors).toBe('object');
  });

  it('should not allow a PATCH to /offer/:id with incorrect payload', async () => {
    const res = await request(app)
      .patch(`/offer/${offer_ids.correct}`)
      .set('Authorization', user_tokens.host1)
      .send({ ...offers.correct, price: null, title: '' });
    expect(res.status).toBe(400);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.errors).toBe('object');
  });

  it('should allow a GET to /offer (request without params)', async () => {
    const res = await request(app).get('/offer');
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.data).toBe('object');
    expect(res.body.data).toMatchObject(Object.values(offers));
  });

  it('should allow a GET to /offer (search by location without filters)', async () => {
    const res = await request(app)
      .get('/offer')
      .query({ localisation: 'Warsaw, Masovian Voivodeship, Poland' });
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.data).toBe('object');
    expect(res.body.data).toMatchObject(
      Object.values(offers).filter((x) =>
        x.localisation.address.match('Warsaw, Poland'),
      ),
    );
  });

  it('should allow a GET to /offer (search by location, filter by hostLanguage - include)', async () => {
    const res = await request(app)
      .get('/offer')
      .query({
        localisation: 'Warsaw, Masovian Voivodeship, Poland',
        hostLanguages: [LANGUAGE.ENGLISH],
      });
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.data).toBe('object');
    expect(res.body.data).toContainEqual(
      expect.objectContaining(offers.language_english),
    );
    expect(res.body.data).not.toContainEqual(
      expect.objectContaining(offers.language_not_english),
    );
  });

  it('should allow a GET to /offer (search by location, filter by hostLanguage - exclude)', async () => {
    const res = await request(app)
      .get('/offer')
      .query({
        localisation: 'Warsaw, Masovian Voivodeship, Poland',
        hostLanguages: Object.values(LANGUAGE).filter(
          (x) => x !== LANGUAGE.ENGLISH,
        ),
      });
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.data).toBe('object');
    expect(res.body.data).toContainEqual(
      expect.objectContaining(offers.language_not_english),
    );
    expect(res.body.data).not.toContainEqual(
      expect.objectContaining(offers.language_english),
    );
  });

  it('should allow a GET to /offer (search by location, filter by accomodationType - include)', async () => {
    const res = await request(app)
      .get('/offer')
      .query({
        localisation: 'Warsaw, Masovian Voivodeship, Poland',
        accomodationTypes: [ACCOMODATION_TYPE.HOSTEL],
      });
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.data).toBe('object');
    expect(res.body.data).toContainEqual(
      expect.objectContaining(offers.accomodationType_hostel),
    );
    expect(res.body.data).not.toContainEqual(
      expect.objectContaining(offers.accomodationType_not_hostel),
    );
  });

  it('should allow a GET to /offer (search by location, filter by accomodationType - exclude)', async () => {
    const res = await request(app)
      .get('/offer')
      .query({
        localisation: 'Warsaw, Masovian Voivodeship, Poland',
        accomodationTypes: Object.values(ACCOMODATION_TYPE).filter(
          (x) => x !== ACCOMODATION_TYPE.HOSTEL,
        ),
      });
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.data).toBe('object');
    expect(res.body.data).toContainEqual(
      expect.objectContaining(offers.accomodationType_not_hostel),
    );
    expect(res.body.data).not.toContainEqual(
      expect.objectContaining(offers.accomodationType_hostel),
    );
  });

  it('should allow a GET to /offer (search by location, filter by price)', async () => {
    const res = await request(app).get('/offer').query({
      localisation: 'Warsaw, Masovian Voivodeship, Poland',
      minPrice: 99.9,
      maxPrice: 100.1,
    });
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.data).toBe('object');
    expect(res.body.data).toContainEqual(
      expect.objectContaining(offers.price_eq_100),
    );
    expect(res.body.data).not.toContainEqual(
      expect.objectContaining(offers.price_lt_100),
    );
    expect(res.body.data).not.toContainEqual(
      expect.objectContaining(offers.price_gt_100),
    );
  });

  it('should allow a GET to /offer/:id', async () => {
    const res = await request(app).get(`/offer/${offer_ids.correct}`);
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.data).toBe('object');
    expect(res.body.data).toMatchObject(offers.correct);
  });

  it('should not allow a DELETE to /offer when unauthorized', async () => {
    const res = await request(app).delete(`/offer/${offer_ids.correct}`);
    expect(res.status).toBe(401);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.errors).toBe('object');
  });

  it('should not allow a DELETE to /offer when unauthorized (different host)', async () => {
    const res = await request(app)
      .delete(`/offer/${offer_ids.correct}`)
      .set('Authorization', user_tokens.host2);
    expect(res.status).toBe(403);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.errors).toBe('object');
  });

  it('should not allow a DELETE to /offer when unauthorized (different user)', async () => {
    const res = await request(app)
      .delete(`/offer/${offer_ids.correct}`)
      .set('Authorization', user_tokens.user);
    expect(res.status).toBe(403);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.errors).toBe('object');
  });

  it('should allow a DELETE to /offer when authorized', async () => {
    const res = await request(app)
      .delete(`/offer/${offer_ids.correct}`)
      .set('Authorization', user_tokens.host1);
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe('object');
    expect(typeof res.body.data).toBe('object');
    expect(res.body.data).toMatchObject(offers.correct);
  });
});
