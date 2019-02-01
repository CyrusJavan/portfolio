const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth')

// Bring in the collections
const Story = mongoose.model('stories')
const User = mongoose.model('users-story')

// Stories index
// Display all public stories
router.get('/', (req, res) => {
  Story.find({ status: 'public' })
    .populate('user')
    .sort({date:'desc'})
    .then(stories => {
      res.render('stories/index', {
        stories: stories
      })
    })
})

// Add story form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add')
})

// SHow one story
router.get('/show/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
    .populate('user')
    .populate('comments.commentUser')
    .then(story => {
      if (story.status == 'public'){
        res.render('stories/show', {
          story: story
        })
      }
      else{
        if (req.user && story.user._id == req.user.id){
          res.render('stories/show', {
            story: story
          })
        }else{
          res.redirect('/storybooks/stories')
        }
      }
    })
    .catch(() => {
      res.redirect('/storybooks/stories')
    })
})

// List stories from a single user
router.get('/user/:userId', (req, res) => {
  Story.find({user: req.params.userId, status: 'public'})
    .populate('user')
    .sort({date:'desc'})
    .then(stories => {
      res.render('stories/index', {stories:stories})
    })
})

// List current user stories
router.get('/my', ensureAuthenticated, (req, res) => {
  Story.find({user: req.user.id})
    .populate('user')
    .sort({date:'desc'})
    .then(stories => {
      res.render('stories/index', {stories:stories})
    })
})


// Edit form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
    .then(story => {
      if (story.user != req.user.id){
        res.redirect('/storybooks/stories')
      } else {
      res.render('stories/edit', {
        story: story
      })
      }
    })
    .catch(() => {
      res.redirect('/storybooks')
    })
})

// Process add story form 
router.post('/', (req, res) => {
  let allowComments

  if (req.body.allowComments) {
    allowComments = true
  }
  else {
    allowComments = false
  }

  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user.id
  }

  new Story(newStory)
    .save()
    .then(story => {
      res.redirect(`/storybooks/stories/show/${story._id}`)
    })
})

// Process Edit Form
router.put('/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
    .then(story => {
      let allowComments

      if (req.body.allowComments) {
        allowComments = true
      }
      else {
        allowComments = false
      }

      // Updated Values
      story.title = req.body.title
      story.body = req.body.body
      story.status = req.body.status
      story.allowComments = allowComments

      story.save()
        .then(story => {
          res.redirect('/storybooks/dashboard')
        })
    })
    .catch(() => {
      res.redirect('/storybooks')
    })
})

router.delete('/:id', ensureAuthenticated, (req, res) => {
  // Story.findByIdAndDelete({
  //   _id: req.params.id
  // })
  //   .then(() => {
  //     res.redirect('/storybooks/dashboard')
  //   })
  // Find the story, then verify this user has permission to delete it
  Story.findOne({
    _id: req.params.id
  })
    .populate('user')
    .then(story => {
      // Not Authenticated
      if (story.user.id != req.user.id){
        res.redirect('/storybooks/dashboard')
      }
      // Is authenticated, delete story
      else{
        story.delete(() => {
          res.redirect('/storybooks/dashboard')
        })
      }
    })
})

//Process Add comment 
router.post('/comment/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
    .then(story => {
      const newComment = {
        commentBody: req.body.commentBody,
        commentUser: req.user.id
      }
      //Add new comment on this story's comment array
      // Unshift adds to the beginning of the array
      // Push    adds to the    end    of the aray
      story.comments.unshift(newComment)

      story.save()
        .then(story => {
          res.redirect(`/storybooks/stories/show/${story._id}`)
        })
    })
})

module.exports = router;