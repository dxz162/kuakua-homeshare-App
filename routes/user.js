const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {ensureAuthenticated} = require('../config/auth');

//User model
const User = require('../models/user');

//Info model
const Info = require('../models/info');

//my
router.get('/', ensureAuthenticated, (req, res) => {
  res.render('my/my', {
    email: req.user.email
  });
});

//logout handle
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
})


// my/edit
router.get('/edit', ensureAuthenticated, (req, res) => {
  res.render('my/edit', {
    email: req.user.email
  });
});


//edit handle
router.post('/edit', (req, res) => {
  const { password, confirmPassword } = req.body;

  let errors = [];

  //check required fields
  if (!password || !confirmPassword) {
      errors.push({ msg: 'Please enter all fields' });
  }

  if (password != confirmPassword) {
      errors.push({ msg: 'Password does not match' });
  }

  if (errors.length > 0) {
      res.render('my/edit', {
        errors,
        password,
        confirmPassword,
        email: req.user.email
      });
  } 
  else{
    
    //Hash password
    bcrypt.genSalt(10, (err, salt) => 
      bcrypt.hash(password, salt, (err, hash) => {
        if(err) throw err;
        // set password to hashed
        const passwordHashed = hash;
        //edit user
        User.findOneAndUpdate({email:req.user.email}, {password:passwordHashed})
          .then(result => {
            req.flash('success_msg', 'You successfully changed your password');
            res.redirect('my');
          })
          .catch(err => {
            console.log(err);
          });
      }))
  }  
  
});

//info
// router.get('/info', ensureAuthenticated, (req, res) => {
//   res.render('my/info', {
//     email: req.user.email
//   });
// });

//info
router.get('/info', ensureAuthenticated, (req, res) => {

  Info.findOne({email:req.user.email})
        .then(info => {
          if(info) {
            res.render('my/info', {
              email: info.email,
              name: info.name,
              phone: info.phone,
              age: info.age,
              sex: info.sex,
              address: info.address
            });
          }
          else{
            res.render('my/info', {
              email: req.user.email,
              name: "",
              phone: "",
              age: "",
              sex: "",
              address: ""
            });
          }
        });
  
});

router.get('/info2', ensureAuthenticated, (req, res) => {

  Info.findOne({email:req.user.email})
        .then(info => {
          if(info) {
            res.render('my/info2', {
              email: info.email,
              name: info.name,
              phone: info.phone,
              age: info.age,
              address: info.address,
            });
          }
          else{
            res.render('my/info2', {
              email: req.user.email,
              name: "",
              phone: "",
              age: "",
              address: "",
            });
          }
        });
});

//info2 handle
router.post('/info2', (req, res, next) => {
  const { name, phone, age, sex, address } = req.body;

    let errors = [];

    //check required fields
    if (!name || !phone || !age || !sex || !address) {
        errors.push({ msg: 'Please enter all fields' });
    }
    else if (phone.length != 11) {
        errors.push({ msg: 'Wrong phone number' });
    }

    if (errors.length > 0) {
        res.render('my/info2', {
          errors,
          name, 
          phone, 
          age, 
          sex, 
          address
        });
    } 
    else{

      Info.findOne({email:req.user.email})
        .then(info => {
          if(!info) {
            const email = req.user.email;
            const newInfo = new Info({
              email,
              name, 
              phone, 
              age, 
              sex, 
              address
            })

            newInfo.save()
                  .then(result => {
                    req.flash('success_msg', 'You successfully updated your information');
                    res.redirect('/my/info');
                    })
                  .catch(err => {
                    console.log(err);
                  });
          }
          else{
            Info.findOneAndUpdate({email:req.user.email}, {
                  name: name,
                  phone: phone,
                  age: age,
                  sex: sex,
                  address: address,
            })
            .then(result => {
              req.flash('success_msg', 'You successfully edit your personal information');
              res.redirect('/my/info');
            })
            .catch(err => {
              console.log(err);
            });
          }
        });
    }  
});


module.exports = router;