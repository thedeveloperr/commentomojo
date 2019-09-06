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
    const {lastCommentId, limit} = req.query;
    const {parentPostId} = req.params;
    try {
      const data = {};
      let comments = await CommentService.getComments(parentPostId, lastCommentId, limit)

      // When loggedin
      if (req.user) {
        let votesByLoggedinUser = await CommentService.getActiveVotesComments(parentPostId, req.user.id, lastCommentId, limit);
        if (votesByLoggedinUser.length > 0)
        comments = CommentService.mergeCurrentUserCommentsVoteInfo(votesByLoggedinUser, comments);
        data.username = req.user.username;
      }
      data.comments = comments;
      return res.status(200).json({ status: 200, data });
    } catch (e) {
      return res.status(e.status).json({ status: e.status, message: e.message });
    }
}

exports.upvote = async (req, res) => {
    let {parentPostId, parentCommentId} = req.params;
    parentCommentId = parseInt(parentCommentId);
    parentPostId = parseInt(parentPostId);
    try {
      const comment = await CommentService.upvote(parentPostId, parentCommentId, req.user.id);
      return res.status(200).json({ status: 200, data: {comment}, message: "Vote Added!" });
    } catch (e) {
      return res.status(e.status).json({ status: e.status, message: e.message });
    }
}

exports.downvote = async (req, res) => {
    let {parentPostId, parentCommentId} = req.params;
    parentCommentId = parseInt(parentCommentId);
    parentPostId = parseInt(parentPostId);
    try {
      const comment = await CommentService.downvote(parentPostId, parentCommentId, req.user.id);
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


