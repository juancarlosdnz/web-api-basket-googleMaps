const router = require('express').Router()
const Match = require('./../models/Match.model')
const User = require('./../models/User.model')
const mongoose = require('mongoose');
const { isLoggedOut, checkRole } = require("../middleware/route-guard")
const formatDate = require('./../utils/formatDate')

router.get('/', isLoggedOut, (req, res, next) => {
    let startTimes = []
    let endTimes = []
    Match
        .find()
        .then(matches => {
      
            res.render('match/match-list', { matches, date1, date2 })

        })
        .catch(err => console.log(err))
})

router.get('/match-details/:id', (req, res, next) => {

    const { id } = req.params
    const isOrganizer = req.session.currentUser.role === 'ORGANIZER'

    console.log('------' + req.session.currentUser.role)

    Match
        .findById(id)
        .populate('teamA')
        .populate('teamB')
        .populate('organizer')
        .then(match => {
            date1 = formatDate(match.startTime.toISOString())
            date2 = formatDate(match.endTime.toISOString())
            res.render('match/match-detail', { match, date1, date2, isOrganizer })
        })
        .catch(err => console.log(err))
})

router.get('/create', isLoggedOut, checkRole("ORGANIZER", "ADMIN"), (req, res, next) => {
    res.render('match/match-create')
})

router.post('/create', (req, res, next) => {

    const { organizer = req.session.currentUser._id, startTime, endTime, players, winner, opened, lat, lng } = req.body
    const location = { type: 'Point', coordinates: [lat, lng] }

    Match
        .create({ organizer, startTime, endTime, players, winner, opened, location })
        .then(() => {
            res.redirect('/matches')
        })
        .catch(err => console.log(err))
})

router.post('/match-details/:id/delete', (req, res, next) => {

    const { id } = req.params

    Match
        .findByIdAndDelete(id)
        .then(() => {
        })
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

            // const [statrtTimeFmt, endTimeFmt] = formatMatchDates(match)
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

    let { playerId } = req.body
    const { id } = req.params
    playerId = req.session.currentUser._id

    Match
        .findById(id)
        .update({ $push: { teamA: playerId } })
        .then(() => {
            const promise1 = [User.findByIdAndUpdate(playerId, { $addToSet: { myMatches: id } })]
            Promise.all(promise1)
        })
        .then(() => {
            res.redirect('/matches')
        })
        .catch(err => console.log(err))

})

router.post('/match-details/:id/joinTeamB', (req, res, next) => {

    let { playerId } = req.body
    const { id } = req.params
    playerId = req.session.currentUser._id

    Match
        .findById(id)
        .update({ $push: { teamB: playerId } })
        .then(() => {
            const promise1 = [User.findByIdAndUpdate(playerId, { $addToSet: { myMatches: id } })]
            Promise.all(promise1)
        })
        .then(() => {
            res.redirect('/matches')
        })
        .catch(err => console.log(err))

})

router.post('/match-details/:id/markWinnersA', (req, res, next) => {


    const { id } = req.params

    Match
        .findById(id)
        .then(({ teamA, teamB }) => {
            const playersWinIncrement = teamA.map(eachPlayer => User.findByIdAndUpdate(eachPlayer, { $inc: { wins: 1 } }))
            Promise.all(playersWinIncrement)
            return teamB
        })
        .then((teamB) => {
            const playersLoseIncrement = teamB.map(eachPlayer => User.findByIdAndUpdate(eachPlayer, { $inc: { loses: 1 } }))
            Promise.all(playersLoseIncrement)
            res.redirect('/matches')
        })
        .catch(err => console.log(err))

})
router.post('/match-details/:id/markWinnersB', (req, res, next) => {


    const { id } = req.params

    Match
        .findById(id)
        .then(({ teamA, teamB }) => {
            const playersWinIncrement = teamB.map(eachPlayer => User.findByIdAndUpdate(eachPlayer, { $inc: { wins: 1 } }))
            Promise.all(playersWinIncrement)
            return teamA
        })
        .then((teamA) => {
            console.log(id)
            const playersLoseIncrement = teamA.map(eachPlayer => User.findByIdAndUpdate(eachPlayer, { $inc: { loses: 1 } }))
            const matchDelete = Match.findByIdAndDelete(id)
            Promise.all([playersLoseIncrement, matchDelete])
            res.redirect('/matches')
        })
        .catch(err => console.log(err))

})


module.exports = router