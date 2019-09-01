'use strict';

const { BaseModel } = require('./BaseModel');
const Comment = require('./Comment');
const User = require('./User');
class Vote extends BaseModel {
  static get tableName(){
    return 'votes';
  }
  static get idColumn() {
    return ['parentCommentId', 'voterId'];
  }
  static insertUpvote(parentCommentId, voterId, trx) {
    return super.query(trx).insert({ upvote: true, parentCommentId, voterId });
  }
  static insertDownvote(parentCommentId, voterId, trx) {
    return super.query(trx).insert({ upvote: false, parentCommentId, voterId },);
  }
  static removeVote(parentCommentId, voterId, trx) {
    return super.query(trx).delete().where({parentCommentId, voterId }).throwIfNotFound();
  }
  static get relationMappings () {
   return {
      voter: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'votes.voterId',
          to: 'users.id'
        }
      },
      parentComment: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Comment,
        join: {
          from: 'votes.parentCommentId',
          to: 'comments.id'
        }
      }
    };
  }
}

module.exports = Vote;
