
jest.mock('../../../models/Vote');
jest.mock('../../../models/Comment');
const Comment = require('../../../models/Comment');
const Vote = require('../../../models/Vote.js');
const CommentNotFoundError = require('../../../errors/CommentNotFoundError');
const VoteNotFoundError = require('../../../errors/VoteNotFoundError');
const AlreadyVotedError = require('../../../errors/AlreadyVotedError');
const VoterNotFoundError = require('../../../errors/VoterNotFoundError');
const CommenterNotFoundError = require('../../../errors/CommenterNotFoundError');
const SelfVoteError = require('../../../errors/SelfVoteError');
const CommentFixture = require('../../comment_fixtures');
const CommentService = require('../../../services/comment.service.js');
const {
  UniqueViolationError,
  ForeignKeyViolationError,
} = require('objection-db-errors');


jest.mock('objection',()=> {
  const original = require.requireActual('objection');
  return {
    ...original, //Pass down all the exported objects
    transaction: {
       start: jest.fn(),
    }
  };
});
const {
  NotFoundError,
  transaction
} = require('objection');

afterEach(()=>{
  jest.clearAllMocks()
});

describe('CommentService.getComments', ()=>{
  it('throws CommentNotFoundError when wrong postId given', async () =>{
    Comment.getCommentsOnPost.mockRejectedValue(new NotFoundError());
    await expect(CommentService.getComments(100001)).rejects.toThrow(CommentNotFoundError);
  });
  it('returns list of comments', async () =>{
    const commentsList =
      [
          { parentPostId:1, id:1, commenterId: 2, text:"c1" ,upvotes:0, downvotes: 0 },
          { parentPostId:1, id:2, commenterId: 3, text:"c1" ,upvotes:0, downvotes: 0 },
          { parentPostId:1, id:3, commenterId: 2, text:"c1" ,upvotes:0, downvotes: 0 },
          { parentPostId:1, id:4, commenterId: 4, text:"c1" ,upvotes:0, downvotes: 0 },
      ];
    Comment.getCommentsOnPost.mockResolvedValue(commentsList);
    await expect(CommentService.getComments(1)).resolves.toBe(commentsList);
  });

});

describe('CommentService.insertComment', ()=>{
  it('returns new inserted comment', async () =>{
    const newComment = {
        parentPostId: 1, id:1, commenterId: 2, text:"c1" ,upvotes:0, downvotes: 0
    };
    Comment.insertCommentOnPost.mockResolvedValue(newComment);
    await expect(CommentService.insertComment(1,2,"c1")).resolves.toBe(newComment);
    expect(Comment.insertCommentOnPost).toBeCalledWith(1, 2, "c1");
  });
  it('throws user not found error for no exisitng user.', async () =>{
    Comment.insertCommentOnPost.mockRejectedValue(new ForeignKeyViolationError({ nativeError: new Error('native') }));
    await expect(CommentService.insertComment(1,2,"c1")).rejects.toThrow(CommenterNotFoundError);
    expect(Comment.insertCommentOnPost).toBeCalledWith(1, 2, "c1");
  });

});


describe('CommentService.upvote', ()=>{
  it('throws CommentNotFoundError when nonexisting parentCommentId passed', async () =>{
    Comment.fetchComment.mockRejectedValue(new NotFoundError());
    await expect(CommentService.upvote(100001, 1)).rejects.toThrow(CommentNotFoundError);
    expect(transaction.start).toBeCalledTimes(0);
  });

  it('throws SelfVoteError when user try to vote own comment', async () =>{
    Comment.fetchComment.mockResolvedValue({
      commenterId: 1,
      id: 2
    });
    await expect(CommentService.upvote(2, 1)).rejects.toThrow(SelfVoteError);
    expect(transaction.start).toBeCalledTimes(0);
  });

  it('throws VoterNotFoundError when non exisitng user try to vote', async () =>{
    const trxMock = {commit:jest.fn(), rollback: jest.fn()};
    trxMock.commit.mockResolvedValue({});
    trxMock.rollback.mockResolvedValue({});
    const knexMock = {};
    Vote.knex.mockReturnValue(knexMock);
    transaction.start.mockResolvedValue(trxMock);
    Comment.fetchComment.mockResolvedValue({
      commenterId: 1,
      id: 2,
      upvotes: 1
    });
    Vote.insertUpvote.mockRejectedValue(new ForeignKeyViolationError({ nativeError: new Error('native') }));
    await expect(CommentService.upvote(2,2)).rejects.toThrow(VoterNotFoundError);
    expect(transaction.start).toBeCalledTimes(1);
    expect(transaction.start).toBeCalledWith(knexMock);
    expect(Vote.insertUpvote).toBeCalledWith(2,2, trxMock);
    expect(trxMock.commit).toBeCalledTimes(0);
    expect(trxMock.rollback).toBeCalledTimes(1);
  });

  it('throws AlreadyVotedError when user try to vote more than once', async ()=>{
    const trxMock = {commit:jest.fn(), rollback: jest.fn()};
    trxMock.commit.mockResolvedValue({});
    trxMock.rollback.mockResolvedValue({});
    const knexMock = {};
    Vote.knex.mockReturnValue(knexMock);
    transaction.start.mockResolvedValue(trxMock);
    Comment.fetchComment.mockResolvedValue({
      commenterId: 1,
      id: 2,
      upvotes: 1
    });
    Vote.insertUpvote.mockRejectedValue(new UniqueViolationError({ nativeError: new Error('native') }));
    await expect(CommentService.upvote(2,2)).rejects.toThrow(AlreadyVotedError);
    expect(transaction.start).toBeCalledTimes(1);
    expect(transaction.start).toBeCalledWith(knexMock);
    expect(Vote.insertUpvote).toBeCalledWith(2,2, trxMock);
    expect(trxMock.commit).toBeCalledTimes(0);
    expect(trxMock.rollback).toBeCalledTimes(1);

  });
  it('insert upvote, increase count and commit transaction when user upvotes', async ()=>{
    const trxMock = {commit:jest.fn(), rollback: jest.fn()};
    trxMock.commit.mockResolvedValue({});
    trxMock.rollback.mockResolvedValue({});
    const knexMock = {};
    Vote.knex.mockReturnValue(knexMock);
    transaction.start.mockResolvedValue(trxMock);
    Comment.fetchComment.mockResolvedValue({
      commenterId: 1,
      id: 2,
      upvotes: 1
    });
    Vote.insertUpvote.mockResolvedValue({});
    const mockUpdatedComment = {
      commenterId:1,
      id: 2,
      upvotes: 2
    };
    Comment.incrementUpvotes.mockResolvedValue(mockUpdatedComment);
    await expect(CommentService.upvote(2,2)).resolves.toBe(mockUpdatedComment);
    expect(transaction.start).toBeCalledTimes(1);
    expect(transaction.start).toBeCalledWith(knexMock);
    expect(Vote.insertUpvote).toBeCalledWith(2,2, trxMock);
    expect(Vote.insertUpvote).toBeCalledTimes(1);
    expect(Comment.incrementUpvotes).toBeCalledWith(2, trxMock);
    expect(Comment.incrementUpvotes).toBeCalledTimes(1);
    expect(trxMock.commit).toBeCalledTimes(1);
    expect(trxMock.rollback).toBeCalledTimes(0);

  });

});

describe('CommentService.downvote', ()=>{
  it('throws CommentNotFoundError when nonexisting parentCommentId passed', async () =>{
    Comment.fetchComment.mockRejectedValue(new NotFoundError());
    await expect(CommentService.downvote(100001, 1)).rejects.toThrow(CommentNotFoundError);
    expect(transaction.start).toBeCalledTimes(0);
  });

  it('throws SelfVoteError when user try to vote own comment', async () =>{
    Comment.fetchComment.mockResolvedValue({
      commenterId: 1,
      id: 2
    });
    await expect(CommentService.downvote(2, 1)).rejects.toThrow(SelfVoteError);
    expect(transaction.start).toBeCalledTimes(0);
  });

  it('throws AlreadyVotedError when user try to vote more than once', async ()=>{
    const trxMock = {commit:jest.fn(), rollback: jest.fn()};
    trxMock.commit.mockResolvedValue({});
    trxMock.rollback.mockResolvedValue({});
    const knexMock = {};
    Vote.knex.mockReturnValue(knexMock);
    transaction.start.mockResolvedValue(trxMock);
    Comment.fetchComment.mockResolvedValue({
      commenterId: 1,
      id: 2,
      downvotes: 1
    });
    Vote.insertDownvote.mockRejectedValue(new UniqueViolationError({ nativeError: new Error('native') }));
    await expect(CommentService.downvote(2,2)).rejects.toThrow(AlreadyVotedError);
    expect(transaction.start).toBeCalledTimes(1);
    expect(transaction.start).toBeCalledWith(knexMock);
    expect(Vote.insertDownvote).toBeCalledWith(2,2, trxMock);
    expect(trxMock.commit).toBeCalledTimes(0);
    expect(trxMock.rollback).toBeCalledTimes(1);

  });
  it('insert downvote, increase count and commit transaction when user downvotes', async ()=>{
    const trxMock = {commit:jest.fn(), rollback: jest.fn()};
    trxMock.commit.mockResolvedValue({});
    trxMock.rollback.mockResolvedValue({});
    const knexMock = {};
    Vote.knex.mockReturnValue(knexMock);
    transaction.start.mockResolvedValue(trxMock);
    Comment.fetchComment.mockResolvedValue({
      commenterId: 1,
      id: 2,
      downvotes: 1
    });
    Vote.insertDownvote.mockResolvedValue({});
    const mockUpdatedComment = {
      commenterId:1,
      id: 2,
      downvotes: 2
    };
    Comment.incrementDownvotes.mockResolvedValue(mockUpdatedComment);
    await expect(CommentService.downvote(2,2)).resolves.toBe(mockUpdatedComment);
    expect(transaction.start).toBeCalledTimes(1);
    expect(transaction.start).toBeCalledWith(knexMock);
    expect(Vote.insertDownvote).toBeCalledWith(2,2, trxMock);
    expect(Vote.insertDownvote).toBeCalledTimes(1);
    expect(Comment.incrementDownvotes).toBeCalledWith(2, trxMock);
    expect(Comment.incrementDownvotes).toBeCalledTimes(1);
    expect(trxMock.commit).toBeCalledTimes(1);
    expect(trxMock.rollback).toBeCalledTimes(0);

  });

});

describe('CommentService.removeDownvote', ()=>{
  it('throws CommentNotFoundError when nonexisting parentCommentId passed', async () =>{
    Comment.fetchComment.mockRejectedValue(new NotFoundError());
    await expect(CommentService.removeDownvote(100001, 1)).rejects.toThrow(CommentNotFoundError);
    expect(transaction.start).toBeCalledTimes(0);
  });

  it('throws VoteNotFoundError when user try to remove non existing vote', async () =>{
    const trxMock = {commit:jest.fn(), rollback: jest.fn()};
    trxMock.commit.mockResolvedValue({});
    trxMock.rollback.mockResolvedValue({});
    const knexMock = {};
    Vote.knex.mockReturnValue(knexMock);
    Comment.fetchComment.mockResolvedValue({
      commenterId: 1,
      id: 2,
      downvotes: 2
    });
    transaction.start.mockResolvedValue(trxMock);
    Vote.removeVote.mockRejectedValue(new NotFoundError());
    await expect(CommentService.removeDownvote(2, 1)).rejects.toThrow(VoteNotFoundError);
    expect(transaction.start).toBeCalledTimes(1);
    expect(transaction.start).toBeCalledWith(knexMock);
    expect(trxMock.rollback).toBeCalledTimes(1);
  });

  it('remove vote, decrease count and commit transaction when user remove downvotes', async ()=>{
    const trxMock = {commit:jest.fn(), rollback: jest.fn()};
    trxMock.commit.mockResolvedValue({});
    trxMock.rollback.mockResolvedValue({});
    const knexMock = {};
    Vote.knex.mockReturnValue(knexMock);
    transaction.start.mockResolvedValue(trxMock);
    Vote.removeVote.mockResolvedValue(1);
    Comment.fetchComment.mockResolvedValue({
      commenterId: 1,
      id: 2,
      downvotes: 2
    });
    const mockUpdatedComment = {
      commenterId:1,
      id: 2,
      downvotes: 1
    };
    Comment.decrementDownvotes.mockResolvedValue(mockUpdatedComment);
    await expect(CommentService.removeDownvote(2,2)).resolves.toBe(mockUpdatedComment);
    expect(transaction.start).toBeCalledTimes(1);
    expect(transaction.start).toBeCalledWith(knexMock);
    expect(Vote.removeVote).toBeCalledWith(2,2, trxMock);
    expect(Vote.removeVote).toBeCalledTimes(1);
    expect(Comment.decrementDownvotes).toBeCalledWith(2, trxMock);
    expect(Comment.decrementDownvotes).toBeCalledTimes(1);
    expect(trxMock.commit).toBeCalledTimes(1);
    expect(trxMock.rollback).toBeCalledTimes(0);

  });

});


describe('CommentService.removeUpvote', ()=>{
  it('throws CommentNotFoundError when nonexisting parentCommentId passed', async () =>{
    Comment.fetchComment.mockRejectedValue(new NotFoundError());
    await expect(CommentService.removeUpvote(100001, 1)).rejects.toThrow(CommentNotFoundError);
    expect(transaction.start).toBeCalledTimes(0);
  });

  it('throws VoteNotFoundError when user try to remove non existing vote', async () =>{
    const trxMock = {commit:jest.fn(), rollback: jest.fn()};
    trxMock.commit.mockResolvedValue({});
    trxMock.rollback.mockResolvedValue({});
    const knexMock = {};
    Vote.knex.mockReturnValue(knexMock);
    transaction.start.mockResolvedValue(trxMock);
    Comment.fetchComment.mockResolvedValue({
      commenterId: 1,
      id: 2,
      upvotes: 2
    });
    Vote.removeVote.mockRejectedValue(new NotFoundError());
    await expect(CommentService.removeUpvote(2, 1)).rejects.toThrow(VoteNotFoundError);
    expect(transaction.start).toBeCalledTimes(1);
    expect(transaction.start).toBeCalledWith(knexMock);
    expect(trxMock.rollback).toBeCalledTimes(1);
  });

  it('remove vote, decrease count and commit transaction when user remove downvotes', async ()=>{
    const trxMock = {commit:jest.fn(), rollback: jest.fn()};
    trxMock.commit.mockResolvedValue({});
    trxMock.rollback.mockResolvedValue({});
    const knexMock = {};
    Vote.knex.mockReturnValue(knexMock);
    transaction.start.mockResolvedValue(trxMock);
    Vote.removeVote.mockResolvedValue(1);
    Comment.fetchComment.mockResolvedValue({
      commenterId: 1,
      id: 2,
      upvotes: 2
    });
    const mockUpdatedComment = {
      commenterId:1,
      id: 2,
      upvotes: 1
    };
    Comment.decrementUpvotes.mockResolvedValue(mockUpdatedComment);
    await expect(CommentService.removeUpvote(2,2)).resolves.toBe(mockUpdatedComment);
    expect(transaction.start).toBeCalledTimes(1);
    expect(transaction.start).toBeCalledWith(knexMock);
    expect(Vote.removeVote).toBeCalledWith(2,2, trxMock);
    expect(Vote.removeVote).toBeCalledTimes(1);
    expect(Comment.decrementUpvotes).toBeCalledWith(2, trxMock);
    expect(Comment.decrementUpvotes).toBeCalledTimes(1);
    expect(trxMock.commit).toBeCalledTimes(1);
    expect(trxMock.rollback).toBeCalledTimes(0);

  });

});

