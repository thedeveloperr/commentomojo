const UserService = require('../../../services/user.service.js');
const UserNotFoundError = require('../../../errors/UserNotFoundError');
const InvalidCredentialsError = require('../../../errors/InvalidCredentialsError');
const UserAlreadyExistsError = require('../../../errors/UserAlreadyExistsError');
const User = require('../../../models/User');
const bcrypt = require('bcrypt');
const UserFixtures = require('../../user_fixtures');
const {
  UniqueViolationError
} = require('objection-db-errors');
const {
  NotFoundError
} = require('objection');


jest.mock('../../../models/User');
describe('UserService.signup', ()=>{
  it('returns UserAlreadyExistsError when signingup user with same username', async () =>{
    User.insertAndFetchUser.mockRejectedValue(new UniqueViolationError({ nativeError: new Error('native') }));
    const testUser = UserFixtures.rawData.testUser1;
    await expect(UserService.signup(testUser.username, testUser.password)).rejects.toThrow(UserAlreadyExistsError);
  });

  it('inserts and fetch new user but with pass hash hidden', async () => {
    const testUser = UserFixtures.rawData.testUser5;
    var interceptedPassHash = "";
    User.insertAndFetchUser.mockImplementationOnce(async (username,passhash)=>{
      interceptedPassHash = passhash;
      return {
        id: testUser.id,
        username,
        password: passhash
      };
    });
    const insertedUser = await UserService.signup(testUser.username, testUser.password);
    expect(User.insertAndFetchUser).toBeCalledWith(testUser.username, interceptedPassHash);
    bcrypt.compareSync(testUser.password, interceptedPassHash);
    expect(insertedUser.id).toBe(testUser.id);
    expect(insertedUser.username).toBe(testUser.username);
    expect(insertedUser.password).toBe("HIDDEN");
  });

});

describe('UserService.authenticateAndGetUser', ()=>{
  it('returns UserNotFoundError when trying to authenticate non existing user', async () =>{
    User.fetchByUsername.mockRejectedValue(new NotFoundError());
    const testUser = UserFixtures.rawData.testUser1;
    await expect(UserService.authenticateAndGetUser(testUser.username, testUser.password)).rejects.toThrow(UserNotFoundError);
  });

  it('return InvalidCredentialsError user when given invalid password', async () => {
    const testUser = UserFixtures.rawData.testUser5;
    expect(bcrypt.compareSync("wrongpassword", testUser.passwordHash)).not.toBe(true);
    User.fetchByUsername.mockImplementationOnce(async (username)=>{
      return {
        id: testUser.id,
        username,
        password: testUser.passwordHash
      };
    });
    await expect(UserService.authenticateAndGetUser(testUser.username, "wrongpassword"))
          .rejects.toThrow(InvalidCredentialsError);
  });


  it('return valid user when given valid credentials', async () => {
    const testUser = UserFixtures.rawData.testUser5;
    expect(bcrypt.compareSync(testUser.password, testUser.passwordHash)).toBe(true);
    User.fetchByUsername.mockImplementationOnce(async (username)=>{
      return {
        id: testUser.id,
        username,
        password: testUser.passwordHash
      };
    });
    const fetchedUser = await UserService.authenticateAndGetUser(testUser.username, testUser.password);
    expect(User.fetchByUsername).toBeCalledWith(testUser.username);
    expect(fetchedUser.id).toBe(testUser.id);
    expect(fetchedUser.username).toBe(testUser.username);
    expect(fetchedUser.password).toBe("HIDDEN");
  });

});
