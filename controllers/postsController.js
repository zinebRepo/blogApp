//const fs = require('fs')
const path = require('path')
const asyncHandler = require('express-async-handler')
const { Post,  validateCreatePost, validateUpdatePost} = require('../models/Post')


module.exports.createPostCtrl = asyncHandler(async (req, res) => {

    const { error } =  validateCreatePost(req.body)
    if(error) {
    return res.status(400).send({ message: error.details[0].message })
}

    const post = await Post.create({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        user: req.user.id,
    })

    res.status(201).send(post)
})

module.exports.getAllPostsCtrl = asyncHandler(async (req, res) => {
    const POST_PER_PAGE = 3
    const { pageNumber, category} = req.query
    let posts

    if(pageNumber) {
        posts = await Post.find()
            .skip((pageNumber - 1) * POST_PER_PAGE)
            .limit(POST_PER_PAGE)
            .sort({ createdAt: -1 })
            .populate('user', ["-password"])

    } else if (category) {
        posts = await Post.find({ category: category }).sort({ createdAt: -1 })
    } else {
        posts = await Post.find().sort({ createdAt: -1 }).populate('user', ["-password"])
            .populate('user', ["-password"])
    }
    res.status(200).send(posts)
})

module.exports.getSinglePostCtrl = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id).populate('user', ["-password"])
    if(!post) {
        return res.status(404).send({ message: 'post not found!' })
    } 
    res.status(200).send(post)
})

module.exports.getPostCountCtrl = asyncHandler(async (req, res) => {
    const count = await Post.count()    
    res.status(200).send(count)
})

module.exports.deletePostCtrl = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id)
    if(!post) {
        return res.status(404).send({ message: 'post not found!' })
    }

    if(req.user.isAdmin || req.user.id === post.user.toString()) {
        await Post.findByIdAndDelete(req.params.id)

        res.status(200).send({ message: 'Post has been deleted!!' })
    } else {
        res.status(403).send({ message: 'ur forbidden from access' })
    }
})

module.exports.updatePostCtrl = asyncHandler(async (req, res) => {
    //validation
    const { error } = validateUpdatePost(req.body)
    if(error) {
        return res.status(400).send({ message: error.details[0].message })
    }

     //take the post and check if it exists
    const post = await Post.findById(req.params.id)
    if(!post){ 
        res.status(404).send({ message: 'post not found' })
    }

    //check if it belongs to logged in user
    if(req.user.id !== post.user.toString()) {
        return res.status(403).send({ message: 'Ur access has been denied!' })
    }

    //update post
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
        $set: {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category
        }
    }, { new: true }).populate('user', ['-password'])

    res.status(200).send(updatedPost)

})