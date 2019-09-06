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

async function loginAndExpectSuccess(agent, username, password) {
  const data = {
    username,
    password
  };
  const response = await agent
    .post('/api/user/login')
    .send(data)
    .set('Accept', 'application/json');
  expect(response.status).toEqual(200);
  expect(response.header['set-cookie']).toBeDefined();
  expect(response.type).toEqual("application/json");
  expect(response.body.message).toBe("Successfully Loggedin !");
}

async function fetchAllCommentsOfPostId(parentPostId,agent) {
  response = await agent
    .get(`/api/${parentPostId}/comments`)
    .query({
      lastCommentId: 0, // fetch all postId 1 comments
        limit: 10000 // estimately set to more than num of postId1 comments
      })
      .set('Accept', 'application/json');
    expect(response.status).toEqual(200);
    expect(response.body.data.comments[0].parentPostId).toBe(parentPostId);
  return response.body.data.comments;
}

describe('PUT :parentPostId/comments/:parentCommentId/upvote', ()=>{
  it('must not upvote when not logged in', async()=>{
    const agent = request.agent(app);
    const response = await agent
      .put('/api/1/comments/1/upvote')
      .set('Accept', 'application/json');
    expect(response.status).toEqual(401);
    expect(response.body.message).toBe("Login/Register to continue.");
  });
  it('must not reflect upvote in fetched comment when user upvoted while not logged in', async()=>{
    const agent = request.agent(app);
    const initialComments = await fetchAllCommentsOfPostId(1,agent);
    const response = await agent
      .put('/api/1/comments/1/upvote')
      .set('Accept', 'application/json');
    expect(response.status).toEqual(401);
    expect(response.body.message).toBe("Login/Register to continue.");
    const afterUpvoteAttempt = await fetchAllCommentsOfPostId(1, agent);
    expect(afterUpvoteAttempt).toEqual(initialComments);

  });
  it('must not be able upvote own comment when logged in', async()=>{
    const fixtureCommentToUpvote = commentFixtures.seededPost1Comments[0];
    const agent = request.agent(app);
    const userData = userFixtures.rawData.testUser1;
    await loginAndExpectSuccess(agent, userData.username, userData.password);
    const initialComments = await fetchAllCommentsOfPostId(1,agent);
    const response = await agent
      .put(`/api/1/comments/${fixtureCommentToUpvote.id}/upvote`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(409);
    const afterUpvoteAttempt = await fetchAllCommentsOfPostId(1, agent);
    expect(afterUpvoteAttempt).toEqual(initialComments);
    expect(response.body.message).toBe("Cannot Vote your own comment.");
  });

  it('must able to upvote only other user comments when logged in', async()=>{
    const fixtureCommentToUpvote = commentFixtures.seededPost1Comments[1];
    const agent = request.agent(app);
    const userData = userFixtures.rawData.testUser2;
    await loginAndExpectSuccess(agent, userData.username, userData.password);
    const initialComments = await fetchAllCommentsOfPostId(1,agent);
    const response = await agent
      .put(`/api/1/comments/${fixtureCommentToUpvote.id}/upvote`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(200);
    expect(response.body.data.comment.id).toBe(fixtureCommentToUpvote.id);
    expect(response.body.data.comment.commenterId).toBe(fixtureCommentToUpvote.commenterId);
    expect(response.body.data.comment.text).toBe(fixtureCommentToUpvote.text);
    expect(response.body.data.comment.upvotes).toBe(fixtureCommentToUpvote.upvotes+1);
    expect(response.body.data.comment.upvoted).toBe(true);
    expect(response.body.data.comment.downvoted).toBe(false);
    expect(response.body.data.comment.downvotes).toBe(fixtureCommentToUpvote.downvotes);
    const expectedComments = initialComments.map((e)=>{
      if (e.id === fixtureCommentToUpvote.id) return {...e,upvoted:true, downvoted: false,upvotes:e.upvotes+1};
      return e;
    });
    const afterUpvoteAttempt = await fetchAllCommentsOfPostId(1, agent);
    expect(afterUpvoteAttempt).toEqual(expectedComments);

  });
  it('must not be able to re-upvote on same comment posted by another user', async()=>{;
    const fixtureCommentToUpvote = commentFixtures.seededPost1Comments[4];
    const agent = request.agent(app);
    const userData = userFixtures.rawData.testUser1;
    await loginAndExpectSuccess(agent, userData.username, userData.password);
    const initialComments = await fetchAllCommentsOfPostId(1,agent);
    const response = await agent
      .put(`/api/1/comments/${fixtureCommentToUpvote.id}/upvote`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Already Voted Cannot vote twice on same comment.");
    const afterUpvoteAttempt = await fetchAllCommentsOfPostId(1, agent);
    expect(afterUpvoteAttempt).toEqual(initialComments);
  });

  it('must be able to upvote comment already having votes from other user', async()=>{
    const fixtureCommentToUpvote = commentFixtures.seededPost2Comments[3];
    const agent = request.agent(app);
    const userData = userFixtures.rawData.testUser1;
    await loginAndExpectSuccess(agent, userData.username, userData.password);
    const initialComments = await fetchAllCommentsOfPostId(2,agent);
    const response = await agent
      .put(`/api/2/comments/${fixtureCommentToUpvote.id}/upvote`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(200);
    expect(response.body.data.comment.id).toBe(fixtureCommentToUpvote.id);
    expect(response.body.data.comment.commenterId).toBe(fixtureCommentToUpvote.commenterId);
    expect(response.body.data.comment.text).toBe(fixtureCommentToUpvote.text);
    expect(response.body.data.comment.upvotes).toBe(fixtureCommentToUpvote.upvotes+1);
    expect(response.body.data.comment.upvoted).toBe(true);
    expect(response.body.data.comment.downvoted).toBe(false);
    expect(response.body.data.comment.downvotes).toBe(fixtureCommentToUpvote.downvotes);
    const expectedComments = initialComments.map((e)=>{
      if (e.id === fixtureCommentToUpvote.id) return {...e,upvoted:true, downvoted:false, upvotes:e.upvotes+1};
      return e;
    });
    const afterUpvoteAttempt = await fetchAllCommentsOfPostId(2, agent);
    expect(afterUpvoteAttempt).toEqual(expectedComments);

  });
  it('must raise 404 error when parentCommentId is not found.', async()=>{
    const agent = request.agent(app);
    const userData = userFixtures.rawData.testUser1;
    await loginAndExpectSuccess(agent, userData.username, userData.password);
    const response = await agent
      .put(`/api/2/comments/10001/upvote`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Comment Not Found.");
  });
  it('must raise 400 error when parentCommentId is not number.', async()=>{
    const agent = request.agent(app);
    const userData = userFixtures.rawData.testUser1;
    await loginAndExpectSuccess(agent, userData.username, userData.password);
    const response = await agent
      .put(`/api/2/comments/gdfggg/upvote`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("parentCommentId param is not a number but expected to be.");
  });

});

describe('DELETE :parentPostId/comments/:parentCommentId/upvote', ()=>{
  it('must not delete upvote when not logged in', async()=>{
    const agent = request.agent(app);
    const response = await agent
      .delete('/api/1/comments/1/upvote')
      .set('Accept', 'application/json');
    expect(response.status).toEqual(401);
    expect(response.body.message).toBe("Login/Register to continue.");
  });
  it('must not reflect deletion in upvote in fetched comment when user tried to delet upvote while not logged in', async()=>{
    const agent = request.agent(app);
    const initialComments = await fetchAllCommentsOfPostId(1,agent);
    const response = await agent
      .delete('/api/1/comments/1/upvote')
      .set('Accept', 'application/json');
    expect(response.status).toEqual(401);
    expect(response.body.message).toBe("Login/Register to continue.");
    const afterDeleteUpvoteAttempt = await fetchAllCommentsOfPostId(1, agent);
    expect(afterDeleteUpvoteAttempt).toEqual(initialComments);

  });
  it('must return 404 when user try to delete upvote on own comment when logged in', async()=>{
    const fixtureCommentToUpvote = commentFixtures.seededPost1Comments[4];
    const agent = request.agent(app);
    const userData = userFixtures.rawData.testUser3;
    await loginAndExpectSuccess(agent, userData.username, userData.password);
    const initialComments = await fetchAllCommentsOfPostId(1,agent);
    const response = await agent
      .delete(`/api/1/comments/${fixtureCommentToUpvote.id}/upvote`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Not Found. Invalid Vote.");
    const afterDeleteUpvoteAttempt = await fetchAllCommentsOfPostId(1, agent);
    expect(afterDeleteUpvoteAttempt).toEqual(initialComments);
  });

  it('must return 404 when user try to delete non existing upvote when logged in', async()=>{
    const fixtureCommentToUpvote = commentFixtures.seededPost1Comments[3];
    const agent = request.agent(app);
    const userData = userFixtures.rawData.testUser1;
    await loginAndExpectSuccess(agent, userData.username, userData.password);
    const initialComments = await fetchAllCommentsOfPostId(2,agent);
    const response = await agent
      .delete(`/api/2/comments/${fixtureCommentToUpvote.id}/upvote`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Not Found. Invalid Vote.");
    const afterDeleteUpvoteAttempt = await fetchAllCommentsOfPostId(2, agent);
    expect(afterDeleteUpvoteAttempt).toEqual(initialComments);
  });



  it('must able to delete own upvotes only on other user comments when logged in', async()=>{
    const fixtureCommentToUpvote = commentFixtures.seededPost1Comments[4];
    const agent = request.agent(app);
    const initialComments = await fetchAllCommentsOfPostId(1,agent);
    const userData = userFixtures.rawData.testUser4;
    await loginAndExpectSuccess(agent, userData.username, userData.password);
    const response = await agent
      .delete(`/api/1/comments/${fixtureCommentToUpvote.id}/upvote`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(200);
    expect(response.body.data.comment.id).toBe(fixtureCommentToUpvote.id);
    expect(response.body.data.comment.commenterId).toBe(fixtureCommentToUpvote.commenterId);
    expect(response.body.data.comment.text).toBe(fixtureCommentToUpvote.text);
    expect(response.body.data.comment.upvotes).toBe(fixtureCommentToUpvote.upvotes-1);
    expect(response.body.data.comment.downvotes).toBe(fixtureCommentToUpvote.downvotes);
    const expectedComments = initialComments.map((e)=>{
      if (e.id === fixtureCommentToUpvote.id) return {...e,upvotes:e.upvotes-1};
      return e;
    });
    const afterUpvoteAttempt = await fetchAllCommentsOfPostId(1, agent);
    expect(afterUpvoteAttempt).toEqual(expectedComments);

  });
  it('must not be able to re-delete upvote on same comment posted by another user', async()=>{;
    const fixtureCommentToUpvote = commentFixtures.seededPost1Comments[4];
    const agent = request.agent(app);
    const userData = userFixtures.rawData.testUser4;
    await loginAndExpectSuccess(agent, userData.username, userData.password);
    let response = await agent
      .delete(`/api/1/comments/${fixtureCommentToUpvote.id}/upvote`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(200);
    const initialComments = await fetchAllCommentsOfPostId(1,agent);
    response = await agent
      .delete(`/api/1/comments/${fixtureCommentToUpvote.id}/upvote`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Not Found. Invalid Vote.");
    const afterUpvoteAttempt = await fetchAllCommentsOfPostId(1, agent);
    expect(afterUpvoteAttempt).toEqual(initialComments);
  });

  it('must raise 404 error when parentCommentId is not found.', async()=>{
    const agent = request.agent(app);
    const initialComments = await fetchAllCommentsOfPostId(2,agent);
    const userData = userFixtures.rawData.testUser1;
    await loginAndExpectSuccess(agent, userData.username, userData.password);
    const response = await agent
      .delete(`/api/2/comments/10001/upvote`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Comment Not Found.");
  });
  it('must raise 400 error when parentCommentId is not number.', async()=>{
    const agent = request.agent(app);
    const initialComments = await fetchAllCommentsOfPostId(2,agent);
    const userData = userFixtures.rawData.testUser1;
    await loginAndExpectSuccess(agent, userData.username, userData.password);
    const response = await agent
      .delete(`/api/2/comments/gdfggg/upvote`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("parentCommentId param is not a number but expected to be.");
  });

});
describe('PUT :parentPostId/comments/:parentCommentId/downvote', ()=>{
  it('must not downvote when not logged in', async()=>{
    const agent = request.agent(app);
    const response = await agent
      .put('/api/1/comments/1/downvote')
      .set('Accept', 'application/json');
    expect(response.status).toEqual(401);
    expect(response.body.message).toBe("Login/Register to continue.");
  });
  it('must not reflect downvote in fetched comment when user downvoted while not logged in', async()=>{
    const agent = request.agent(app);
    const initialComments = await fetchAllCommentsOfPostId(1,agent);
    const response = await agent
      .put('/api/1/comments/1/downvote')
      .set('Accept', 'application/json');
    expect(response.status).toEqual(401);
    expect(response.body.message).toBe("Login/Register to continue.");
    const afterDownvoteAttempt = await fetchAllCommentsOfPostId(1, agent);
    expect(afterDownvoteAttempt).toEqual(initialComments);

  });
  it('must not be able downvote own comment when logged in', async()=>{
    const fixtureCommentToDownvote = commentFixtures.seededPost1Comments[0];
    const agent = request.agent(app);
    const userData = userFixtures.rawData.testUser1;
    await loginAndExpectSuccess(agent, userData.username, userData.password);
    const initialComments = await fetchAllCommentsOfPostId(1,agent);
    const response = await agent
      .put(`/api/1/comments/${fixtureCommentToDownvote.id}/downvote`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(409);
    const afterDownvoteAttempt = await fetchAllCommentsOfPostId(1, agent);
    expect(afterDownvoteAttempt).toEqual(initialComments);
    expect(response.body.message).toBe("Cannot Vote your own comment.");
  });

  it('must able to downvote only other user comments when logged in', async()=>{
    const fixtureCommentToDownvote = commentFixtures.seededPost1Comments[1];
    const agent = request.agent(app);
    const userData = userFixtures.rawData.testUser2;
    await loginAndExpectSuccess(agent, userData.username, userData.password);
    const initialComments = await fetchAllCommentsOfPostId(1,agent);
    const response = await agent
      .put(`/api/1/comments/${fixtureCommentToDownvote.id}/downvote`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(200);
    expect(response.body.data.comment.id).toBe(fixtureCommentToDownvote.id);
    expect(response.body.data.comment.commenterId).toBe(fixtureCommentToDownvote.commenterId);
    expect(response.body.data.comment.text).toBe(fixtureCommentToDownvote.text);
    expect(response.body.data.comment.downvotes).toBe(fixtureCommentToDownvote.downvotes+1);
    expect(response.body.data.comment.upvoted).toBe(false);
    expect(response.body.data.comment.downvoted).toBe(true);
    expect(response.body.data.comment.upvotes).toBe(fixtureCommentToDownvote.upvotes);
    const expectedComments = initialComments.map((e)=>{
      if (e.id === fixtureCommentToDownvote.id) return {...e,downvoted:true, upvoted: false, downvotes:e.downvotes+1};
      return e;
    });
    const afterDownvoteAttempt = await fetchAllCommentsOfPostId(1, agent);
    expect(afterDownvoteAttempt).toEqual(expectedComments);

  });
  it('must not be able to re-downvote on same comment posted by another user', async()=>{;
    const fixtureCommentToDownvote = commentFixtures.seededPost1Comments[4];
    const agent = request.agent(app);
    const userData = userFixtures.rawData.testUser1;
    await loginAndExpectSuccess(agent, userData.username, userData.password);
    const initialComments = await fetchAllCommentsOfPostId(1,agent);
    const response = await agent
      .put(`/api/1/comments/${fixtureCommentToDownvote.id}/downvote`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Already Voted Cannot vote twice on same comment.");
    const afterDownvoteAttempt = await fetchAllCommentsOfPostId(1, agent);
    expect(afterDownvoteAttempt).toEqual(initialComments);
  });

  it('must be able to downvote comment already having votes from other user', async()=>{
    const fixtureCommentToDownvote = commentFixtures.seededPost2Comments[3];
    const agent = request.agent(app);
    const userData = userFixtures.rawData.testUser1;
    await loginAndExpectSuccess(agent, userData.username, userData.password);
    const initialComments = await fetchAllCommentsOfPostId(2,agent);
    const response = await agent
      .put(`/api/2/comments/${fixtureCommentToDownvote.id}/downvote`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(200);
    expect(response.body.data.comment.id).toBe(fixtureCommentToDownvote.id);
    expect(response.body.data.comment.commenterId).toBe(fixtureCommentToDownvote.commenterId);
    expect(response.body.data.comment.text).toBe(fixtureCommentToDownvote.text);
    expect(response.body.data.comment.downvotes).toBe(fixtureCommentToDownvote.downvotes+1);
    expect(response.body.data.comment.upvoted).toBe(false);
    expect(response.body.data.comment.downvoted).toBe(true);
    expect(response.body.data.comment.upvotes).toBe(fixtureCommentToDownvote.upvotes);
    const expectedComments = initialComments.map((e)=>{
      if (e.id === fixtureCommentToDownvote.id) return {...e, downvoted:true, upvoted:false,downvotes:e.downvotes+1};
      return e;
    });
    const afterDownvoteAttempt = await fetchAllCommentsOfPostId(2, agent);
    expect(afterDownvoteAttempt).toEqual(expectedComments);

  });
  it('must raise 404 error when parentCommentId is not found.', async()=>{
    const agent = request.agent(app);
    const initialComments = await fetchAllCommentsOfPostId(2,agent);
    const userData = userFixtures.rawData.testUser1;
    await loginAndExpectSuccess(agent, userData.username, userData.password);
    const response = await agent
      .put(`/api/2/comments/10001/downvote`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Comment Not Found.");
  });
  it('must raise 400 error when parentCommentId is not number.', async()=>{
    const agent = request.agent(app);
    const initialComments = await fetchAllCommentsOfPostId(2,agent);
    const userData = userFixtures.rawData.testUser1;
    await loginAndExpectSuccess(agent, userData.username, userData.password);
    const response = await agent
      .put(`/api/2/comments/gdfggg/downvote`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("parentCommentId param is not a number but expected to be.");
  });

});

describe('DELETE :parentPostId/comments/:parentCommentId/downvote', ()=>{
  it('must not delete downvote when not logged in', async()=>{
    const agent = request.agent(app);
    const response = await agent
      .delete('/api/1/comments/1/downvote')
      .set('Accept', 'application/json');
    expect(response.status).toEqual(401);
    expect(response.body.message).toBe("Login/Register to continue.");
  });
  it('must not reflect deletion in downvote in fetched comment when user tried to delet downvote while not logged in', async()=>{
    const agent = request.agent(app);
    const initialComments = await fetchAllCommentsOfPostId(1,agent);
    const response = await agent
      .delete('/api/1/comments/1/downvote')
      .set('Accept', 'application/json');
    expect(response.status).toEqual(401);
    expect(response.body.message).toBe("Login/Register to continue.");
    const afterDeleteDownvoteAttempt = await fetchAllCommentsOfPostId(1, agent);
    expect(afterDeleteDownvoteAttempt).toEqual(initialComments);

  });
  it('must return 404 when user try to delete downvote on own comment when logged in', async()=>{
    const fixtureCommentToDownvote = commentFixtures.seededPost1Comments[4];
    const agent = request.agent(app);
    const userData = userFixtures.rawData.testUser3;
    await loginAndExpectSuccess(agent, userData.username, userData.password);
    const initialComments = await fetchAllCommentsOfPostId(1,agent);
    const response = await agent
      .delete(`/api/1/comments/${fixtureCommentToDownvote.id}/downvote`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Not Found. Invalid Vote.");
    const afterDeleteDownvoteAttempt = await fetchAllCommentsOfPostId(1, agent);
    expect(afterDeleteDownvoteAttempt).toEqual(initialComments);
  });

  it('must return 404 when user try to delete non existing downvote when logged in', async()=>{
    const fixtureCommentToDownvote = commentFixtures.seededPost1Comments[3];
    const agent = request.agent(app);
    const userData = userFixtures.rawData.testUser1;
    await loginAndExpectSuccess(agent, userData.username, userData.password);
    const initialComments = await fetchAllCommentsOfPostId(2,agent);
    const response = await agent
      .delete(`/api/2/comments/${fixtureCommentToDownvote.id}/downvote`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Not Found. Invalid Vote.");
    const afterDeleteDownvoteAttempt = await fetchAllCommentsOfPostId(2, agent);
    expect(afterDeleteDownvoteAttempt).toEqual(initialComments);
  });



  it('must able to delete own downvotes only on other user comments when logged in', async()=>{
    const fixtureCommentToDownvote = commentFixtures.seededPost1Comments[4];
    const agent = request.agent(app);
    const userData = userFixtures.rawData.testUser4;
    await loginAndExpectSuccess(agent, userData.username, userData.password);
    const initialComments = await fetchAllCommentsOfPostId(1,agent);
    const response = await agent
      .delete(`/api/1/comments/${fixtureCommentToDownvote.id}/downvote`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(200);
    expect(response.body.data.comment.id).toBe(fixtureCommentToDownvote.id);
    expect(response.body.data.comment.commenterId).toBe(fixtureCommentToDownvote.commenterId);
    expect(response.body.data.comment.text).toBe(fixtureCommentToDownvote.text);
    expect(response.body.data.comment.downvotes).toBe(fixtureCommentToDownvote.downvotes-1);
    expect(response.body.data.comment.upvoted).not.toBeDefined();
    expect(response.body.data.comment.downvoted).not.toBeDefined();
    expect(response.body.data.comment.upvotes).toBe(fixtureCommentToDownvote.upvotes);
    const expectedComments = initialComments.map((e)=>{
      if (e.id === fixtureCommentToDownvote.id){
        let update = {...e,downvotes:e.downvotes-1};
        delete update.upvoted;
        delete update.downvoted;
        return update;
      };
      return e;
    });
    const afterDownvoteAttempt = await fetchAllCommentsOfPostId(1, agent);
    expect(afterDownvoteAttempt).toEqual(expectedComments);

  });
  it('must not be able to re-delete downvote on same comment posted by another user', async()=>{;
    const fixtureCommentToDownvote = commentFixtures.seededPost1Comments[4];
    const agent = request.agent(app);
    const userData = userFixtures.rawData.testUser4;
    await loginAndExpectSuccess(agent, userData.username, userData.password);
    let response = await agent
      .delete(`/api/1/comments/${fixtureCommentToDownvote.id}/downvote`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(200);
    const initialComments = await fetchAllCommentsOfPostId(1,agent);
    response = await agent
      .delete(`/api/1/comments/${fixtureCommentToDownvote.id}/downvote`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Not Found. Invalid Vote.");
    const afterDownvoteAttempt = await fetchAllCommentsOfPostId(1, agent);
    expect(afterDownvoteAttempt).toEqual(initialComments);
  });

  it('must raise 404 error when parentCommentId is not found.', async()=>{
    const agent = request.agent(app);
    const userData = userFixtures.rawData.testUser1;
    await loginAndExpectSuccess(agent, userData.username, userData.password);
    const initialComments = await fetchAllCommentsOfPostId(2,agent);
    const response = await agent
      .delete(`/api/2/comments/10001/downvote`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Comment Not Found.");
  });
  it('must raise 400 error when parentCommentId is not number.', async()=>{
    const agent = request.agent(app);
    const userData = userFixtures.rawData.testUser1;
    await loginAndExpectSuccess(agent, userData.username, userData.password);
    const initialComments = await fetchAllCommentsOfPostId(2,agent);
    const response = await agent
      .delete(`/api/2/comments/gdfggg/downvote`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("parentCommentId param is not a number but expected to be.");
  });

});

