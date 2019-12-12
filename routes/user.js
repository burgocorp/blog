const express = require('express');

const router = express.Router();
const gravatar = require("gravatar");
const userModel = require("../models/user");
const bcrypt = require('bcryptjs');

// user register
router.post('/register', (req,res) =>{
    // email 유무체크 -> avatar 생성 -> usermodel -> password암호화 -> response
    userModel
        .findOne({email : req.body.email})
        .exec()
        .then(user => {
            if (user) {
                return res.json({
                    msg : "mail exists"
                });
            }else{
                //avatar를 username을 바탕으로 자동 생성
                const avatar = gravatar.url(req.body.email, {
                    s:'200', //size
                    r:'pg', //Rating
                    d:'mm' //Default
                });

                const user = new userModel({
                    name : req.body.username,
                    email : req.body.email,
                    password : req.body.password,
                    avatar : avatar
                });
                // pass 암호화
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(user.password, salt, (err, hash) => {
                        if (err) throw err;
                        user.password = hash;
                        user
                        .save()
                        .then(result => {
                            res.json({
                                msg : "registered user",
                                userInfo : result
                            });
                        })
                        .catch(err => {
                            res.json({
                                msg : err.message
                            });
                        });
                        
                    })
                })
   

            }
        })
        .catch(err => {
            res.json({
                msg : err.message
            });
        });


    


});

// user login
router.post('/login', (req,res) =>{

});


// current user
router.get('/currents', (req,res) => {

});


module.exports = router;