const knex = require('../../../db/config');
const User = require('../../../models/User');
const userFixtures = require('../../user_fixtures');
const {
  UniqueViolationError
} = require('objection-db-errors');
const {
  NotFoundError,
  Model
} = require('objection');
Model.knex(knex);
// See seed file to see initial data
beforeAll(async () => {
  await knex.migrate.rollback();
  await knex.migrate.latest();
  await knex.seed.run({
      specific:'01_users.js'
  });
});

afterAll(async () => {
  await knex.migrate.rollback();
});

describe('User.fetchByUsername', () => {
  it('throws NotFoundError for non existing username', async () => {
    await expect(User.fetchByUsername('nonexistingusername')).rejects.toThrow(NotFoundError);
  });

  it('fetch preexisting user', async () => {
    const user = await User.fetchByUsername(userFixtures.rawData.testUser1.username);
    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe(userFixtures.rawData.testUser1.id);
    expect(user.username).toBe(userFixtures.rawData.testUser1.username);
    expect(user.password).toBe(userFixtures.rawData.testUser1.passwordHash);
  });
});

describe('User.insertAndFetchUser', () => {
  it('throws UniqueViolationError if duplicate username is inserted', async () => {
    await expect(User.insertAndFetchUser('test1','somepasshash')).rejects.toThrow(UniqueViolationError);
  });

  it('inserts and returns new User with new given username', async () => {
    const user = await User.insertAndFetchUser('newusername','passhash');
    expect(user).toBeInstanceOf(User);
    expect(user.password).toBe('passhash');
    expect(user.username).toBe('newusername');
    expect(user.id).toBeDefined();
    const queriedUser = await User.query().findOne({username: 'newusername'});
    expect(user.password).toBe(queriedUser.password);
    expect(user.username).toBe(queriedUser.username);
    expect(user.id).toBe(queriedUser.id);
  });
});
