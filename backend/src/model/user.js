// 用户
// 可能需要 中间表---followers
// 也能新增字段用于标识用户角色 --  暂未实施  等待测试
// let mongoose = require("../db/connection")
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect(`mongodb://localhost/blog_401`);

module.exports = mongoose.model("user", {
    email: {  //登录账号
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
        // 此处应为唯一值 
    },
    password: {
        type: String,
        required: true
    },
    avatar: {  //头像
        type: String,
        // required: true
        default: null
    },
    bio: {  //简介
        type: String,
        default: null
        // required: true
    }
})