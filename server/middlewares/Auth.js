const UserService = require('../services/user.service');

const passport = require('passport');
exports.init = passport.initialize();
exports.session = passport.session();

const LocalStrategy = require('passport-local').Strategy;

exports._strategy = async (username, password, done) => {
  try {
    const user = await UserService.authenticateAndGetUser(username,password);
    done(null, user);
  }
  catch (err) {
    done(err, null);
  }
}
exports._localStrategy = new LocalStrategy(exports._strategy);
passport.use(exports._localStrategy);
exports._deserializer = async (id, done) => {
  try {
    const user = await UserService.getUserFromId(id);
    done(null, user);
  }
  catch(err) {
    done(err);
  }
}

exports._serializer = (user, done) => {
  if (user.id) done(null, user.id);
  else done(new Error("User ID is undefined"));
}

passport.serializeUser(exports._serializer);

passport.deserializeUser(exports._deserializer);

exports.passport = passport;

exports.authenticate = (req, res, next) =>{
  // authenticate calls custom callback with params passed to done() in Auth._strategy
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return res.status(err.status).json({
        status: err.status,
        message: err.message
    });
    req.logIn(user, (err) => {
      if (err) {
        console.error(err);
        return next(err);
      }
      return next();
    });
  })(req, res, next);
};

exports.isAuthenticated = (req, res, next) => {
  if (req.user)
    // req.user is available for use here
    return next();

  // denied. redirect to login
  return res.status(401).json({ status: 401, message: "Login/Register to continue." });
}
