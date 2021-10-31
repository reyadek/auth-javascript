const express = require('express');
const UserRoute = express.Router();
const bcrypt = require('bcrypt');
const { RegisterValidate } = require('../validators/UserValidator');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const { UserModel } = require('../models/UserModel');
const UserController = require('../controllers/UserController');

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  UserModel.findById(id, (err, user) => {
    done(err, user);
  });
});

//Use local strategy
passport.use(
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
      session: true,
    },
    (req, username, password, done) => {
      UserModel.findOne({ email: username }, (err, user) => {
        if (err) return done(err);
        if (!user)
          return done(
            null,
            false,
            (req.session.sessionFlash = {
              type: 'alert-danger',
              message: ['email not exist!'],
              oldInput: req.body,
            })
          );
        bcrypt.compare(password, user.password, (err, res) => {
          if (err) return done(err);
          if (res === false) {
            return done(
              null,
              false,
              (req.session.sessionFlash = {
                type: 'alert-danger',
                message: ['wrong password!'],
                oldInput: req.body,
              })
            );
          }
          return done(null, user);
        });
      });
    }
  )
);

//Middleware check login
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    //check user if login
    res.locals.login = req.isAuthenticated();
    return next();
  }
  res.redirect('/login');
};
const isLoggedOut = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

UserRoute.get('/register', isLoggedOut, UserController.formRegister);
UserRoute.post('/register', RegisterValidate, UserController.storeRegister);

UserRoute.get('/', isLoggedIn, UserController.index);
UserRoute.get('/login', isLoggedOut, UserController.formLogin);
UserRoute.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  }),
  UserController.storeLogin
);
UserRoute.get('/logout', UserController.logout);

module.exports = UserRoute;
