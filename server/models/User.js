'use strict';

const { BaseModel } = require('./BaseModel');

class User extends BaseModel {
  static get tableName(){
    return 'users';
  }
  static fetchByUsername(username) {
    return super.query().findOne({username}).throwIfNotFound();
  }
  static insertAndFetchUser(username, passwordHash) {
    return super.query().insertAndFetch({ username, password: passwordHash });
  }
}

module.exports = User;
