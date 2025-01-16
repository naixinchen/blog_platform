const express = require('express')
const router = express.Router()
const { createArticle, getArticle, updateArticle, deleteArticle, getFollowArticles,getArticles } = require('../controller/article')
const authMiddleware = require('../middleware/auth.middleware')

router.post('/', authMiddleware, createArticle)
router.get('/', getArticles) // 不登录 也可以获取全局文章
router.get('/follow', authMiddleware, getFollowArticles)
router.get('/:slug', authMiddleware, getArticle)
router.put('/:slug', authMiddleware, updateArticle)
router.delete('/:slug', authMiddleware, deleteArticle)

module.exports = router