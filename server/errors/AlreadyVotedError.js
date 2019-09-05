const AppError = require('./AppError');
class AlreadyVotedError extends AppError {
  constructor(message) {
    super(message || 'Already Voted Cannot vote twice on same comment.', 409);
  }
}
module.exports = AlreadyVotedError;
