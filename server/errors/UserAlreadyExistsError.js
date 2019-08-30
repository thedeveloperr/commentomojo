
const AppError = require('./AppError');
class UserAlreadyExistsError extends AppError {
  constructor(message) {
    super(message || 'User with same information already exists.', 409);
  }
}
module.exports = UserAlreadyExistsError;
