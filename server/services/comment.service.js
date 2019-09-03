const Comment = require('../models/Comment');
const Vote = require('../models/Vote.js');
const CommentNotFoundError = require('../errors/CommentNotFoundError');
const VoteNotFoundError = require('../errors/VoteNotFoundError');
const AlreadyVotedError = require('../errors/AlreadyVotedError');
const VoterNotFoundError = require('../errors/VoterNotFoundError');
const SelfVoteError = require('../errors/SelfVoteError');
const AppError = require('../errors/AppError');
const {
  NotFoundError,
  transaction
} = require('objection');

const {
  DBError,
  UniqueViolationError,
  ForeignKeyViolationError
} = require('objection-db-errors');

// common voting error handling code
function handleVotingError(err){
  if (err instanceof UniqueViolationError) throw new AlreadyVotedError();
  if (err instanceof ForeignKeyViolationError) throw new VoterNotFoundError();
  if (err instanceof NotFoundError) throw new VoteNotFoundError();
  console.error(err);
  throw new AppError();
}

function handleCommentNotFound(err) {
  if (err instanceof NotFoundError) throw new CommentNotFoundError();
  console.error(err);
  throw new AppError();
}

exports.getComments = async (postId, lastCommentId, limit) =>{
  try {
    lastCommentId = lastCommentId || 0;
    limit = limit || 10;
    const comments = await Comment.getCommentsOnPost(postId, lastCommentId, limit);
    return comments;
  }
  catch (err) {
    handleCommentNotFound(err);
  }
};

exports.insertComment = async (postId, commenterId, text) => {
  try {
    const comment = await Comment.insertCommentOnPost(postId);
    return comment;
  }
  catch (err) {
    console.error(err);
    throw new AppError();
  }
};

exports.upvote = async (parentCommentId, voterId) => {
  let comment;
  try {
    comment = await Comment.fetchComment(parentCommentId);
  }
  catch(err) {
    handleCommentNotFound(err);
  }
  if (comment.commenterId == voterId) throw new SelfVoteError();
  const trx = await transaction.start(Vote.knex());
  try{
    const insertQuery = await Vote.insertUpvote(parentCommentId, voterId, trx);
    const updatedComment = await Comment.incrementUpvotes(parentCommentId, trx);
    await trx.commit();
    return updatedComment;
  } catch(err) {
    await trx.rollback();
    handleVotingError(err);
  }
};

exports.downvote = async (parentCommentId, voterId) => {
  let comment;
  try {
    comment = await Comment.fetchComment(parentCommentId);
  }
  catch(err) {
    handleCommentNotFound(err);
  }

  if (comment.commenterId == voterId) throw new SelfVoteError();
  const trx = await transaction.start(Vote.knex());
  try {
    const insertQuery = await Vote.insertDownvote(parentCommentId, voterId, trx);
    const updatedComment = await Comment.incrementDownvotes(parentCommentId, trx);
    await trx.commit();
    return updatedComment;
  } catch(err) {
    await trx.rollback();
    handleVotingError(err);
  }
};

exports.removeDownvote = async (parentCommentId, voterId) => {
  let comment;
  try {
    comment = await Comment.fetchComment(parentCommentId);
  }
  catch(err) {
    handleCommentNotFound(err);
  }
  const trx = await transaction.start(Vote.knex());
  try {
    const removedCount = await Vote.removeVote(parentCommentId, voterId, trx);
    const updatedComment = await Comment.decrementDownvotes(parentCommentId, trx);
    await trx.commit();
    return updatedComment;
  } catch(err) {
    await trx.rollback();
    handleVotingError(err);
  }
};

exports.removeUpvote = async (parentCommentId, voterId) => {
  let comment;
  try {
    comment = await Comment.fetchComment(parentCommentId);
  }
  catch(err) {
    handleCommentNotFound(err);
  }
  const trx = await transaction.start(Vote.knex());
  try {
    const removedCount = await Vote.removeVote(parentCommentId, voterId, trx);
    const updatedComment = await Comment.decrementUpvotes(parentCommentId, trx);
    await trx.commit();
    return updatedComment;
  } catch(err) {
    await trx.rollback();
    handleVotingError(err);
  }
};



