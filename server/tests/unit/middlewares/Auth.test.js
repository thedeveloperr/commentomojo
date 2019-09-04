const UserService = require('../../../services/user.service');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const InvalidCredentialsError = require('../../../errors/InvalidCredentialsError');
const UserNotFoundError = require('../../../errors/UserNotFoundError');
jest.mock('passport');
jest.mock('passport-local');
jest.mock('../../../services/user.service');
const Auth = require('../../../middlewares/Auth');

afterEach(()=>{
  jest.clearAllMocks()
});
test('passportjs dependency initializes and setup properly', ()=>{
  expect(passport.initialize).toBeCalledTimes(1);
  expect(passport.session).toBeCalledTimes(1);
  LocalStrategy.mockReturnValue(function MockLocalStrategy(){})
  expect(LocalStrategy).toBeCalledWith(Auth._strategy);
  expect(passport.use).toBeCalledWith(Auth._localStrategy);
  expect(passport.serializeUser).toBeCalledWith(Auth._serializer);
  expect(passport.deserializeUser).toBeCalledWith(Auth._deserializer);
  expect(Auth.passport).toBe(passport);
});

describe('Auth._deserializer', () =>{
  test('When user successfully fetched', (finish) => {
    const mockUser = {id: 1, username: "test", passpord: "HIDDEN"};
    UserService.getUserFromId.mockResolvedValue(mockUser);
    const done = (err, user) => {
      expect(err).toBe(null);
      expect(user).toBe(mockUser);
      finish();
    };
    Auth._deserializer(1,done);
  });
  test('when user fetching causes error', (finish)=> {
    const errMock = new Error();
    UserService.getUserFromId.mockRejectedValue(errMock);
    const done = (err, user) => {
      expect(err).toBe(errMock);
      expect(user).toBe(undefined);
      finish();
    };
    Auth._deserializer(1,done);
  });
});

describe('Auth._serializer', () =>{
  test('When user id is missing', (finish) => {
    const mockUser = {};
    const done = (err, id) => {
      expect(err).toBeInstanceOf(Error);
      expect(id).toBe(undefined);
      finish();
    };
    Auth._serializer(mockUser,done);
  });
  test('when user fetching causes error', (finish)=> {
    const mockUser = {id:1, username:"test"};
    const done = (err, id) => {
      expect(err).toBe(null);
      expect(id).toBe(1);
      finish();
    };
    Auth._serializer(mockUser,done);
  });
});
describe('Auth._strategy', () =>{
  test('When user is authenticated by service', (finish) => {
    const mockUser = {};
    UserService.authenticateAndGetUser.mockResolvedValue(mockUser);
    const done = (err, user) => {
      expect(err).toBe(null);
      expect(user).toBe(mockUser);
      finish();
    };
    Auth._strategy('username', 'password', done);
    expect(UserService.authenticateAndGetUser).toBeCalledWith('username', 'password');
  });
  test('when user authentication causes InvalidCredentialsError', (finish)=> {
    const errMock = new InvalidCredentialsError();
    UserService.authenticateAndGetUser.mockRejectedValue(errMock);
    const done = (err, user) => {
      expect(err).toBe(errMock);
      expect(user).toBe(null);
      finish();
    };
     Auth._strategy('username', 'password', done);
    expect(UserService.authenticateAndGetUser).toBeCalledWith('username', 'password');
  });
  test('when user authentication causes UserNotFoundError', (finish)=> {
    const errorMock = new UserNotFoundError();
    UserService.authenticateAndGetUser.mockRejectedValue(errorMock);
    const done = (err, user) => {
      expect(err).toBe(errorMock);
      expect(user).toBe(null);
      finish();
    };
     Auth._strategy('username', 'password', done);
    expect(UserService.authenticateAndGetUser).toBeCalledWith('username', 'password');
  });

});
describe ('Auth.isAuthenticated ', ()=>{
    test('when not authenticated',()=> {
      const res = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn((obj) => {
        expect(obj).toEqual({ status: 401, message: "Login/Register to continue." });
      });
      const next = jest.fn();
      const req =  { user: null };
      Auth.isAuthenticated(req, res, next);
      expect(next).toBeCalledTimes(0);
      expect(res.status).nthCalledWith(1, 401);
      expect(res.json).toBeCalledTimes(1);
  });
  test('when user authenticated',()=> {
      const res = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn((obj) => {
        expect(obj).toEqual({ status: 401, message: "Login/Register to continue." });
        return res;
      });
      const next = jest.fn();
      const req =  { user: {id: 1, username: "test"} };
      Auth.isAuthenticated(req, res, next);
      expect(next).toBeCalledTimes(1);
      expect(res.status).toBeCalledTimes(0);
      expect(res.json).toBeCalledTimes(0);
  });

});
