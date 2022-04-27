const router = require('express').Router()
const User = require('./../models/User.model')
const Match = require('./../models/Match.model')
const { isLoggedOut, checkRole } = require("../middleware/route-guard")
const formatDate = require('./../utils/formatDate')

router.get('/', isLoggedOut, (req, res, next) => {

    Match
        .find()
        .then(matches => {
            res.render('match/match-list', { matches })
        })
        .catch(err => console.log(err))
})

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

router.get('/create', isLoggedOut, checkRole('ORGANIZER'), (req, res, next) => {
    res.render('match/match-create')
})

router.post('/create', (req, res, next) => {

    const { organizer = req.session.currentUser._id, startTime, endTime, players, winner, opened, lat, lng } = req.body
    const location = { type: 'Point', coordinates: [lat, lng] }

    Match
        .create({ organizer, startTime, endTime, players, winner, opened, location })
        .then(() => {
            res.redirect('/')
        })
        .catch(err => console.log(err))
})

router.post('/match-details/:id/delete', (req, res, next) => {

    const { id } = req.params

    Match
        .findByIdAndDelete(id)
        .then(() => {
            res.redirect('/matches')
        })
        .catch(err => console.log(err))
})

router.get('/match-details/:id/edit', (req, res, next) => {

    const { id } = req.params

    Match
        .findById(id)
        .populate('players')
        .then(match => {

            date1 = formatDate(match.startTime.toISOString())
            date2 = formatDate(match.endTime.toISOString())
            res.render('match/match-edit', { match, date1, date2 })

        })
        .catch(err => console.log(err))
})

router.post('/match-details/:id/edit', (req, res, next) => {

    const { id } = req.params
    const { startTime, endTime, players, winner, opened, lat, lng } = req.body

    Match
        .findByIdAndUpdate(id, { startTime, endTime, players, winner, opened, lat, lng })
        .then(() => {
            res.redirect('/matches/match-details/:id')
        })
        .catch(err => console.log(err))
})

router.post('match-details/:id/join', (req, res, next) => {

    const { players } = req.body
    const { id } = req.params

    Match
        .findById(id)
        .update({ $push: { players } })
        .then(() => {
            res.redirect('/matches')
        })
})

module.exports = router