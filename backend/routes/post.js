const express = require('express');
const router = express.Router();
const post = require('../controllers/post')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

router.get('/',auth, post.getAllPost)
router.post('/',auth, multer, post.createPost)
router.get('/:id', auth, post.getOnePost)
router.delete('/:id', auth, post.deleteOnePost)
router.put('/:id',auth, multer, post.modifyPost)
router.post('/:id/like', auth, post.likePost)
router.post('/:id/comment', auth, post.commentPost)
router.put('/:id/comment', auth, post.modifyComment)
router.delete('/:id/comment', auth, post.deleteComment)


module.exports = router