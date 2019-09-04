const express = require('express');
const UserController = require('../controllers/UserController');
const AuthMiddleware = require('../middlewares/Auth');
const ReqValidator = require('../validators/RequestValidator');
const router = express.Router();

router.post('/signup', ReqValidator.validateSignUpRequest, UserController.signup);
router.post('/login', ReqValidator.validateLoginRequest, AuthMiddleware.authenticate, (req, res)=>{
  res.status(200).json({status:200, message:"Successfully Loggedin !"});
});
module.exports = router;
