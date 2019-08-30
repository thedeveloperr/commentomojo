const AppError = require('./AppError');
class InvalidCredentialsError extends AppError {
  constructor(message) {
    super(message || 'Invalid Credentials. Username and Password dont match', 401);
  }
}
module.exports = InvalidCredentialsError;
