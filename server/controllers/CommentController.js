const CommentService = require('../services/comment.service');
exports.postComment = async (req, res) => {
    const {parentPostId, text} = req.body.comment;
    try {
      const comment = await CommentService.insertComment(parentPostId, req.user.id, text);
      return res.status(200).json({ status: 200, data: {comment}, message: "Comment Added!" });
    } catch (e) {
      return res.status(e.status).json({ status: e.status, message: e.message });
    }
}

exports.showComments = async (req, res) => {
    const {parentPostId, lastCommentId, limit} = req.query;
    try {
      let comments = await CommentService.getComments(parentPostId, lastCommentId, limit)
      return res.status(200).json({ status: 200, data: {comments} });
    } catch (e) {
      return res.status(e.status).json({ status: e.status, message: e.message });
    }
}

exports.upvote = async (req, res) => {
    let {parentCommentId} = req.params;
    parentCommentId = parseInt(parentCommentId);
    try {
      const comment = await CommentService.upvote(parentCommentId, req.user.id);
      return res.status(200).json({ status: 200, data: {comment}, message: "Vote Added!" });
    } catch (e) {
      return res.status(e.status).json({ status: e.status, message: e.message });
    }
}

exports.downvote = async (req, res) => {
    const {parentCommentId} = req.params;
    try {
      const comment = await CommentService.downvote(parentCommentId, req.user.id);
      return res.status(200).json({ status: 200, data: {comment}, message: "Vote Added!" });
    } catch (e) {
      return res.status(e.status).json({ status: e.status, message: e.message });
    }
}

exports.removeDownvote = async (req, res) => {
    const {parentCommentId} = req.params;
    try {
      const comment = await CommentService.removeDownvote(parentCommentId, req.user.id);
      return res.status(200).json({ status: 200, data: {comment}, message: "Vote Removed!" });
    } catch (e) {
      return res.status(e.status).json({ status: e.status, message: e.message });
    }
}

exports.removeUpvote = async (req, res) => {
    const {parentCommentId} = req.params;
    try {
    const comment = await CommentService.removeUpvote(parentCommentId, req.user.id);
      return res.status(200).json({ status: 200, data: {comment}, message: "Vote Removed!" });
    } catch (e) {
      return res.status(e.status).json({ status: e.status, message: e.message });
    }
}


