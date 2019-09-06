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
  static insertUpvote(parentPostId, parentCommentId, voterId, trx) {
    return super.query(trx).insert({ upvote: true, parentPostId, parentCommentId, voterId });
  }
  static insertDownvote(parentPostId, parentCommentId, voterId, trx) {
    return super.query(trx).insert({ upvote: false, parentPostId, parentCommentId, voterId },);
  }
  static getActiveVotes(parentPostId, voterId, lastCommentId, limit, trx) {
    return super.query(trx).where({parentPostId, voterId}).andWhere('parentCommentId','>',lastCommentId).limit(limit).orderBy('parentCommentId');
  }
  static removeVote(parentCommentId, voterId, trx) {
    return super.query(trx).delete().where({parentCommentId, voterId}).throwIfNotFound();
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
