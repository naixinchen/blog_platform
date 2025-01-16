const express = require('express')
const router = express.Router()
const { follow, unfollow } = require('../controller/follow')
const authMiddleware = require('../middleware/auth.middleware')

//添加关注 : params =>{username:'zhangsan'} :username为占位符。关注谁就传谁进去
router.post('/:username', authMiddleware, follow)

//取消关注
router.delete('/:username', authMiddleware, unfollow)

module.exports = router