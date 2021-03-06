const User = require('../models/User');
const UserNotFoundError = require('../errors/UserNotFoundError');
const InvalidCredentialsError = require('../errors/InvalidCredentialsError');
const UserAlreadyExistsError = require('../errors/UserAlreadyExistsError');
const AppError = require('../errors/AppError');
const {
  NotFoundError
} = require('objection');
const {
  UniqueViolationError,
} = require('objection-db-errors');
const bcrypt = require('bcrypt');
const saltNumber = 10;
exports.signup = async (username, password) => {
  try {
    const passwordHash = await bcrypt.hash(password, saltNumber);
    const insertedUser = await User.insertAndFetchUser(username, passwordHash);
    insertedUser.password = "HIDDEN";
    return insertedUser;
  } catch(err) {
    if (err instanceof UniqueViolationError) throw new UserAlreadyExistsError();
    console.error(err);
    throw new AppError();
  }
};
exports.getUserFromId = async (id) => {
  try {
    const user = await User.fetchById(id);
    user.password = "HIDDEN";
    return user;
  }
  catch {
    if(err instanceof NotFoundError) throw new UserNotFoundError();
    console.error(err);
    throw new AppError();
  }
};
exports.authenticateAndGetUser = async (username, password) => {
  try {
    var user = await User.fetchByUsername(username);
    var match = await bcrypt.compare(password, user.password);
  } catch(err) {
    if(err instanceof NotFoundError) throw new UserNotFoundError();
    console.error(err);
    throw new AppError();

  }
  if (!match) throw new InvalidCredentialsError();
  user.password = "HIDDEN";
  return user;

};
