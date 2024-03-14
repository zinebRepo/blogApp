const asyncHandler = require('express-async-handler')
const {  User, validateUpdateUser } = require('../models/User')
const bcrypt = require('bcryptjs')
const { equal } = require('joi')

module.exports.getAllUsersCtrl = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password')
    res.status(200).send(users)
})

module.exports.getUserProfileCtrl = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')
    if(!user) {
        return res.status(404).json({ message: 'user not found' })
    }
    res.status(200).send(user)
})

module.exports.updateUserProfileCtrl = asyncHandler(async (req, res) => {
    const {error} = validateUpdateUser(req.body)
    if(error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    if(req.body.password) {
        const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(req.body.password, salt)
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        $set: {
            username: req.body.username,
            password: req.body.password,
            bio: req.body.bio
        }
    }, { new: true }).select('-password')
    
    res.status(200).json(updatedUser)
})

