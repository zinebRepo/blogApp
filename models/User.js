const mongoose = require('mongoose')
const joi = require('joi')
const jwt = require('jsonwebtoken')


//user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        maxlength: 100,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
    },
    profilePhoto: {
        type: Object,
        default: {
            url: "https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331256_640.png",
            publicId: null,
        }
    },
    bio: String,
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isAccountVerified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
})

userSchema.methods.generateAuthToken = function() {
    return jwt.sign({id: this._id, isAdmin: this.isAdmin}, process.env.JWT_SECRET)
}

//user model
const User = mongoose.model('User', userSchema)


//registration (it's based on the expressJs framework and the above SCHEMA is on the DB side)
function validateRegisterUser(obj) {
    const schema = joi.object({
        username: joi.string().trim().min(2).max(100).required(),
        email: joi.string().trim().min(6).max(100).required().email(),
        password: joi.string().trim().min(8).required(),
    })
    return schema.validate(obj)
}

//login
function validateLoginUser(obj) {
    const schema = joi.object({
        email: joi.string().trim().min(6).max(100).required().email(),
        password: joi.string().trim().min(8).required(),
    })
    return schema.validate(obj)
}

function validateUpdateUser(obj) {
    const schema = joi.object({
        username: joi.string().trim().min(2).max(100),
        password: joi.string().trim().min(8),
        bio: joi.string(),
    })
    return schema.validate(obj)
}

module.exports = {
    User,
    validateRegisterUser, 
    validateLoginUser,
    validateUpdateUser
}
