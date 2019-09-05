const knex = require('../../../db/config');
const Comment = require('../../../models/Comment');
const userFixtures = require('../../user_fixtures.js');
const commentFixtures = require('../../comment_fixtures.js');
const {
  UniqueViolationError,
  ForeignKeyViolationError
} = require('objection-db-errors');
const {
  NotFoundError,
  transaction,
  Model
} = require('objection');

describe('Comment.fetchComment', () => {
  it('throws NotFoundError for non existing comment id', async () => {
    const trx = await transaction.start(Model.knex());
    const commentId = 100001;
    const spy = jest.spyOn(Model, 'query');
    await expect(Comment.fetchComment(commentId, trx)).rejects.toThrow(NotFoundError);
    expect(spy).toBeCalledWith(trx);
    spy.mockRestore();
    await trx.rollback();
  });

  it('fetch comment', async () => {
    const seededCommentToCompare = commentFixtures.seededPost1Comments[2];
    const trx = await transaction.start(Model.knex());
    const spy = jest.spyOn(Model, 'query');
    const fetchedComment = await Comment.fetchComment(seededCommentToCompare.id, trx);
    expect(fetchedComment).toEqual(seededCommentToCompare);
    expect(spy).toBeCalledWith(trx);
    spy.mockRestore();
    await trx.rollback();
  });
});


describe('Comment.insertCommentOnPost', () => {
  it('throws ForeignKeyViolationError for non existing commenterId in users', async () => {
    const trx = await transaction.start(Model.knex());
    const spy = jest.spyOn(Model, 'query');
    const postId = 12;
    const commenterId = 1000001;
    const text = "random"
    await expect(Comment.insertCommentOnPost(postId,commenterId,text,trx)).rejects.toThrow(ForeignKeyViolationError);
    expect(spy).toBeCalledWith(trx);
    spy.mockRestore();
    await trx.rollback();
  });

  it('inserts and fetch multiple new comment on a post', async () => {
    const trx = await transaction.start(Model.knex());
    const spy = jest.spyOn(Model, 'query');
    let postId = 122;
    let commenterId = userFixtures.rawData.testUser1.id;
    let text = "random";
    let insertedComment = await Comment.insertCommentOnPost(postId, commenterId, text, trx);
    expect(insertedComment).toBeInstanceOf(Comment);
    expect(insertedComment.id).toBeDefined();
    expect(insertedComment.text).toBe(text);
    expect(insertedComment.parentPostId).toBe(postId);
    expect(insertedComment.commenterId).toBe(commenterId);
    expect(insertedComment.upvotes).toBe(0);
    expect(insertedComment.downvotes).toBe(0);
    expect(spy).toBeCalledWith(trx);
    spy.mockClear();

    text = "random2";
    insertedComment = await Comment.insertCommentOnPost(postId, commenterId, text, trx);
    expect(insertedComment).toBeInstanceOf(Comment);
    expect(insertedComment.id).toBeDefined();
    expect(insertedComment.text).toBe(text);
    expect(insertedComment.parentPostId).toBe(postId);
    expect(insertedComment.commenterId).toBe(commenterId);
    expect(insertedComment.upvotes).toBe(0);
    expect(insertedComment.downvotes).toBe(0);
    expect(spy).toBeCalledWith(trx);
    spy.mockClear();

    commenterId = userFixtures.rawData.testUser2.id;
    text = "random3";
    insertedComment = await Comment.insertCommentOnPost(postId, commenterId, text, trx);
    expect(insertedComment).toBeInstanceOf(Comment);
    expect(insertedComment.id).toBeDefined();
    expect(insertedComment.text).toBe(text);
    expect(insertedComment.parentPostId).toBe(postId);
    expect(insertedComment.commenterId).toBe(commenterId);
    expect(insertedComment.upvotes).toBe(0);
    expect(insertedComment.downvotes).toBe(0);
    expect(spy).toBeCalledWith(trx);
    spy.mockClear();

    postId = 133;
    text = "random4";
    insertedComment = await Comment.insertCommentOnPost(postId, commenterId, text, trx);
    expect(insertedComment).toBeInstanceOf(Comment);
    expect(insertedComment.id).toBeDefined();
    expect(insertedComment.text).toBe(text);
    expect(insertedComment.parentPostId).toBe(postId);
    expect(insertedComment.commenterId).toBe(commenterId);
    expect(insertedComment.upvotes).toBe(0);
    expect(insertedComment.downvotes).toBe(0);
    expect(spy).toBeCalledWith(trx);
    spy.mockRestore();
    await trx.rollback();

  });
});

describe('Comment.getCommentsOnPost', () => {
  it('throws NotFoundError for non existing postId', async () => {
    const postId = 100001;
    const trx = await transaction.start(Model.knex());
    const spy = jest.spyOn(Model, 'query');
    await expect(Comment.getCommentsOnPost(postId, 1, 10, trx)).rejects.toThrow(NotFoundError);
    expect(spy).toBeCalledWith(trx);
    spy.mockRestore();
    await trx.rollback();
  });

  it('throws NotFoundError for lastCommentId > largest comment id for a post', async () => {
    const postId = 1;
    const lastCommentId = 1001;
    const trx = await transaction.start(Model.knex());
    const spy = jest.spyOn(Model, 'query');
    await expect(Comment.getCommentsOnPost(postId, lastCommentId, 10, trx)).rejects.toThrow(NotFoundError);
    expect(spy).toBeCalledWith(trx);
    spy.mockRestore();
    await trx.rollback();
  });

  it('throws NotFoundError for limit 0', async () => {
    const postId = 1;
    const lastCommentId = 1001;
    const trx = await transaction.start(Model.knex());
    const spy = jest.spyOn(Model, 'query');
    await expect(Comment.getCommentsOnPost(postId, lastCommentId, 0, trx)).rejects.toThrow(NotFoundError);
    expect(spy).toBeCalledWith(trx);
    spy.mockRestore();
    await trx.rollback();
  });



  it('fetch multiple comments on a post', async () => {
    let postId = 1;
    const trx = await transaction.start(Model.knex());
    const spy = jest.spyOn(Model, 'query');
    let limit = 4;
    let previousId = 3;
    const fetchedComments = await Comment.getCommentsOnPost(postId,previousId, limit,trx);
    const postId1Comments = [...commentFixtures.seededPost1Comments];
    postId1Comments.sort((a,b)=>a.id-b.id);
    let postId1CommentsPortion = postId1Comments.filter(e=>e.id > previousId).slice(0,limit);
    const {userIdToDataMap} = userFixtures;
    fetchedComments.forEach((e, index)=>{
      expect(e).toBeInstanceOf(Comment);
      expect(e.commenterId).toBe(postId1CommentsPortion[index].commenterId);
      expect(e.commenterUsername).toBe(userIdToDataMap[e.commenterId].username);
      expect(e.parentPostId).toBe(1);
      expect(e.id).toBe(postId1CommentsPortion[index].id);
      expect(e.text).toBe(postId1CommentsPortion[index].text);
      expect(e.upvotes).toBe(postId1CommentsPortion[index].upvotes);
      expect(e.downvotes).toBe(postId1CommentsPortion[index].downvotes);
    });
    expect(spy).toBeCalledWith(trx);
    spy.mockClear();
    postId = 2;
    limit = 10;
    previousId = 5;
    let fetchedComments2 = await Comment.getCommentsOnPost(postId, previousId, limit, trx);
    let postId2Comments = [...commentFixtures.seededPost2Comments];
    postId2Comments.sort((a,b)=>a.id-b.id);
    let postId2CommentsPortion = postId2Comments.filter(e=>e.id > previousId).slice(0,limit);
    fetchedComments2.forEach((e, index)=>{
      expect(e).toBeInstanceOf(Comment);
      expect(e.commenterId).toBe(postId2CommentsPortion[index].commenterId);
      expect(e.commenterUsername).toBe(userIdToDataMap[e.commenterId].username);
      expect(e.parentPostId).toBe(2);
      expect(e.id).toBe(postId2CommentsPortion[index].id);
      expect(e.text).toBe(postId2CommentsPortion[index].text);
      expect(e.upvotes).toBe(postId2CommentsPortion[index].upvotes);
      expect(e.downvotes).toBe(postId2CommentsPortion[index].downvotes);
    });
    expect(spy).toBeCalledWith(trx);
    expect(fetchedComments2.length).toBe(postId2CommentsPortion.length);
    spy.mockClear();
    postId = 2;
    limit = 10;
    previousId = 0;
    fetchedComments2 = await Comment.getCommentsOnPost(postId, previousId, limit, trx);
    postId2Comments = [...commentFixtures.seededPost2Comments];
    postId2Comments.sort((a,b)=>a.id-b.id);
    postId2CommentsPortion = postId2Comments.filter(e=>e.id > previousId).slice(0,limit);
    fetchedComments2.forEach((e, index)=>{
      expect(e).toBeInstanceOf(Comment);
      expect(e.parentPostId).toBe(2);
      expect(e.commenterId).toBe(postId2CommentsPortion[index].commenterId);
      expect(e.commenterUsername).toBe(userIdToDataMap[e.commenterId].username);
      expect(e.id).toBe(postId2CommentsPortion[index].id);
      expect(e.text).toBe(postId2CommentsPortion[index].text);
      expect(e.upvotes).toBe(postId2CommentsPortion[index].upvotes);
      expect(e.downvotes).toBe(postId2CommentsPortion[index].downvotes);
    });
    expect(spy).toBeCalledWith(trx);
    expect(fetchedComments2.length).toBe(postId2CommentsPortion.length);

    spy.mockRestore();
    await trx.rollback();
  });
});

describe('Comment.incrementUpvotes', () => {
  it('throws NotFoundError for non existing comment id', async () => {
    const trx = await transaction.start(Model.knex());
    const commentId = 100001;
    const spy = jest.spyOn(Model, 'query');
    await expect(Comment.incrementUpvotes(commentId, trx)).rejects.toThrow(NotFoundError);
    expect(spy).toBeCalledWith(trx);
    spy.mockRestore();
    await trx.rollback();
  });

  it('increment upvotes on comment', async () => {
    commentFixtures.commentSeedData.forEach(async (commentData) =>{
      const trx = await transaction.start(Model.knex());
      const spy = jest.spyOn(Model, 'query');
      let updatedComment = await Comment.incrementUpvotes(commentData.id, trx);
      expect(updatedComment).toBeInstanceOf(Comment);
      expect(updatedComment.id).toBe(commentData.id);
      expect(updatedComment.upvotes).toBe(commentData.upvotes+1);
      expect(updatedComment.downvotes).toBe(commentData.downvotes);
      expect(spy).toBeCalledWith(trx);
      spy.mockRestore();
      await trx.rollback();
    });
  });
});

describe('Comment.incrementDownvotes', () => {
  it('throws NotFoundError for non existing comment id', async () => {
    const trx = await transaction.start(Model.knex());
    const commentId = 100001;
    const spy = jest.spyOn(Model, 'query');
    await expect(Comment.incrementDownvotes(commentId, trx)).rejects.toThrow(NotFoundError);
    expect(spy).toBeCalledWith(trx);
    spy.mockRestore();
    await trx.rollback();
  });

  it('increment downvotes on comment', async () => {
    commentFixtures.commentSeedData.forEach(async (commentData) =>{
      const trx = await transaction.start(Model.knex());
      const spy = jest.spyOn(Model, 'query');
      let updatedComment = await Comment.incrementDownvotes(commentData.id, trx);
      expect(updatedComment).toBeInstanceOf(Comment);
      expect(updatedComment.id).toBe(commentData.id);
      expect(updatedComment.upvotes).toBe(commentData.upvotes);
      expect(updatedComment.downvotes).toBe(commentData.downvotes+1);
      expect(spy).toBeCalledWith(trx);
      spy.mockRestore();
      await trx.rollback();
    });
  });
});

describe('Comment.decrementUpvotes', () => {
  it('throws NotFoundError for non existing comment id', async () => {
    const trx = await transaction.start(Model.knex());
    const commentId = 100001;
    const spy = jest.spyOn(Model, 'query');
    await expect(Comment.decrementUpvotes(commentId, trx)).rejects.toThrow(NotFoundError);
    expect(spy).toBeCalledWith(trx);
    spy.mockRestore();
    await trx.rollback();
  });

  it('decrement upvotes on comment', async () => {
    commentFixtures.commentSeedData.forEach(async (commentData) =>{
      const trx = await transaction.start(Model.knex());
      const spy = jest.spyOn(Model, 'query');
      let updatedComment = await Comment.decrementUpvotes(commentData.id, trx);
      expect(updatedComment).toBeInstanceOf(Comment);
      expect(updatedComment.id).toBe(commentData.id);
      expect(updatedComment.upvotes).toBe(commentData.upvotes-1);
      expect(updatedComment.downvotes).toBe(commentData.downvotes);
      expect(spy).toBeCalledWith(trx);
      spy.mockRestore();
      await trx.rollback();
    });
  });
});

describe('Comment.decrementDownvotes', () => {
  it('throws NotFoundError for non existing comment id', async () => {
    const trx = await transaction.start(Model.knex());
    const commentId = 100001;
    const spy = jest.spyOn(Model, 'query');
    await expect(Comment.decrementDownvotes(commentId, trx)).rejects.toThrow(NotFoundError);
    expect(spy).toBeCalledWith(trx);
    spy.mockRestore();
    await trx.rollback();
  });

  it('decrement downvotes on comment', async () => {
    commentFixtures.commentSeedData.forEach(async (commentData) =>{
      const trx = await transaction.start(Model.knex());
      const spy = jest.spyOn(Model, 'query');
      let updatedComment = await Comment.decrementDownvotes(commentData.id, trx);
      expect(updatedComment).toBeInstanceOf(Comment);
      expect(updatedComment.id).toBe(commentData.id);
      expect(updatedComment.upvotes).toBe(commentData.upvotes);
      expect(updatedComment.downvotes).toBe(commentData.downvotes-1);
      expect(spy).toBeCalledWith(trx);
      spy.mockRestore();
      await trx.rollback();
    });
  });
});


