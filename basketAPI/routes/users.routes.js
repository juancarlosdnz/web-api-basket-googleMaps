const router = require('express').Router()
const mongoose = require('mongoose');
const User = require('./../models/User.model')
const Comment = require('./../models/Comments.model')


const { isLoggedIn, isLoggedOut, checkRole } = require('../middleware/route-guard')


//GET ALL USERS
router.get('/', isLoggedOut, (req, res, next) => {

    User
        .find()
        .then(user => {
            res.render('users/users-list', { user })
        })
        .catch(err => console.log(err))
})


//GET USERS PROFILE
router.get('/:id', isLoggedOut, (req, res, next) => {

    const { id } = req.params
    const currentUserId = req.session.currentUser._id

    const userPromise = User.findById(id)
    const commentPromise = Comment.find({ user: id }).populate('author')
    Promise
        .all([userPromise, commentPromise])
        .then(([user, comments]) => {
            let isCurrentCommenter
            comments.forEach(element => {
                isCurrentCommenter= currentUserId ===element.author.id
            });
             
            res.render('users/profile', { user, comments, isCurrentCommenter })
        })
        .catch(err => console.log(err))
})

// COMMENT POST

router.post('/:id/comment', (req, res, next) => {

    const objectId = mongoose.Types.ObjectId(req.params);
    const {
        comment,
        user = objectId,
        author = req.session.currentUser._id
    } = req.body

    Comment
        .create({ comment, user, author })
        .then(() => {
            res.redirect('/users')
        })
        .catch(err => console.log(err))
})
//COMMENT DELETE

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
