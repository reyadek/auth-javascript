const { UserModel } = require('../models/UserModel');
const bcrypt = require('bcrypt');

module.exports = {
  index: (req, res) => {
    // isLoggedIn;
    res.render('index', {
      title: 'home',
    });
  },

  formLogin: (req, res) => {
    res.render('login', {
      title: 'login user',
    });
  },

  storeLogin: (req, res) => {
    res.redirect('/');
  },

  logout: (req, res) => {
    req.logout();
    res.redirect('/');
  },

  formRegister: (req, res) => {
    res.render('register', {
      title: 'register user',
    });
  },

  storeRegister: async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      UserModel.create(
        {
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
        },
        (err, result) => {
          if (err) {
            console.log(err);
            res.redirect('/register');
          } else {
            console.log(result);
            res.redirect('/login');
          }
        }
      );
    } catch (error) {
      console.log(error);
      res.redirect('/register');
    }
  },
};
