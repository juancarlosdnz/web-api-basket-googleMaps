const router = require('express').Router()
const mongoose = require('mongoose');
const User = require('./../models/User.model')
const Comment = require('./../models/Comments.model')
const { isLoggedOut } = require('../middleware/route-guard')

router.get('/', isLoggedOut, (req, res, next) => {

    const isAdmin = req.session.currentUser.role === 'ADMIN'


    User
        .find()
        .then(user => {
            res.render('users/users-list', { user, isAdmin })
        })
        .catch(err => console.log(err))
})

router.get('/:id', isLoggedOut, (req, res, next) => {

    const { id } = req.params

    const userPromise = User.findById(id)
    const commentPromise = Comment.find({ user: id }).populate('author')

    Promise
        .all([userPromise, commentPromise])
        .then(([user, comments]) => {
            if (req.session.currentUser._id === id) {
                res.redirect('/profile')
            } else {
                res.render('users/profile', { user, comments })
            }
        })
        .catch(err => console.log(err))
})

router.post('/:id/delete', (req, res, next) => {

    const { id } = req.params

    User
        .findByIdAndDelete(id)
        .then(() => {
            res.redirect('/users')
        })
        .catch(err => console.log(err))
})




router.post('/:id/comment', (req, res, next) => {

    const objectId = mongoose.Types.ObjectId(req.params);
    const { comment, user = objectId, author = req.session.currentUser._id } = req.body

    Comment
        .create({ comment, user, author })
        .then(() => {
            res.redirect(`/users/${objectId}`)
        })
        .catch(err => console.log(err))
})

router.post('/:id/comment/:ide/delete', (req, res, next) => {

    const { ide } = req.params
    const { id } = req.params

    Comment
        .findByIdAndDelete(ide)
        .then(() => {
            res.redirect(`/users/${id}`)
        })
        .catch(err => console.log(err))
})

module.exports = router
