const Article = require("../model/article")
const HttpException = require("../exception/http.exception")
const User = require('../model/user')
const Comment = require('../model/comment')

module.exports.createComment = async (req, res, next) => {
    try {
        const { slug } = req.params
        // 评论内容
        const { body } = req.body.comment
        //评论文章
        const article = await Article.findOne({ slug })
        if (!article) {
            throw new HttpException(404, '评论文章不存在', '')
        }

        //获取评论人
        const email = req.user.email
        const user = await User.findOne({ email })
        if (!user) {
            throw new HttpException(404, '评论用户不存在', '')
        }

        let result = await new Comment({
            body,
            userEmail: email,
            articleSlug: slug
        }).save()
        console.log(result);

        let userInfo = {
            username: user.username,
            avatar: user.avatar,
            bio: user.bio,
        }

        //响应数据
        res.status(200).json({
            status: 1,
            message: '创建评论成功',
            data: {
                id: result._id,
                body: result.body,
                userInfo
            }
        })
    } catch (error) {
        next(error)
    }
}

// 控制器 ： 获取评论
module.exports.getCommnents = async (req, res, next) => {
    try {
        const { slug } = req.params

        const article = await Article.findOne({ slug })
        if (!article) {
            throw new HttpException(404, '评论文章不存在', '')
        }

        const comments = await Comment.find({ articleSlug: slug })

        let list = []

        for (const item of comments) {
            let user = await User.findOne({ email: item.userEmail })

            let userInfo = {
                username: user.username,
                avatar: user.avatar,
                bio: user.bio,
            }

            list.push({
                id: item._id,
                body: item.body,
                userInfo
            })
        }

        res.status(200).json({
            status: 1,
            message: '获取所有评论成功',
            data: list
        })
    } catch (error) {
        next(error)
    }
}

// 控制器 ： 删除评论
module.exports.deleteCommnent = async (req, res, next) => {
    try {
        const { slug, id } = req.params
        const article = await Article.findOne({ slug })
        if (!article) {
            throw new HttpException(404, '评论文章不存在', '')
        }
        const comment = await Comment.findOne({ _id: id })
        if (!comment) {
            throw new HttpException(404, '文章的评论不存在', '')
        }

        const userEmail = req.user.email
        const commentEmail = comment.userEmail
        if (userEmail !== commentEmail) {
            throw new HttpException(403, '当前用户没有删除权限', '')
        }

        // 扩展：文章的作者是否有删除权限 ： TODO ?
        await Comment.deleteOne({ _id: id })

        res.status(200).json({
            status: 1,
            message: '删除评论成功',
        })
    } catch (error) {
        next(error)
    }
}
