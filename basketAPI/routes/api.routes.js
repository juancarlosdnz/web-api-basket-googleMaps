const router = require('express').Router()
const Match = require('../models/Match.model')

router.get('/matches', (req, res, next) => {

    Match
        .find()
        .then(matches => res.json(matches))
        .catch(err => console.log(err))
})

module.exports = router