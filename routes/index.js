const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {ensureAuthenticated} = require('../config/auth');

// User model
const User = require('../models/user');

// index
router.get('/', (req, res) => {
	console.log(req.user)
    res.render('landing', {currentUser: req.user});
});

// index
router.get('/box', (req, res) => {
    res.render('boxmodel');
});


// login
router.get('/login', (req, res) => {
    res.render('login');
});

// login handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/my',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// register
router.get('/register', (req, res) => {
    res.render('register');
});

// logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
})


//register handle
router.post('/register', (req, res) => {
    const { email, password, confirmPassword } = req.body;

    let errors = [];

    //check required fields
    if (!email || !password || !confirmPassword) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password != confirmPassword) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (errors.length > 0) {
        res.render('register', {
          errors,
          email,
          password,
          confirmPassword
        });
    } 
    else{
      //validation passed
      User.findOne({email:email})
        .then(user => {
          if(user) {
            //User exists
            errors.push({ msg: 'Email is already registered' });
            res.render('register', {
              errors,
              email,
              password,
              confirmPassword
            });
          }
          else{
            const newUser = new User({
              email,
              password
            })

            //Hash password
            bcrypt.genSalt(10, (err, salt) => 
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;
                // set password to hashed
                newUser.password = hash;
                //save user
                newUser.save()
                  .then(result => {
                    req.flash('success_msg', 'You are now registered and can log in');
                    res.redirect('/login');
                    })
                  .catch(err => {
                    console.log(err);
                  });
              }))
          }
        });
    }  
    
});

module.exports = router;