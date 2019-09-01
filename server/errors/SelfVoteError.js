const AppError = require('./AppError');
class SelfVoteError extends AppError {
  constructor(message) {
    super(message || 'Cannot Vote your own comment.', 409);
  }
}
module.exports = SelfVoteError;
