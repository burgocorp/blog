const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    name : {
        type : String,
        required : true

    },

    email : {
        type : String,
        required : true

    },

    password : {
        type : String,
        required : true

    },

    avatar : {
        type : String

    },

    date : {
        type : Date,
        default : Date.now

    }


});

//db에 user라는 컬렉션을 만들 것이고 그 안에 userSchema를 구성하겠다
module.exports = mongoose.model("user", userSchema);