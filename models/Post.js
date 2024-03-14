const mongoose = require('mongoose')
const joi = require('joi')

//Schema
const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 200,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    category: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
})

//Post Model
const Post = mongoose.model('Post', PostSchema)

//Validate create Post
function validateCreatePost(obj) {
    const schema = joi.object({
        title: joi.string().trim().min(2).max(200).required(),
        description: joi.string().trim().min(10).required(),
        category: joi.string().trim().required(),
    })
    return schema.validate(obj)
}

function validateUpdatePost(obj) {
    const schema = joi.object({
        title: joi.string().trim().min(2).max(200),
        description: joi.string().trim().min(10),
        category: joi.string().trim(),
    })
    return schema.validate(obj)
}

module.exports = {
    Post,
    validateCreatePost,
    validateUpdatePost
}

