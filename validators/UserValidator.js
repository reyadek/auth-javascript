const { body, check, validationResult } = require('express-validator');
const { UserModel } = require('../models/UserModel');

RegisterValidate = [
  body('email').custom(async (valEmail) => {
    const duplicate = await UserModel.findOne({ email: valEmail });
    if (duplicate) {
      throw new Error('email already exist!');
    }
    return true;
  }),
  check('name')
    .notEmpty()
    .withMessage('name can not be empty!')
    .bail()
    .isLength({ min: 4 })
    .withMessage('name minimum 4 characters required!')
    .bail(),
  check('email')
    .isEmail()
    .withMessage('invalid email address!')
    .notEmpty()
    .withMessage('email cant be empty!')
    .bail(),
  check('password')
    .isLength({ min: 6 })
    .withMessage('password minimal 6 characters!'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      let validationArr = errors.array().map((v, k) => {
        return `${v.msg}`;
      });

      req.session.sessionFlash = {
        type: 'alert-danger',
        message: validationArr,
        oldInput: req.body,
      };
      res.redirect('/register');
    } else {
      next();
    }
  },
];

module.exports = { RegisterValidate };
