const express = require('express')
const router = express.Router()
const auth = require('../controllers/auth')

router.post('/register', auth.register)
router.post('/login', auth.login)
router.get('/refresh', auth.refresh)
router.get('/logout', auth.logout)

module.exports = router

