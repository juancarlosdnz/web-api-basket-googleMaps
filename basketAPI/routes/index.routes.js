const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


// Matches routes

router.use('/matches', require('./matches.routes')) 

module.exports = router;
