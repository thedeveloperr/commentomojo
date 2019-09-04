const AppError = require('./AppError');
class CommenterNotFoundError extends AppError {
  constructor(message) {
    super(message || 'Commenter User Not Found. Invalid Commenter.', 404);
  }
}
module.exports = CommenterNotFoundError;
