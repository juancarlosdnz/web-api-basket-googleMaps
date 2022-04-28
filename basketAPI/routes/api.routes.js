const router = require('express').Router()
const Match = require('../models/Match.model')

router.get('/matches', (req, res) => {

    Match
        .find()
        .then(matches => res.json(matches))
        .catch(err => res.status(500).json({ message: 'Server error', error: err }))
})

module.exports = router