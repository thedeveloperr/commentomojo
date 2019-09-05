const request = require('supertest');
const app = require('../../app');
const userFixtures = require('../user_fixtures');
const commentFixtures = require('../comment_fixtures');
const knex = require('../../db/config');

beforeAll(async ()=>{
  await knex.seed.run();
});

afterAll(async ()=>{
  await knex.seed.run();
});

describe('GET /comments', () => {
  async function fetchAndExpectRightComments(agent, postCommentsfixtures,
      parentPostId ,lastCommentId, limit) {
    const query = {
      parentPostId
    };
    if(lastCommentId) query.lastCommentId = lastCommentId;
    if(limit) query.limit = limit;
    const response = await agent
      .get('/comments')
      .query(query)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(200);
    expect(response.body.data.comments).toBeDefined();
    const fetchedComments = response.body.data.comments;
    lastCommentId = lastCommentId || 0;
    limit = limit || 10;
    postCommentsfixtures.sort((a,b)=>a.id-b.id);
    const limitedComments = postCommentsfixtures.filter(e=>e.id > lastCommentId).slice(0,limit);
    const {userIdToDataMap} = userFixtures;
    expect(fetchedComments.length).toBe(limitedComments.length);
    fetchedComments.forEach((e, index)=>{
      expect(e.parentPostId).toBe(parentPostId);
      expect(e.commenterId).toBe(limitedComments[index].commenterId);
      expect(e.commenterUsername).toBe(userIdToDataMap[e.commenterId].username);
      expect(e.id).toBe(limitedComments[index].id);
      expect(e.text).toBe(limitedComments[index].text);
      expect(e.upvotes).toBe(limitedComments[index].upvotes);
      expect(e.downvotes).toBe(limitedComments[index].downvotes);
    });

  }
  it('get comments when logged in', async () => {
    const userData = userFixtures.rawData.testUser1;
    const data = {
      username: userData.username,
      password: userData.password
    };
    const agent = request.agent(app);
    let response =  await agent
      .post('/user/login')
      .send(data)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(200);
    expect(response.header['set-cookie']).toBeDefined();
    expect(response.type).toEqual("application/json");
    expect(response.body.message).toBe("Successfully Loggedin !");
    let parentPostId = 1;
    postCommentsfixtures = [...commentFixtures.seededPost1Comments];
    await fetchAndExpectRightComments(agent, postCommentsfixtures, 1, 3, 4)
    parentPostId = 2;
    postCommentsfixtures = [...commentFixtures.seededPost2Comments];
    await fetchAndExpectRightComments(agent, postCommentsfixtures, 2, 5, 10)

  }, 10000);
  it('get comments when not logged in', async () => {
    const userData = userFixtures.rawData.testUser1;
    const agent = request.agent(app);
    let parentPostId = 1;
    postCommentsfixtures = [...commentFixtures.seededPost1Comments];
    await fetchAndExpectRightComments(agent, postCommentsfixtures, 1, 3, 4)
    parentPostId = 2;
    postCommentsfixtures = [...commentFixtures.seededPost2Comments];
    await fetchAndExpectRightComments(agent, postCommentsfixtures, 2, 5, 10)
    parentPostId = 2;
    postCommentsfixtures = [...commentFixtures.seededPost2Comments];
    await fetchAndExpectRightComments(agent, postCommentsfixtures, 2);

  }, 10000);

 it('raise error when get comments with non existing parentPostId', async () => {
    let parentPostId = 10001;
    const agent = request.agent(app);
    let limit = 3;
    let lastCommentId = 1;
    let response =  await agent
      .get('/comments')
      .query({lastCommentId})
      .query({limit})
      .query({parentPostId})
      .set('Accept', 'application/json');
    expect(response.status).toEqual(404);
    expect(response.body.message).toBe("Comment Not Found.");

  }, 10000);

  it('raise error when get comments with lastCommentId > max comment id of post', async () => {
    let parentPostId = 1;
    const agent = request.agent(app);
    let limit = 3;
    let lastCommentId = 10001;
    let response =  await agent
      .get('/comments')
      .query({lastCommentId})
      .query({limit})
      .query({parentPostId})
      .set('Accept', 'application/json');
    expect(response.status).toEqual(404);
    expect(response.body.message).toBe("Comment Not Found.");

  }, 10000);

});
