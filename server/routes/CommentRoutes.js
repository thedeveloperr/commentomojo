const express = require('express');
const CommentController = require('../controllers/CommentController');
const AuthMiddleware = require('../middlewares/Auth');
const ReqValidator = require('../validators/RequestValidator');
const router = express.Router();

router.post('/:parentPostId/comments',
  AuthMiddleware.isAuthenticated,
  ReqValidator.validatePostCommentRequest,
  CommentController.postComment);
router.get('/:parentPostId/comments',
  ReqValidator.validateGetCommentRequest,
  CommentController.showComments);
router.put('/:parentPostId/comments/:parentCommentId/upvote',
  AuthMiddleware.isAuthenticated,
  ReqValidator.validateVoteRequest,
  CommentController.upvote
);
router.put('/:parentPostId/comments/:parentCommentId/downvote',
  AuthMiddleware.isAuthenticated,
  ReqValidator.validateVoteRequest,
  CommentController.downvote
);
router.delete('/:parentPostId/comments/:parentCommentId/downvote',
  AuthMiddleware.isAuthenticated,
  ReqValidator.validateVoteRequest,
  CommentController.removeDownvote
);
router.delete('/:parentPostId/comments/:parentCommentId/upvote',
  AuthMiddleware.isAuthenticated,
  ReqValidator.validateVoteRequest,
  CommentController.removeUpvote
);

module.exports = router;
