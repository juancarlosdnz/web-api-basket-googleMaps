const isLoggedIn = (req, res, next) => {
    if (req.session.currentUser) {
        res.redirect('/')
    }
    else {
        next()
    }
}

const isLoggedOut = (req, res, next) => {
    if (req.session.currentUser == null) {
        res.redirect('/login')
    }
    else {
        next()
    }
}

const checkRole = (...rolesToCheck) => (req, res, next) => {
    if (rolesToCheck.includes(req.session.currentUser.role)) {
        next()
    }
    else {
        res.render('auth/login', { errorMessage: 'No tienes permisos' })
    }
}

module.exports = { isLoggedIn, isLoggedOut, checkRole }