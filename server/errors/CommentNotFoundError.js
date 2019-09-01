const AppError = require('./AppError');
class CommentNotFoundError extends AppError {
  constructor(message) {
    super(message || 'Comment Not Found.', 404);
  }
}
module.exports = CommentNotFoundError;
