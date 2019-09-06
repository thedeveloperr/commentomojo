const request = require('supertest');
const app = require('../../app');
const userFixtures = require('../user_fixtures');
const knex = require('../../db/config');

beforeEach(async ()=>{
  await knex.seed.run();
});

afterAll(async ()=>{
  await knex.seed.run();
});

describe('POST /api/user/signup', () => {
  it('respond with 200 created', async () => {
    const userData = userFixtures.rawData.testUser5;
    let data = {
      user: {
        username: userData.username,
        password: userData.password
      }
    };
    const response =  await request(app)
      .post('/api/user/signup')
      .send(data)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual("application/json");
    expect(response.body.data.user.id).toBeDefined();
    expect(response.body.data.user.password).toBe("HIDDEN");
    expect(response.body.data.user.username).toBe(userData.username);
  }, 10000);
  it('respond with 409 when username already exists', async()=>{
    const userData = userFixtures.rawData.testUser1;
    let data = {
      user: {
        username: userData.username,
        password: userData.password
      }
    };
    let response =  await request(app)
      .post('/api/user/signup')
      .send(data)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(409);
    expect(response.type).toEqual("application/json");
    expect(response.body.message).toBe("User with same information already exists.");
    expect(response.body.data).toBe(undefined);

  });
  it('respond with 400 when any param is missing', async () => {
    const userData = userFixtures.rawData.testUser5;
    let data = {
      userMisspelt: {
        username: userData.username,
        password: userData.password
      }
    };
    let response =  await request(app)
      .post('/api/user/signup')
      .send(data)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(400);
    expect(response.type).toEqual("application/json");
    expect(response.body.message).toBe("User details param(s) missing.");
    expect(response.body.data).toBe(undefined);
    data = {
      user: {
        username: userData.username,
      }
    };
    response =  await request(app)
      .post('/api/user/signup')
      .send(data)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(400);
    expect(response.type).toEqual("application/json");
    expect(response.body.message).toBe("password param(s) missing.");
    expect(response.body.data).toBe(undefined);
    data = {
      user: {
        password: userData.password
      }
    };
    response =  await request(app)
      .post('/api/user/signup')
      .send(data)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(400);
    expect(response.type).toEqual("application/json");
    expect(response.body.message).toBe("username param(s) missing.");
    expect(response.body.data).toBe(undefined);

    data = {
      user: {
      }
    };
    response =  await request(app)
      .post('/api/user/signup')
      .send(data)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(400);
    expect(response.type).toEqual("application/json");
    expect(response.body.message).toBe("username,password param(s) missing.");
    expect(response.body.data).toBe(undefined);

  }, 10000);

});
