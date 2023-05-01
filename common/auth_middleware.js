const jwt = require('jsonwebtoken')

const authenticate = async (req, res, next) => {
    const authHeaders = req.headers['authorization']
    const token = authHeaders && authHeaders.split(' ')[1]
    if (token == null) return res.sendStatus('401').send()

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) return res.status(403).send(error.message)
        req.user = user
        next()
    })
}

module.exports = authenticate
