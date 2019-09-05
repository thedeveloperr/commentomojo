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


