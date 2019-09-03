'use strict';

const { BaseModel } = require('./BaseModel');

class User extends BaseModel {
  static get tableName(){
    return 'users';
  }
  static fetchById(id, trx) {
    return super.query(trx).findById(id).throwIfNotFound();
  }
  static fetchByUsername(username, trx) {
    return super.query(trx).findOne({username}).throwIfNotFound();
  }
  static insertAndFetchUser(username, passwordHash, trx) {
    return super.query(trx).insertAndFetch({ username, password: passwordHash }).throwIfNotFound();
  }
}

module.exports = User;
