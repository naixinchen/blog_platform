const HttpException = require("../exception/http.exception")
const Article = require("../model/article")
const User = require('../model/user')
const Tag = require('../model/tag')
const { getFavorite, handleArticle } = require('./article')  //需要在article文件中将其导出

// 控制器 ： 添加喜欢
const addFavorite = async (req, res, next) => {
    try {
        // 获取文章slug
        const { slug } = req.params

        //获取文章 ： 包含标签
        let article = await Article.findOne({ slug })

        // 喜欢文章的用户 ： 登录用户
        const userEmail = req.user.email
        const user = await User.findOne({ email: userEmail })

        //文章添加喜欢的用户 在Article 表中 新增了字段beFavorite(被谁所喜欢)
        let ff = article.beFavorite.includes(userEmail)
        if (!ff) {
            await Article.updateOne({ slug }, { "$push": { beFavorite: userEmail } })
        }

        article = await Article.findOne({ slug })
        //获取喜欢信息
        const { favoriteCount, favoried } = await getFavorite(article, req.user)

        //响应数据处理
        let result = await handleArticle(slug, article.userEmail, favoriteCount, favoried)

        //响应数据
        res.status(200).json({
            status: 1,
            message: '添加喜欢成功',
            data: result
        })

    } catch (error) {
        next(error)
    }
}

// 控制器 ： 取消喜欢
const removeFavorite = async (req, res, next) => {
    try {
        // 获取文章slug
        const { slug } = req.params

        //获取文章 ： 包含标签
        let article = await Article.findOne({ slug })

        // 喜欢文章的用户 ： 登录用户
        const userEmail = req.user.email
        const user = await User.findOne({ email: userEmail })

        //文章添加喜欢的用户 在Article 表中 新增了字段beFavorite(被谁所喜欢)
        //需要取消关注--找到当前登录的人 在去表中 删除对应的此人  如果有才删除
        let ff = article.beFavorite.includes(userEmail)
        if (ff) {
            await Article.updateOne({ slug }, { "$pull": { beFavorite: userEmail } })
        }

        article = await Article.findOne({ slug })
        //获取喜欢信息
        const { favoriteCount, favoried } = await getFavorite(article, req.user)

        //响应数据处理
        let result = await handleArticle(slug, article.userEmail, favoriteCount, favoried)

        //响应数据
        res.status(200).json({
            status: 1,
            message: '取消喜欢成功',
            data: result
        })

    } catch (error) {
        next(error)
    }
}


module.exports = {
    addFavorite,
    removeFavorite
}