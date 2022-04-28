const router = require('express').Router()
const User = require('./../models/User.model')
const Match = require('./../models/Match.model')
const { isLoggedOut } = require('../middleware/route-guard')

router.get('/', isLoggedOut, (req, res, next) => {

    const { _id: loggedId } = req.session.currentUser
    const isAdmin = req.session.currentUser.role === 'ADMIN'

    User
        .findById(loggedId)
        .populate('myMatches')
        .then(user => {
            res.render('profile/profile', { user, isAdmin })
        })
        .catch(err => console.log(err))
})

router.get('/:id/edit', (req, res, next) => {

    const { id } = req.params

    User
        .findById(id)
        .then(user => {
            res.render('profile/edit', user)
        })
        .catch(err => console.log(err))
})

router.post('/:id/edit', (req, res, next) => {

    const { id } = req.params
    const { username, email, phoneNumber, profileImg } = req.body

    User
        .findByIdAndUpdate(id, req.body)
        .then(user => {
            res.redirect('/profile')
        })
        .catch(err => console.log(err))
})

router.post('/:id/delete', (req, res, next) => {

    const { id } = req.params
    const isAdmin = req.session.currentUser.role === 'ADMIN'

    User
        .findByIdAndDelete(id)
        .then(() => {
            res.redirect('/')
        })
        .catch(err => console.log(err))
})

module.exports = router
