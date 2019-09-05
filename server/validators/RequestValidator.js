exports.validateSignUpRequest = (req, res, next) => {
  const missingParams = [];
  if (!req.body.user) {
    missingParams.push('User details');
    return res.status(400).json({status: 400, message: `${missingParams.join()} param(s) missing.`});
  }
  if (!req.body.user.username) missingParams.push('username');
  if(!req.body.user.password) missingParams.push('password');
  if (missingParams.length > 0)
    return res.status(400).json({status: 400, message: `${missingParams.join()} param(s) missing.`});
  const notString = [];
  if (typeof req.body.user.username !== 'string' ) notString.push('username');
  if (typeof req.body.user.password !== 'string' ) notString.push('password');
  if (notString.length > 0)
    return res.status(400).json({status: 400, message: `${notString.join()} not string but expected to be.`});
  next();
};

exports.validateLoginRequest = (req, res, next) => {
  const missingParams = [];
  if (!req.body) {
    missingParams.push('POST');
    return res.status(400).json({status: 400, message: `${missingParams.join()} param(s) missing.`});
  }
  if (!req.body.username) missingParams.push('username');
  if(!req.body.password) missingParams.push('password');
  if (missingParams.length > 0)
    return res.status(400).json({status: 400, message: `${missingParams.join()} param(s) missing.`});
  const notString = [];
  if (typeof req.body.username !== 'string' ) notString.push('username');
  if (typeof req.body.password !== 'string' ) notString.push('password');
  if (notString.length > 0)
    return res.status(400).json({status: 400, message: `${notString.join()} not string but expected to be.`});
  next();
};

exports.validatePostCommentRequest = (req, res, next) => {
  const missingParams = [];
  if (!req.body) {
    missingParams.push('POST');
    return res.status(400).json({status: 400, message: `${missingParams.join()} param(s) missing.`});
  }

  if (!req.body.comment) {
    missingParams.push('Comment details');
    return res.status(400).json({status: 400, message: `${missingParams.join()} param(s) missing.`});
  }
  if(!req.body.comment.parentPostId) missingParams.push('parentPostId');
  if (!req.body.comment.text) missingParams.push('text');
  if (missingParams.length > 0)
    return res.status(400).json({status: 400, message: `${missingParams.join()} param(s) missing.`});
  if (typeof req.body.comment.parentPostId !== 'number' )
    return res.status(400).json({status: 400, message: `parentPostId is not numbers but we expect it to be.`});
  if (typeof req.body.comment.text !== 'string' )
    return res.status(400).json({status: 400, message: `text is not string but we expect it to be.`});
  next();

};

exports.validateGetCommentRequest = (req, res, next) => {
  if (!req.query) {
    return res.status(400).json({status: 400, message: `GET req params missing.`});
  }

  if (!req.query.parentPostId) {
    return res.status(400).json({status: 400, message: `parentPostId param is missing.`});
  }
  const notNumbers = [];
  if (isNaN(parseInt(req.query.parentPostId))) notNumbers.push('parentPostId');
  if (isNaN(parseInt(req.query.lastCommentId)) && req.query.lastCommentId !== undefined) notNumbers.push('lastCommentId');
  if (isNaN(parseInt(req.query.limit)) && req.query.limit !== undefined) notNumbers.push('limit');
  if (notNumbers.length > 0)
    return res.status(400).json({status: 400, message: `${notNumbers.join()} not number but expected to be.`});
  next();

}

