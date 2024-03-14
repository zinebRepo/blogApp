const router = require('express').Router()
const { createPostCtrl, getAllPostsCtrl, getSinglePostCtrl, getPostCountCtrl, deletePostCtrl, updatePostCtrl } = require('../controllers/postsController')
const validateObjectID = require('../middleware/validateObjectID')
const { verifyToken } = require('../middleware/verifyToken')

router
    .route('/')
    .post(verifyToken, createPostCtrl)
    .get(getAllPostsCtrl) 
   // .delete(validateObjectID, verifyToken)
 
router.route('/count').get(getPostCountCtrl)

router.route('/:id')
    .get(validateObjectID, getSinglePostCtrl)
    .delete(validateObjectID, verifyToken, deletePostCtrl)
    .put(validateObjectID, verifyToken, updatePostCtrl)

module.exports = router