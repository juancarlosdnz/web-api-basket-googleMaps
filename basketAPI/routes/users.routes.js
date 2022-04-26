const router = require('express').Router()
const mongoose = require('mongoose');
const User = require('./../models/User.model')

const { isLoggedIn,isLoggedOut, checkRole } = require('../middleware/route-guard')


//GET ALL USERS
router.get('/', isLoggedOut,(req, res, next) => {

    User
        .find()
        .then(user => {
            res.render('users/users-list', { user })
        })
        .catch(err => console.log(err))
})


//GET USERS PROFILE
router.get('/:id', isLoggedOut, (req, res, next) => {
    let data = {}
    const { id } = req.params
    User
        .findById(id)
        .populate('comments')
        .then(user => {
            res.render('users/profile',user)
        })
        .catch(err => console.log(err))
})

//COMMENT POST

// router.post('/:id/comment', (req, res, next) => {

//     const objectId = mongoose.Types.ObjectId(req.params);
//     const {
//         comment,
//         owner = objectId,
//     } = req.body

//     Comment
//         .create({ comment, owner })
//         .then(() => {
//             res.redirect('/users')
//         })
//         .catch(err => console.log(err))
// })

module.exports = router
