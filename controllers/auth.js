const User = require('../models/user_models')
const bcrypt = require('bcrypt')
const { use } = require('../routes')
const jwt = require('jsonwebtoken')

const sendError = (res, code, msg) => {
    return res.status(400).send({
        'status': 'fail',
        'error': msg
    })
}

const register = async (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    if (email == null || password == null) {
        return res.status(400).send({
            'status': 'fail',
            'error': 'user or password is null'
        })
    }
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
        newUser = await user.save()
        res.status(200).send(newUser)

    } catch (error) {
        res.status(400).send({
            'status': 'fail',
            'error': error.message
        })
    }
}

const login = async (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    if (email == null || password == null)
        return sendError(res, 400, 'incorrect email or password')
    try {
        const user = await User.findOne({ 'email': email })
        if (user == null) return sendError(res, 400, 'incorrect email or password')
        const match = await bcrypt.compare(password, user.password)
        if (!match) return sendError(res, 400, 'incorrect email or password')

        const accessToken = await jwt.sign({
            'id': user._id
        },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
        )
        res.status(200).send({ 'acessToken': accessToken })


    } catch (error) {
        return sendError(res, 400, error.message)
    }
}

const logout = async (req, res, next) => {
    res.status(400).send({
        'status': 'fail',
        'error': 'not implemented'
    })
}

module.exports = {
    login,
    register,
    logout
}