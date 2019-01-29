const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const { ensureAuthenticated } = require('../helpers/auth')

// Load Idea model
require('../models/Idea')
const Idea = mongoose.model('ideas');
// We will route all requests to /ideas to this files routes
// That is why we dont need the '/ideas' in the routes

// Ideas Index Page
router.get('/', ensureAuthenticated, (req, res) => {
  // The Idea model is an interface into our mongoDB collection
  // Idea.find() returns a Promise so we can use .then()/.else()
  Idea.find({ user: req.user.id })
    .sort({ date: 'desc' })
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });
});

// Add Idea Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});

// Edit Idea Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then(idea => {
      if (idea.user !== req.user.id) {
        req.flash('error_msg', 'You are not authorized to edit this idea.');
        res.redirect('/vidjot/ideas');
      } else {
        res.render('ideas/edit', {
          idea: idea
        });
      }
    });
});

// Delete an idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.deleteOne({
    _id: req.params.id
  })
    .then(() => {
      req.flash('success_msg', 'Video Idea Removed');
      res.redirect('/vidjot/ideas');
    });
});

// Process Edit Idea Form
router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then(idea => {
      idea.title = req.body.title;
      idea.details = req.body.details;
      idea.save()
        .then(idea => {
          req.flash('success_msg', 'Video Idea Updated');
          res.redirect('/vidjot/ideas');
        });
    });
});

// Process Add Idea Form
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({ text: 'Please add a title.' });
  }
  if (!req.body.details) {
    errors.push({ text: 'Please add details.' });
  }
  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  }
  else {
    const newIdea = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    };
    new Idea(newIdea)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Video Idea Added');
        res.redirect('/vidjot/ideas');
      });
  }
});

router.get('*', function (req, res, next) {
  res.status(404).send('ERROR')
});

module.exports = router;