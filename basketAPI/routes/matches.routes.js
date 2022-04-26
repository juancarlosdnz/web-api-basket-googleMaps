const router = require('express').Router()

const User = require('./../models/User.model')
const Match = require('./../models/Match.model')
const { default: mongoose } = require('mongoose')


// All matches list

router.get('/', (req, res, next) => {

    Match
        .find()
        .then(matches => {
            res.render('match/match-list', { matches })
        })
        .catch(err => console.log(err))
})

// Match detail

router.get('/match-details/:id', (req, res, next) => {

    const { id } = req.params

    Match
        .findById(id)
        .populate('players')
        .then(match => {
            res.render('match/match-detail', match)
        })
        .catch(err => console.log(err))
})


// Create match

router.get('/create', (req, res, next) => {
    res.render('match/match-create')
})

router.post('/create', (req, res, next) => {

    const { organizer = req.session.currentUser._id, startTime, endTime, players, winner, opened, lat, lng } = req.body
    const location = {
        type: 'Point',
        coordinates: [lat, lng]
    }

    Match
        .create({ organizer, startTime, endTime, players, winner, opened, location })
        .then(() => {
            res.redirect('/')
        })
        .catch(err => console.log(err))
})


// Delete match

router.post('/match-details/:id/delete', (req, res, next) => {

    const { id } = req.params

    Match
        .findByIdAndDelete(id)
        .then(() => {
            res.redirect('/matches')
        })
        .catch(err => console.log(err))
})

// Update match

router.get('/match-details/:id/edit', (req, res, next) => {

    const { id } = req.params

    Match
        .findById(id)
        .populate('players')
        .then(match => {
            res.render('match/match-edit', { match })

        })
        .catch(err => console.log(err))
})

// router.post('/match-details/:id/edit', (req, res, next) => {

// })

// Player joining a match

router.post('match-details/:id/join', (req, res, next) => {

    const { players } = req.body
    const { id } = req.params
    // players = Mongoose.Types.ObjectId(`${req.session.currentUser._id}`)

    Match
        .findById(id)
        .update({ $push: { players } })
        .then(() => {
            res.redirect('/matches/match-details/:id')
        })
})


module.exports = router