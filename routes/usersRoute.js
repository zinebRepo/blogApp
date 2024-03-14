const { getAllUsersCtrl, getUserProfileCtrl, updateUserProfileCtrl } = require('../controllers/usersController')
const { verifyTokenAndAdmin, verifyTokenAndOnlyUser } = require('../middleware/verifyToken')
const validateObjectID = require('../middleware/validateObjectID')
const { validateUpdateUser } = require('../models/User')
const router = require('express').Router()

router.route('/profile').get(verifyTokenAndAdmin ,getAllUsersCtrl)

router.route('/profile/:id')
     .get(validateObjectID ,getUserProfileCtrl)
     .put(validateObjectID, verifyTokenAndOnlyUser, updateUserProfileCtrl)


     


module.exports = router