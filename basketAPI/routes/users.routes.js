const router = require('express').Router()
const mongoose = require('mongoose');
const User = require('./../models/User.model')
const Comment = require('./../models/Comments.model')
const { isLoggedOut } = require('../middleware/route-guard')

router.get('/', isLoggedOut, (req, res, next) => {

    User
        .find()
        .then(user => {
            res.render('users/users-list', { user })
        })
        .catch(err => console.log(err))
})

router.get('/:id', isLoggedOut, (req, res, next) => {

    const { id } = req.params
    const currentUserId = req.session.currentUser._id
    const userPromise = User.findById(id)
    const commentPromise = Comment.find({ user: id }).populate('author')

    Promise
        .all([userPromise, commentPromise])
        .then(([user, comments]) => {
            res.render('users/profile', { user, comments })
        })
        .catch(err => console.log(err))
})

router.post('/:id/comment', (req, res, next) => {

    const objectId = mongoose.Types.ObjectId(req.params);
    const { comment, user = objectId, author = req.session.currentUser._id } = req.body

    Comment
        .create({ comment, user, author })
        .then(() => {
            res.redirect('/users')
        })
        .catch(err => console.log(err))
})

router.post('/:id/comment/:ide/delete', (req, res, next) => {

    const { ide } = req.params

    Comment
        .findByIdAndDelete(ide)
        .then(() => {
            res.redirect('/users')
        })
        .catch(err => console.log(err))
})

module.exports = router
