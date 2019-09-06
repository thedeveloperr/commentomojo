const express = require('express');
const UserController = require('../controllers/UserController');
const AuthMiddleware = require('../middlewares/Auth');
const ReqValidator = require('../validators/RequestValidator');
const router = express.Router();

router.post('/user/signup', ReqValidator.validateSignUpRequest, UserController.signup);
router.post('/user/login', ReqValidator.validateLoginRequest, AuthMiddleware.authenticate, (req, res)=>{
  res.status(200).json({status:200, message:"Successfully Loggedin !"});
});
router.delete('/user/session', AuthMiddleware.isAuthenticated, (req, res)=>{
  req.logout();
  res.status(200).json({status:200, message:"Successfully Logged out !"});
});
module.exports = router;
