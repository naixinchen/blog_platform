// 用户关注信息表
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect(`mongodb://localhost/blog_401`);

module.exports = mongoose.model("followers", {
    userEmail: {  //关注者
        type: String,
        required: true
    },
    followerEmail: {//被关注者
        type: String,
        required: true
    }
})