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

