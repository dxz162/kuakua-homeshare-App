const express = require("express");
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const path = require('path');
//express app
const app = express();

//passport config
require('./config/passport')(passport);

const TWO_HOURS = 1000*60*60*2;

const {
  PORT = 3000,
  NODE_ENV = 'development',

  SESS_NAME = 'sid', 
  SESS_SECRET = 'undertalestan',
  SESS_LIFETIME = TWO_HOURS
} = process.env;

const IN_PROD = NODE_ENV === 'production';

// db config
const dbURI = require('./config/keys').dbURI2;

// middlewhere
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect("/login");
}

//connect to mongodb
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(PORT, console.log('Server started on port ' + PORT)))
  .catch((err) => console.log(err));

//register view engine
app.set('view engine', 'ejs');

//让public文件夹变成直接能访问
app.use(express.static('public'));

//bodyparser
app.use(express.urlencoded({extended: true}));

//express session
app.use(session({
  name:SESS_NAME,
  secret: SESS_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ 
    mongooseConnection: mongoose.connection,
    collection: 'sessions'
  }),
  cookie: {
    maxAge: SESS_LIFETIME,
    sameSite: true,
    secure: IN_PROD
  }
}))

app.use(passport.initialize());
app.use(passport.session());

// make currentUser available to all pages --9.12 April
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

//connect flash
app.use(flash());

//global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next();
})

// route to properties
app.use("/properties", require("./routes/properties"));

//route to my, edit
app.use('/my', require('./routes/user'));

// route to index, login and register
app.use('/', require('./routes/index'));







