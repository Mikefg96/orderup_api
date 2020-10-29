'use strict'
const bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    salt = 10;

const confiq = require('../config/config').get(process.env.NODE_ENV);

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 100
    },
    lastname: {
        type: String,
        required: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    confirmPassword: {
        type: String,
        required: true,
        minlength: 8

    },
    token: {
        type: String
    }
});

userSchema.pre('save', function(next) {
    let user = this;

    if(user.isModified('password')) {
        bcrypt.genSalt(salt,(err, salt) => {
            if(err) return next(err);

            bcrypt.hash(user.password, salt, (err, hash) => {
                if(err) return next(err);

                user.password = hash;
                user.confirmPassword = hash;
                next();
            });
        });
    }
    else {
        next();
    }
});

userSchema.methods.comparepassword = function(password, cb) {
    bcrypt.compare(password, this.password,(err, isMatch) => {
        if(err) return cb();

        cb(null, isMatch);
    });
}

userSchema.methods.generateToken = function(cb) {
    let user = this;
    let token = jwt.sign(user._id.toHexString(), confiq.SECRET);

    user.token = token;
    user.save((err,user) => {
        if(err) return cb(err);

        cb(null, user);
    });
}

userSchema.statics.findByToken = function(token, cb) {
    let user = this;

    jwt.verify(token, confiq.SECRET, (err, decode) => {
        user.findOne({ "_id": decode, "token": token }, (err, user) => {
            if(err) return cb(err);

            cb(null, user);
        });
    });
};

userSchema.methods.deleteToken = function(token, cb) {
    let user = this;

    user.update({ $unset : { token : 1 }}, (err, user) => {
        if(err) return cb(err);

        cb(null, user);
    });
}

module.exports = mongoose.model('User', userSchema);