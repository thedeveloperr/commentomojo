
const AppError = require('./AppError');
class VoterNotFoundError extends AppError {
  constructor(message) {
    super(message || 'Not Found. Invalid Voter or Comment.', 404);
  }
}
module.exports = VoterNotFoundError;
