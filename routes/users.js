const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
//const { secret } = require('../config/database');

// register
router.post('/register', (req, res, next) => {
//const {email, password} = req.body 
    let newUser = new User ({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) =>{
        if(err){
            res.json({success: false, msg: 'failed to refgister user'});
        } else {
            res.json({success: true, msg: 'user registered'});
        }
    });
});

// authenticate
router.post('/authenticate', (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;
    // lisätty ite koska errorii express-sessions
    //session: false

    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: 'User not found'});
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch) {
                const token = jwt.sign({data: user}, config.secret, {
                    expiresIn: 604800 // yks viikko
                });

                res.json({
                    success: true,
                    token: 'JWT '+token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                })
            } else {
                return res.json({success: false, msg: 'Wrong passwd'});
            }
            
        });
    });
});

// profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) =>{
    res.send({user: req.user});
});

module.exports = router;