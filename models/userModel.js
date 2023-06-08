const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username:String,
    email :String,
    password :String,
    isVerified:Boolean,
    verificationToken:String,
});

const userModel = mongoose.model('User',userSchema);

module.exports = { userModel };