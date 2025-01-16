const express = require("express")
const router = express.Router()
const { createUser, loginUser, getUser, updateUser, getUserByUsername } = require("../controller/user")
const authMiddleware = require('../middleware/auth.middleware')

// 注册  创建用户
router.post("/", createUser)

// 登录
router.post("/login", loginUser)

//获取用户信息 : token  next 1  2 null
router.get('/', authMiddleware, getUser)

//获取用户信息 ： username
router.get('/:username', authMiddleware, getUserByUsername)

//更新用户信息 
router.put('/', authMiddleware, updateUser)

/*
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkFAcXEuY29tIiwidXNlcm5hbWUiOiJBIiwiaWF0IjoxNjY2OTI3MDA0fQ.q5zGOSwJ780svToqzzPFu_0ZApsQOQ1hQOgeRIIIzyE"
*/

module.exports = router