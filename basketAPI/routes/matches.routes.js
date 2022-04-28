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
            matches.forEach(match => {
                date1 = formatDate(match.startTime.toISOString())
                date2 = formatDate(match.endTime.toISOString())
            })
            res.render('match/match-list', { matches, date1, date2 })

        })
        .catch(err => console.log(err))
})

router.get('/match-details/:id', (req, res, next) => {

    const { id } = req.params

    Match
        .findById(id)
        .populate('teamA')
        .populate('teamB')
        .populate('organizer')
        .then(match => {
            date1 = formatDate(match.startTime.toISOString())
            date2 = formatDate(match.endTime.toISOString())
            res.render('match/match-detail', { match, date1, date2 })
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
            res.redirect('/matches')
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
        .then(({ teamA }) => {

            const playersIncrement = teamA.map(eachPlayer => User.findByIdAndUpdate(eachPlayer, { $inc: { wins: 1 } }))
            return Promise.all(playersIncrement)
        })
        .then(res.redirect('/matches'))
        .catch(err => console.log(err))

})
router.post('/match-details/:id/markWinnersB', (req, res, next) => {


    const { id } = req.params

    Match
        .findById(id)
        .then(({ teamB }) => {

            const playersIncrement = teamB.map(eachPlayer => User.findByIdAndUpdate(eachPlayer, { $inc: { wins: 1 } }))
            return Promise.all(playersIncrement)
        })
        .then(res.redirect('/matches'))
        .catch(err => console.log(err))

})

// router.post('/match-details/:id/markLosersA', (req, res, next) => {


//     const { id } = req.params
//     let teamAPlayers

//     Match
//         .findById(id)
//         .then(match => {
//             teamAPlayers = match.teamA
//             return User.find({ teamAPlayers }).updateMany({ $inc: { loses: 1 } })
//         })
//         .then(() => {
//             res.redirect('/matches')
//         })
// })

// router.post('/match-details/:id/markLosersB', (req, res, next) => {


//     const { id } = req.params
//     let teamBPlayers

//     Match
//         .findById(id)
//         .then(match => {
//             teamBPlayers = match.teamB
//             return User.find({ teamBPlayers }).updateMany({ $inc: { loses: 1 } })
//         })
//         .then(() => {
//             res.redirect('/matches')
//         })
// })

module.exports = router