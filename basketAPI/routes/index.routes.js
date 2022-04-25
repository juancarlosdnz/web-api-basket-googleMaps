const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


// Matches routes

router.use('/matches', require('./matches.routes')) 
router.use('/', require('./auth.routes'))
router.use('/profile',require('./profile.routes'))
router.use('/users', require('./users.routes'))


module.exports = router;
