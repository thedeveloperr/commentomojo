const AppError = require('./AppError');
class UserNotFoundError extends AppError {
  constructor(message) {
    super(message || 'No User found.', 404);
  }
}
module.exports = UserNotFoundError;
