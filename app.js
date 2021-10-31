const express = require('express');
const expressSession = require('express-session');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const app = express();
const cookieParser = require('cookie-parser');

require('dotenv').config();
const port = process.env.PORT || 3000;

mongoose.connect('mongodb://127.0.0.1:27017/auth-javascript');

app.listen(port, () => {
  console.log(`Server run at http://127.0.0.1:${port}`);
});

//Middleware setup
app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.use(express.static(__dirname + '/public'));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
  })
);
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(function (req, res, next) {
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});

//use passport
app.use(passport.initialize());
app.use(passport.session());

//Call router users
const UserRouter = require('./routers/UserRoute');
app.use(UserRouter);
