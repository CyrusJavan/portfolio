const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')

// Load User model
require('../models/User')
const User = mongoose.model('users');

// User Login
router.get('/login', (req, res) => {
  res.render('users/login');
});

// User Registration
router.get('/register', (req, res) => {
  res.render('users/register');
});

// Login form post
router.post('/login', (req, res, next) => {
  // Authenticate with Passport using our local strategy
   passport.authenticate('local', {
     successRedirect: '/vidjot/ideas',
     failureRedirect: '/vidjot/users/login',
     failureFlash: true
   })(req, res, next);
});

// Register form post
router.post('/register', (req, res) => {
  let errors = [];
  // Server Side input validation
  if (req.body.password !== req.body.password2) {
    errors.push({ text: "Passwords do not match." });
  }
  if (req.body.password.length < 6) {
    errors.push({ text: "Password must be at least 6 characters." });
  }
  if (errors.length > 0) {
    // If there were invalid fields then show the register page again 
    // and refill the fields with whatever values they already had
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    // Check if user with email already exists
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          req.flash("error_msg","A user with this email already exists.");
          res.redirect('/vidjot/users/register');
        }
        else{
          const newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          };
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              new User(newUser)
                .save()
                .then((user) => {
                  req.flash('success_msg', 'You are now registered, please login.');
                  res.redirect('/vidjot/users/login');
                })
                .catch((err) => {
                  console.log(err);
                  return;
                })
            });
          });
        }
      });
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You have been logged out.');
  res.redirect('/vidjot/users/login')
});

router.get('*', function (req, res, next) {
  res.status(404).send('ERROR')
});

module.exports = router;