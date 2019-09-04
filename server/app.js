const express = require('express');
const bodyParser = require('body-parser');
const session = require("express-session");
const Auth = require('./middlewares/Auth');
const UserRoutes = require('./routes/UserRoutes');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: (()=>{
    if (process.env.NODE_ENV !== 'production')
      return 'testing_secret_dontuse_in_prod';
    try {
      return require('./secrets').session_secret;
    }
    catch(e) {
      console.error('secrets.js file needed for production. Create one that returns object with "session_secret" key.');
    }
  })(),
  resave: false,
  saveUninitialized: false,
}));
app.use(Auth.init);
app.use(Auth.session);
app.use('/user', UserRoutes);
module.exports = app;
