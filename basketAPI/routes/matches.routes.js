const router = require('express').Router()
const Match = require('./../models/Match.model')
const User = require('./../models/User.model')

const mongoose = require('mongoose');
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
        .populate('teamA')
        .populate('teamB')
        .then(match => {
            console.log('------------------------TEAM A: ' + match.teamA)
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
        .populate('teamA')
        .populate('teamB')
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

router.post('/match-details/:id/joinTeamA', (req, res, next) => {

    let { players } = req.body
    const { id } = req.params
    players = mongoose.Types.ObjectId(`${req.session.currentUser._id}`)

    Match
        .findById(id)
        .update({ $addToSet: { teamA: players } })
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

router.post('/match-details/:id/markWinnersA', (req, res, next) => {


    const { id } = req.params

    Match
        .findById(id)
        .then(match => {
            teamAPlayers = match.teamA
            return User.find({ teamAPlayers }).updateMany({ $inc: { wins: 1 } })
        })
        .then(() => {
            res.redirect('/matches')
        })



})


module.exports = router