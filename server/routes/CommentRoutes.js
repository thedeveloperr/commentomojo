const express = require('express');
const CommentController = require('../controllers/CommentController');
const AuthMiddleware = require('../middlewares/Auth');
const ReqValidator = require('../validators/RequestValidator');
const router = express.Router();

router.post('/',
  AuthMiddleware.isAuthenticated,
  ReqValidator.validatePostCommentRequest,
  CommentController.postComment);
router.get('/',
  ReqValidator.validateGetCommentRequest,
  CommentController.showComments);
router.put('/:parentCommentId/upvote',
  AuthMiddleware.isAuthenticated,
  ReqValidator.validateVoteRequest,
  CommentController.upvote
);
router.put('/:parentCommentId/downvote',
  AuthMiddleware.isAuthenticated,
  ReqValidator.validateVoteRequest,
  CommentController.downvote
);
router.delete('/:parentCommentId/downvote',
  AuthMiddleware.isAuthenticated,
  ReqValidator.validateVoteRequest,
  CommentController.removeDownvote
);
router.delete('/:parentCommentId/upvote',
  AuthMiddleware.isAuthenticated,
  ReqValidator.validateVoteRequest,
  CommentController.removeUpvote
);

module.exports = router;
