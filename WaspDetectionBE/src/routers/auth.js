const express = require('express')
const router = express.Router()
const { signup, signin ,signout, requireSignin,login} =require('../controllers/auth.js')
const { userSignupValidator} = require('../validator')
router.post('/signup',userSignupValidator,signup)
router.post('/signin',signin)
router.post('/login',login)
router.get('/signout',signout)

module.exports = router;