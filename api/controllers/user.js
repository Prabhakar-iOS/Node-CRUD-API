let mongoose = require('mongoose')
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')

let User = require('../models/User')

exports.users_signup_user = (req, res, next) => {
    User.find({email: req.body.email })
    .exec()
    .then(user => {
        if (user.length > 0) {
            return res.status(422).json({
                message: 'User already exist'
            })
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    res.status(500).json({
                        error: err
                    })
                } else {
                    let user = new User({
                        _id: new mongoose.Types.ObjectId,
                        email: req.body.email,
                        password: hash
                        })
        
                        user.save().then(doc => {
                            console.log(doc)
                            res.status(201).json({
                                message: 'User created'
                            })
                        }).catch(err => {
                            res.status(500).json({
                                error: err
                            })
                        })
                }
          
            })
        }
    })
}

exports.users_login_user = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: 'Auth failed'
            })
        }

        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: 'Auth failed'
                })
            } else if (result){
               let token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, 'supersecretkey', 
                {
                    expiresIn: '1h'
                }
            )

                return res.status(200).json({
                    message: 'Auth successful',
                    token: token
                })
            }

            res.status(401).json({
                message: 'Auth failed'
            })
         })
    })
    .catch(err => {
        res.status(500).json({
             error: err
         })
    })
 }

 exports.users_delete_user = (req, res, next) => {
    User.remove({_id: req.params.userId})
    .exec()
    .then(doc => {
        res.status(200).json({
            message: 'User was deleted'
        })
    })
    .catch(err => {
         res.status(500).json({
            error: err
        })
    })
}