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

module.exports = router;
