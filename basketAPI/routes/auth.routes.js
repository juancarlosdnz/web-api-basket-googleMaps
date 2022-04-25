const router = require("express").Router()
const bcryptjs = require('bcryptjs')
const User = require("../models/User.model")
const saltRounds = 10

const {isLoggedOut}=require("../middleware/route-guard")

// Signup
router.get('/register', (req, res, next) => res.render('auth/sign-up'))

router.post('/register', (req, res, next) => {

    const { username, email, plainPassword,profileImg,phoneNumber} = req.body

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(plainPassword, salt))
        .then(hashedPassword => User.create({ username, email,profileImg,phoneNumber, password: hashedPassword }))
        .then(() => res.redirect('/'))
        .catch(error => next(error));
})



// Login
router.get('/login', (req, res, next) => res.render('auth/login'))
router.post('/login', (req, res, next) => {

    const { email, plainPassword } = req.body

    User
        .findOne({ email })
        .then(user => {
            if (!user) {
                res.render('auth/login', { errorMessage: 'Email no registrado en la Base de Datos' })
                return
            } else if (bcryptjs.compareSync(plainPassword, user.password) === false) {
                res.render('auth/login', { errorMessage: 'La contraseña es incorrecta' })
                return
            } else {
                req.session.currentUser = user
                res.redirect('/')
            }
        })
        .catch(error => next(error))
})


// Logout
router.post('/logout', (req, res, next) => {
    req.session.destroy(() => res.redirect('/iniciar-sesion'))
})

module.exports = router
