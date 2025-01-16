const express = require('express')
const router = express.Router()
const { createTag, getTags, deleteTag } = require('../controller/tag')
const authMiddleware = require('../middleware/auth.middleware')


router.post('/', authMiddleware, createTag)
router.get('/', getTags)
router.delete('/:tag', authMiddleware, deleteTag)

module.exports = router