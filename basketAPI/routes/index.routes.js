const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.render("index");
});

router.use('/', require('./auth.routes'))
router.use('/api', require('./api.routes'))
router.use('/users', require('./users.routes'))
router.use('/profile', require('./profile.routes'))
router.use('/matches', require('./matches.routes'))

module.exports = router;
