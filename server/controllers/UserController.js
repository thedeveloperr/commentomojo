const UserService = require('../services/user.service');

exports.signup = async (req, res) => {
  const {username, password} = req.body.user;
  try {
    const user = await UserService.signup(username, password);
    return res.status(200).json({ status:200, data: {user} });
  }
  catch(err) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message
    });
  }
};

