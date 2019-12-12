const express = require('express');

const router = express.Router();
const gravatar = require("gravatar");
const userModel = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const validateRegisterInput = require('../validation/register');


// user register
router.post('/register', (req,res) =>{

    const {errors, isValid } = validateRegisterInput(req.body);
    if (!isValid){
        return res.status(400).json(errors);
    }


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

    //email check -> password check(decoding) -> returning jwt -> response
    userModel
        .findOne({email : req.body.email})
        .exec()
        .then(user => {
            //(사용자입력이메일이 없으면 아래 프로세스)
            if (!user){
                return res.json({
                    msg : "등록된 이메일이 없음"
                });
            }else{
               
                bcrypt
                    .compare(req.body.password, user.password)
                    .then(isMatch => {
                        if (isMatch){

                            // jsonwebtoken 에 담을 내용 생성 
                            const payload = { id : user.id, name : user.name, avatar : user.avatar};

                            //sign token
                            const token = jwt.sign(
                                payload,
                                process.env.SECRET_KEY,
                                {expiresIn : 36000}
                            );

                            return res.json({
                                msg :"successfull login",
                                tokenInfo : 'bearer ' + token
                            });
                        }else{
                            res.json({
                                msg : 'password incorrect'
                            });
                        }
                    })
                    .catch(err => res.json(err));

            
               
            }
        })
        .catch(err => {
            res.json({
                msg : err.message
            });
        });

});


// current user
router.get('/currents', (req,res) => {

});


module.exports = router;