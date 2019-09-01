'use strict';

const { raw } = require('objection');
const { BaseModel } = require('./BaseModel');
const User = require('./User');

class Comment extends BaseModel {
  static get tableName(){
    return 'comments';
  }
  static fetchComment(id, trx) {
     return super.query(trx).fetchById(id).throwIfNotFound();
  }
  static getCommentsOnPost(postId, trx) {
    return super.query(trx).where('parentPostId', postId).throwIfNotFound();
  }
  static insertCommentOnPost(parentPostId, commenterId, text, trx) {
    return super.query(trx).insertAndFetch({ parentPostId, commenterId, text });
  }
  static incrementUpvotes(commentId, trx) {
    return super.query(trx).patchAndFetchById(commentId, { upvotes: raw('upvotes + 1') }).throwIfNotFound();
  }
  static decrementUpvotes(commentId, trx) {
    return super.query(trx).patchAndFetchById(commentId, { upvotes: raw('upvotes - 1') }).throwIfNotFound();
  }
  static incrementDownvotes(commentId, trx) {
    return super.query(trx).patchAndFetchById(commentId, { downvotes: raw('downvotes + 1')}).throwIfNotFound();
  }
  static decrementDownvotes(commentId, trx) {
    return super.query(trx).patchAndFetchById(commentId, { downvotes: raw('downvotes - 1')}).throwIfNotFound();
  }
  static get relationMappings() {
    return {
      commenter: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'comments.commenterId',
          to: 'users.id'
        }
      }
    };
  }
}


module.exports = Comment;



