const User = require('../models/user_model')
const bcrypt = require('bcrypt')
const { use } = require('../routes')
const jwt = require('jsonwebtoken')


const sendError = (res, code, msg) => {
    return res.status(code).send({
        'status': 'fail',
        'error': msg
    })
}

const register = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    try {
        const exists = await User.findOne({ 'email': email })
        if (exists != null) {
            return res.status(400).send({
                'status': 'fail',
                'error': 'user exists'
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPwd = await bcrypt.hash(password, salt)

        const user = User({
            'email': email,
            'password': hashPwd
        })

        const accessToken = await jwt.sign(
            { 'id': user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
        )

        newUser = await user.save();

        res.status(200).send({ newUser, accessToken })

    } catch (error) {
        res.status(400).send({
            'status': 'fail',
            'error': error.message
        })
    }
}

const login = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    if (email == null || password == null) return sendError(res, 400, 'wrong email or password')

    try {
        const user = await User.findOne({ 'email': email })
        if (user == null) return sendError(res, 400, 'wrong email or password')
        const match = await bcrypt.compare(password, user.password)
        if (!match) return sendError(res, 400, 'wrong email or password')

        const accessToken = await jwt.sign(
            { 'id': user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
        )
        const refreshToken = await jwt.sign(
            { 'id': user._id },
            process.env.REFRESH_TOKEN_SECRET

        )

        if (user.refresh_tokens == null) user.refresh_tokens = [refreshToken]
        else user.refresh_tokens.push(refreshToken)
        await user.save()


        res.status(200).send({
            'accessToken': accessToken,
            'refreshToken': refreshToken
        })

    } catch (error) {
        return sendError(res, 400, error.message)
    }

}

const refresh = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return sendError(res, 'authentication missing')

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (error, userInfo) => {
        if (error) return res.status(403).send(error.message)
        const userId = userInfo._id
        try {
            user = await User.findById(userId)
            if (user == null) return res.status(403).send('invalid request')
            if (!user.refresh_tokens.includes(token)) {
                user.refresh_tokens = []
                await user.save()
                return res.status(403).send('invalid request')
            }

            const accessToken = await jwt.sign(
                { '_id': user._id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
            )

            const refreshToken = await jwt.sign(
                { '_id': user._id },
                process.env.REFRESH_TOKEN_SECRET
            )

            user.refresh_tokens[user.refresh_tokens.indexOf(token)] = refreshToken
            await user.save()
            res.status(200).send({ 'accessToken': accessToken, 'refreshToken': refreshToken });
        } catch (error) {
            res.status(403).send(error.message)
        }
    })
}

const logout = async (req, res, next) => {
    const authHeaders = req.headers['authorization']
    if (authHeader == null) return sendError(res, 'authentication missing')
    const token = authHeaders && authHeaders.split(' ')[1]
    if (token == null) return res.sendStatus('401')

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (error, userInfo) => {
        if (error) return res.status(403).send(err.message)
        const userId = userInfo._id
        try {
            user = await User.findById(userId)
            if (user == null) return res.status(403).send('invalid request')
            if (!user.token.includes(token)) {
                user.refresh_tokens = []
                await user.save()
                return res.status(403).send('invalid request')
            }
            user.refresh_tokens.splice(user.refresh_tokens.indexOf(token), 1)
            await user.save()
            res.status(200).send()
        } catch (error) {
            res.status(403).send(error.message)
        }
    })
}

const authenticateMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (authHeader == null) return sendError(res, 'authentication missing')
    const refreshToken = authHeader.split('')[1]
    if (refreshToken == null) return sendError(res, 'authentication missing')
    try {
        const user = await jwt.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET)
        consloe.log("token user: " + user)
        next()
    } catch (error) {
        return sendError(res, 'fail validating token')
    }
}

module.exports = {
    login,
    refresh,
    register,
    logout,
    authenticateMiddleware,

}