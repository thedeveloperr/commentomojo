const knex = require('../../../db/config');
const Vote = require('../../../models/Vote');
const userFixtures = require('../../user_fixtures.js');
const commentFixtures = require('../../comment_fixtures.js');
const {
  UniqueViolationError,
  ForeignKeyViolationError
} = require('objection-db-errors');
const {
  NotFoundError,
  Model,
  transaction
} = require('objection');


describe('Vote.insertUpvote and Vote.insertDownvote', () => {
  it('throws ForeignKeyViolationError for non existing voterId in users', async () => {
    const trx = await transaction.start(Model.knex());
    const spy = jest.spyOn(Model, 'query');
    const parentCommentId = 1;
    const voterId = 1000001;
    await expect(Vote.insertUpvote(parentCommentId, voterId, trx)).rejects.toThrow(ForeignKeyViolationError);
    expect(spy).toBeCalledWith(trx);
    spy.mockClear();
    await expect(Vote.insertDownvote(parentCommentId, voterId, trx)).rejects.toThrow(ForeignKeyViolationError);
    expect(spy).toBeCalledWith(trx);
    spy.mockRestore();
    await trx.rollback();
  });

  it('throws ForeignKeyViolationError for non existing parentCommentId in comments', async () => {
    const parentCommentId = 4801;
    const trx = await transaction.start(Model.knex());
    const spy = jest.spyOn(Model, 'query');
    const voterId = 1;
    await expect(Vote.insertUpvote(parentCommentId, voterId, trx)).rejects.toThrow(ForeignKeyViolationError);
    expect(spy).toBeCalledWith(trx);
    spy.mockClear();
    await expect(Vote.insertDownvote(parentCommentId, voterId, trx)).rejects.toThrow(ForeignKeyViolationError);
    expect(spy).toBeCalledWith(trx);
    spy.mockRestore();
    await trx.rollback();
  });

  it('allow one vote for a user on a comment', async () => {
    const trx = await transaction.start(Model.knex());
    const spy = jest.spyOn(Model, 'query');
    let parentCommentId = commentFixtures.commentSeedData[0].id;
    let commenterId = commentFixtures.commentSeedData[0].commenterId;
    let voterId = userFixtures.rawData.testUser2.id;
    let insertedVote = await Vote.insertUpvote(parentCommentId, voterId, trx);
    expect(spy).toBeCalledWith(trx);
    spy.mockClear();
    expect(insertedVote).toBeInstanceOf(Vote);
    expect(insertedVote.parentCommentId).toBe(parentCommentId);
    expect(insertedVote.voterId).toBe(voterId);
    expect(insertedVote.upvote).toBe(true);
    await expect(Vote.insertUpvote(parentCommentId, voterId,trx)).rejects.toThrow(UniqueViolationError);
    expect(spy).toBeCalledWith(trx);
    spy.mockClear();
    await expect(Vote.insertDownvote(parentCommentId, voterId, trx)).rejects.toThrow(UniqueViolationError);
    expect(spy).toBeCalledWith(trx);
    spy.mockClear();

    parentCommentId = commentFixtures.commentSeedData[1].id;
    commenterId = commentFixtures.commentSeedData[1].commenterId;
    voterId = userFixtures.rawData.testUser2.id;
    insertedVote = await Vote.insertDownvote(parentCommentId, voterId,trx);
    expect(spy).toBeCalledWith(trx);
    spy.mockClear();
    expect(insertedVote).toBeInstanceOf(Vote);
    expect(insertedVote.parentCommentId).toBe(parentCommentId);
    expect(insertedVote.voterId).toBe(voterId);
    expect(insertedVote.upvote).toBe(false);
    await expect(Vote.insertUpvote(parentCommentId, voterId, trx)).rejects.toThrow(UniqueViolationError);
    expect(spy).toBeCalledWith(trx);
    spy.mockClear();
    await expect(Vote.insertDownvote(parentCommentId, voterId, trx)).rejects.toThrow(UniqueViolationError);
    expect(spy).toBeCalledWith(trx);
    spy.mockClear();

    let alreadyInsertedVoteCommentId = commentFixtures.voteSeedData[0].parentCommentId;
    let alreadyInsertedVoteVoterId = commentFixtures.voteSeedData[0].voterId;
    await expect(Vote.insertUpvote(parentCommentId, voterId, trx)).rejects.toThrow(UniqueViolationError);
    expect(spy).toBeCalledWith(trx);
    spy.mockClear();
    await expect(Vote.insertDownvote(parentCommentId, voterId, trx)).rejects.toThrow(UniqueViolationError);
    expect(spy).toBeCalledWith(trx);
    spy.mockRestore();
    await trx.rollback();

  });

});

describe('Vote.removeVote', () => {
  it('throws NotFoundError for non existing vote', async () => {
    const trx = await transaction.start(Model.knex());
    const spy = jest.spyOn(Model, 'query');
    let parentCommentId = 100001;
    let voterId = 1;
    await expect(Vote.removeVote(parentCommentId, voterId, trx)).rejects.toThrow(NotFoundError);
    expect(spy).toBeCalledWith(trx);
    spy.mockClear();
    parentCommentId = 1;
    voterId = 10001;
    await expect(Vote.removeVote(parentCommentId, voterId, trx)).rejects.toThrow(NotFoundError);
    expect(spy).toBeCalledWith(trx);
    spy.mockRestore();
    await trx.rollback();
  });
  it('removes vote', async () => {
    const trx = await transaction.start(Model.knex());
    const spy = jest.spyOn(Model, 'query');
    const parentCommentId = 7;
    const voterId = 1;
    await expect(Vote.removeVote(parentCommentId, voterId, trx)).resolves.toBe(1);
    expect(spy).toBeCalledWith(trx);
    spy.mockRestore();
    await trx.rollback();
  });
});
