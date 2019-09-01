const AppError = require('./AppError');
class VoteNotFoundError extends AppError {
  constructor(message) {
    super(message || 'Not Found. Invalid Vote.', 404);
  }
}
module.exports = VoteNotFoundError;
