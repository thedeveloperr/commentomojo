
const request = require('supertest');
const app = require('../../app');
const userFixtures = require('../user_fixtures');
const commentFixtures = require('../comment_fixtures');
const knex = require('../../db/config');

beforeEach(async ()=>{
  await knex.seed.run();
});

afterAll(async ()=>{
  await knex.seed.run();
});

async function fetchAllCommentsOfPostId(parentPostId,agent) {
  response = await agent
    .get(`/${parentPostId}/comments`)
    .query({
      lastCommentId: 0, // fetch all postId 1 comments
        limit: 10000 // estimately set to more than num of postId1 comments
      })
      .set('Accept', 'application/json');
    expect(response.status).toEqual(200);
    expect(response.body.data.comments[0].parentPostId).toBe(parentPostId);
  return response.body.data.comments;
}


describe('POST /comments', () => {
  it('add comment only when user is loggedin.', async () => {
    const userData = userFixtures.rawData.testUser1;
    let data = {
      username: userData.username,
      password: userData.password
    };
    const agent = request.agent(app);
    let response = await agent
      .post('/user/login')
      .send(data)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(200);
    expect(response.header['set-cookie']).toBeDefined();
    expect(response.type).toEqual("application/json");
    expect(response.body.message).toBe("Successfully Loggedin !");

    const fetchedOlderComments = await fetchAllCommentsOfPostId(1, agent);

    data = {
      comment: {
        parentPostId: 1,
        text: "Test comment"
      }
    };
    response =  await agent
      .post(`/${data.comment.parentPostId}/comments`)
      .send(data)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(200);
    expect(response.body.data.comment.parentPostId).toBe(1);
    expect(response.body.data.comment.commenterId).toBe(1);
    expect(response.body.data.comment.id).toBeDefined();
    expect(response.body.data.comment.upvotes).toBe(0);
    expect(response.body.data.comment.downvotes).toBe(0);

    // Ensure new comment addition
    const newComment = response.body.data.comment;
    newComment.commenterUsername = userData.username;
    const fetchedNewerComments = await fetchAllCommentsOfPostId(1, agent);
    expect(fetchedNewerComments).toEqual([...fetchedOlderComments, newComment]);
  }, 10000);

  it('cannot add comment when user is not loggedin.', async () => {
    const agent = request.agent(app);
    const data = {
      comment: {
        parentPostId: 1,
        text: "Test comment"
      }
    };
    const fetchedCommentsBeforeTry = await fetchAllCommentsOfPostId(1, agent);
    response = await agent
      .post(`/${data.comment.parentPostId}/comments`)
      .send(data)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(401);
    expect(response.body.message).toBe("Login/Register to continue.");

    // Ensure no new addition
    const fetchedCommentAfterTry = await fetchAllCommentsOfPostId(1, agent);
    expect(fetchedCommentAfterTry).toEqual(fetchedCommentsBeforeTry);
  }, 10000);

   it('cannot add comment when params are missing.', async () => {
    const userData = userFixtures.rawData.testUser1;
    let data = {
      username: userData.username,
      password: userData.password
    };

    const agent = request.agent(app);
    let response = await agent
      .post('/user/login')
      .send(data)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(200);
    expect(response.header['set-cookie']).toBeDefined();
    expect(response.type).toEqual("application/json");
    expect(response.body.message).toBe("Successfully Loggedin !");

    const fetchedCommentsBeforeTry = await fetchAllCommentsOfPostId(1, agent);
    data = {
      comment: {
        text: "Test comment"
      }
    };
    response = await agent
      .post(`/${data.comment.parentPostId}/comments`)
      .send(data)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(400);
    expect(response.body.message).toBe("parentPostId param(s) missing.");
    data = {
      comment: {
      }
    };
    response = await agent
      .post(`/${data.comment.parentPostId}/comments`)
      .send(data)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(400);
    expect(response.body.message).toBe("parentPostId,text param(s) missing.");
    data = {
      comment: {
        parentPostId: 1
      }
    };
    response = await agent
      .post(`/${data.comment.parentPostId}/comments`)
      .send(data)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(400);
    expect(response.body.message).toBe("text param(s) missing.");

    // Ensure no new addition
    const fetchedCommentAfterTry = await fetchAllCommentsOfPostId(1, agent);
    expect(fetchedCommentAfterTry).toEqual(fetchedCommentsBeforeTry);
  }, 10000);

});
