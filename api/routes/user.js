let mongoose = require('mongoose')
let express = require('express')

let router = express.Router()
let bcrypt = require('bcrypt')

let User = require('../models/User')
let jwt = require('jsonwebtoken')
let UserController = require('../controllers/user')

router.post('/signup', UserController.users_signup_user)
router.post('/login', UserController.users_login_user)

router.delete('/:userId', UserController.users_delete_user)

module.exports = router

