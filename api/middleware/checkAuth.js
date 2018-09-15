let jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        let token = req.headers.authorization.split(" ")[1]
        let decoded = jwt.verify(token, 'supersecretkey')
        req.userData = decoded
        next()

    } catch (error) {
        res.status(401).json({
            message: 'Auth failed'
        })
    }
}