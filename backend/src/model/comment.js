// 评论
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect(`mongodb://localhost/blog_401`);

module.exports = mongoose.model("comment", {
    body: {  //评论内容
        type: String,
    },
    userEmail: {
        type: String,
        required: true,
    },
    articleSlug: {  //标签名称
        type: String,
        required: true
    }
})