
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

describe('POST /api/user/login', () => {
  it('respond with 200 logged in', async () => {
    const userData = userFixtures.rawData.testUser1;
    let data = {
      username: userData.username,
      password: userData.password
    };
    const agent = request.agent(app);
    const response =  await agent
      .post('/api/user/login')
      .send(data)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(200);
    expect(response.header['set-cookie']).toBeDefined();
    expect(response.type).toEqual("application/json");
    expect(response.body.message).toBe("Successfully Loggedin !");
  }, 10000);

  it('respond with 401 if loggin failed', async () => {
    const userData = userFixtures.rawData.testUser1;
    let data = {
      username: userData.username,
      password: "wrongpassword"
    };
    const agent = request.agent(app);
    const response =  await agent
      .post('/api/user/login')
      .send(data)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(401);
    expect(response.header['set-cookie']).not.toBeDefined();
  }, 10000);
  it('respond with 400 when any param is missing', async () => {
    const userData = userFixtures.rawData.testUser1;
    let data = {
      password: userData.password
    };
    const agent = request.agent(app);
    let response =  await agent
      .post('/api/user/login')
      .send(data)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(400);
    expect(response.type).toEqual("application/json");
    expect(response.body.message).toBe("username param(s) missing.");
    data =  {
      username: userData.username,
    };
    response =  await agent
      .post('/api/user/login')
      .send(data)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(400);
    expect(response.type).toEqual("application/json");
    expect(response.body.message).toBe("password param(s) missing.");
    data = {
      misspelt: "username",
      missplet: "password"
    };
    response =  await agent
      .post('/api/user/login')
      .send(data)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(400);
    expect(response.type).toEqual("application/json");
    expect(response.body.message).toBe("username,password param(s) missing.");

  }, 10000);

});
