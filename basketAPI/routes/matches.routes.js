const router = require('express').Router()

const User = require('./../models/User.model')
const Match = require('./../models/Match.model')
const { default: mongoose } = require('mongoose')

const { isLoggedOut,checkRole, isLoggedIn } = require("../middleware/route-guard")



// All matches list

router.get('/',isLoggedOut, (req, res, next) => {

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
        .populate('teamA')
        .populate('teamB')
        .then(match => {
            res.render('match/match-detail', match)
        })
        .catch(err => console.log(err))
})


// Create match

router.get('/create',isLoggedOut,checkRole('ORGANIZER') ,(req, res, next) => {
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
        .populate('teamA')
        .populate('teamB')
        .then(match => {
            res.render('match/match-edit', { match })

        })
        .catch(err => console.log(err))
})

// router.post('/match-details/:id/edit', (req, res, next) => {

// })

// Player joining a match

router.post('/match-details/:id/joinTeamA', (req, res, next) => {

    let { players } = req.body
    const { id } = req.params
    players = mongoose.Types.ObjectId(`${req.session.currentUser._id}`)

    Match
        .findById(id)
        .update({ $addToSet: { teamA:players } })
        .then(() => {
            res.redirect('/matches')
        })
        .catch(err => console.log(err))

})

router.post('/match-details/:id/joinTeamB', (req, res, next) => {

    let { players } = req.body
    const { id } = req.params
    players = mongoose.Types.ObjectId(`${req.session.currentUser._id}`)

    Match
        .findById(id)
        .update({ $addToSet: { teamB: players } })
        .then(() => {
            res.redirect('/matches')
        })
        .catch(err => console.log(err))

})


module.exports = router