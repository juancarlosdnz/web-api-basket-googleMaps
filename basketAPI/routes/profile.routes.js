const router = require('express').Router()

const User = require('./../models/User.model')
const Match = require('./../models/Match.model')

//LOAD PROFILE PAGE

router.get('/', (req, res, next) => {

    const loggedId = req.session.currentUser._id
    const isAdmin = req.session.currentUser.role === 'ADMIN'
    User
        .findById(loggedId)
        .then(user => {
            res.render('profile/profile', { user, isAdmin})
        })
        .catch(err => console.log(err))
})

//LOAD USER EDIT PAGE

router.get('/:id/edit', (req, res, next) => {

    const { id } = req.params
    User
        .findById(id)
        .then(user => {
            res.render('profile/edit', user)
        })
        .catch(err => console.log(err))
})

//EDIT USER

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

//DELETE USER

router.post('/:id/delete',(req, res, next) => {

    const { id } = req.params
    const isAdmin = req.session.currentUser.role === 'ADMIN'
    User
        .findByIdAndDelete(id)
        .then(() => {
            res.redirect('/')
        })

})

module.exports = router
