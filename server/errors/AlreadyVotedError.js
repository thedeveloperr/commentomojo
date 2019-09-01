const AppError = require('./AppError');
class AlreadyVotedError extends AppError {
  constructor(message) {
    super(message || 'Not Found. Invalid Voter or Comment.', 409);
  }
}
module.exports = AlreadyVotedError;
