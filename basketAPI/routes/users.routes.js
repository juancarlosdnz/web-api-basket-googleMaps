const router = require('express').Router()

const User = require('./../models/User.model')
const Match = require('./../models/Match.model')

router.get('/', (req, res, next) => {

    User
        .find()
        .then(user => {
            res.render('users/users-list', { user })
        })
        .catch(err => console.log(err))
})
router.get('/:id', (req, res, next) => {

    const { id } = req.params
    User
        .findById(id)
        .then(user => {
            res.render('users/profile', { user })
        })
        .catch(err => console.log(err))
})

router.post('/:id/comment', (req, res, next) => {

    const { id } = req.params
    const {comments} = req.body
    User
        .findById(id)
        .update({ $push: { comments } })
        .then(user => {
            res.redirect('/users')
        })
        .catch(err => console.log(err))
})

module.exports = router
