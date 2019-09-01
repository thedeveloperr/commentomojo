const knex = require('../../../db/config');
const User = require('../../../models/User');
const userFixtures = require('../../user_fixtures');
const {
  UniqueViolationError
} = require('objection-db-errors');
const {
  NotFoundError,
  Model,
  transaction
} = require('objection');


describe('User.fetchByUsername', () => {
  it('throws NotFoundError for non existing username', async () => {
    const trx = await transaction.start(Model.knex());
    const spy = jest.spyOn(Model, 'query');
    await expect(User.fetchByUsername('nonexistingusername', trx)).rejects.toThrow(NotFoundError);
    expect(spy).toBeCalledWith(trx);
    spy.mockRestore();
    await trx.rollback();
  });

  it('fetch preexisting user', async () => {
    const trx = await transaction.start(Model.knex());
    const spy = jest.spyOn(Model, 'query');
    const user = await User.fetchByUsername(userFixtures.rawData.testUser1.username, trx);
    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe(userFixtures.rawData.testUser1.id);
    expect(user.username).toBe(userFixtures.rawData.testUser1.username);
    expect(user.password).toBe(userFixtures.rawData.testUser1.passwordHash);
    expect(spy).toBeCalledWith(trx);
    spy.mockRestore();
    await trx.rollback();
  });
});

describe('User.insertAndFetchUser', () => {
  it('throws UniqueViolationError if duplicate username is inserted', async () => {
    const trx = await transaction.start(Model.knex());
    const spy = jest.spyOn(Model, 'query');
    await expect(User.insertAndFetchUser('test1','somepasshash',trx)).rejects.toThrow(UniqueViolationError);
    expect(spy).toBeCalledWith(trx);
    spy.mockRestore();
    await trx.rollback();
  });

  it('inserts and returns new User with new given username', async () => {
     const spy = jest.spyOn(Model, 'query');

    const trx = await transaction.start(Model.knex());
    const user = await User.insertAndFetchUser('newusername','passhash',trx);
    expect(user).toBeInstanceOf(User);
    expect(user.password).toBe('passhash');
    expect(user.username).toBe('newusername');
    expect(user.id).toBeDefined();
    const queriedUser = await User.query(trx).findOne({username: 'newusername'});
    expect(user.password).toBe(queriedUser.password);
    expect(user.username).toBe(queriedUser.username);
    expect(user.id).toBe(queriedUser.id);
    expect(spy).toBeCalledWith(trx);
    spy.mockRestore();
    await trx.rollback();
  });
});
