const request = require('supertest');
const app = require('../../app');
const userFixtures = require('../user_fixtures');
const knex = require('../../db/config');

beforeAll(async ()=>{
  await knex.seed.run();
});

afterAll(async ()=>{
  await knex.seed.run();
});

describe('POST /api/user/signup and POST /api/user/login', () => {
  it('signup and login with same user successfully', async () => {
    const userData = userFixtures.rawData.testUser5;
    const data = {
      user: {
        username: userData.username,
        password: userData.password
      }
    };
    let response =  await request(app)
      .post('/api/user/signup')
      .send(data)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual("application/json");
    expect(response.body.data.user.id).toBeDefined();
    expect(response.body.data.user.password).toBe("HIDDEN");
    expect(response.body.data.user.username).toBe(userData.username);
    const agent = request.agent(app);
    response =  await agent
      .post('/api/user/login')
      .send(data.user)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(200);
    expect(response.header['set-cookie']).toBeDefined();
    expect(response.type).toEqual("application/json");
    expect(response.body.message).toBe("Successfully Loggedin !");
  }, 10000);
});
