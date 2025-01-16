// 文章
// 可能需要中间表 tagList
// 文章可能有多个标签， 一个标签可能对应多个文章

// 可能还需要 useremail

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect(`mongodb://localhost/blog_401`);

module.exports = mongoose.model("article", {
    slug: {  //文章的别名
        type: String,
        required: true,
        unique: true
    },
    title: {  //标题
        type: String,
        required: true
    },
    description: {  //描述
        type: String,
        required: true
    },
    body: {  //文章内容
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    beFavorite: {
        // 被谁喜欢
        type: Array,
        default: null
    },
    username: {
        type: String,
        required: true
    }

})