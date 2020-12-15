const isLogged = (req, res, next) => {
    if (!req.session.isLogged) {
        res.redirect('/')
    }

    next()
}

module.exports = isLogged