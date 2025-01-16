const HttpException = require("../exception/http.exception")
const Article = require("../model/article")
const Tag = require("../model/tag")
const User = require("../model/user")
const getSlug = require('../utils/slug')
const TagList = require("../model/taglist")
const Follow = require("../model/followers")
const { decode } = require('../utils/jwt')
const { listeners } = require("../model/article")

/**
 * 
 * @param {*} slug        当前文章的名字
 * @param {*} email       当前文章的作者
 * @param {*} favoriteCount 喜欢文章的数量   
 * @param {*} favorited   是否喜欢此文章
 * @returns Info
 */
const handleArticle = async (slug, email, favoriteCount, favorited) => {
    //拿到文章信息
    let article = await Article.findOne({ slug })
    // 拿到作者信息
    let user = await User.findOne({ email })
    // 拿到标签信息
    let tags = await TagList.find({ articleSlug: slug })

    let tagsMsg = []
    for (const tag of tags) {
        tagsMsg.push(tag.tagName)
    }

    let Info = {
        slug: article.slug,
        title: article.title,
        body: article.body,
        description: article.description,
        tags: tagsMsg,
        author: {
            avatar: user.avatar,
            bio: user.bio,
            email: user.email,
            username: user.username,
        },
        favoriteCount: favoriteCount || 0,
        favorited: favorited || false
    }
    return Info
}

/**
 * 
 * @param {*} article  文章对象
 * @param {*} currentUer 当前的登录用户
 * @returns {此篇文章被喜欢的总数，当前的登录用户是否喜欢}
 */
const getFavorite = async (article, currentUer) => {
    //此处拿到的是  此篇文章被谁喜欢   beFavorite:[]
    const favoriteCount = article.beFavorite

    // 判断是否有 用户Email传来 如果有校验是不是在上面的数组中
    let favoried = false
    if (currentUer) {
        let loginEmail = currentUer.email
        favoried = favoriteCount.includes(loginEmail)
    }

    return { favoriteCount: favoriteCount.length, favoried }
}

// 创建
const createArticle = async (req, res, next) => {
    try {
        // 01 获取数据 
        const { title, description, body, tags } = req.body.article
        // 02 TODO=>验证数据
        if (!title) {
            throw new HttpException(401, '文章标题不存在', 'title not found')
        }

        // 03 获取作者email : 当前登录用户 创建文章=>登录用户就是作者
        // 此处是从中间件中 那么user用户信息
        const { email, username } = req.user
        // 04 验证作者信息
        const author = await User.findOne({ email })
        if (!author) {
            throw new HttpException(401, '作者账号不存在', 'auhtor not found')
        }
        // 05 生成别名slug
        const slug = getSlug()

        // 06 创建文章
        await Article.insertMany({
            slug,
            title,
            description,
            body, // markdown  # title 
            userEmail: email,
            username
        })

        // 07 标签存储 : ['html','css'] 存储标签 和 文章标签关系
        if (tags.length > 0) {
            for (const t of tags) {
                let exitTag = await Tag.findOne({ name: t })
                if (!exitTag) { //标签不存在
                    //存储标签
                    await Tag.insertMany({ name: t })

                    //存储文章和标签关系
                    // await article.addTag(newTag)  此处待定  具体效果不明确
                    await TagList.insertMany({ articleSlug: slug, tagName: t })
                } else { // 标签存在
                    //存储文章和标签关系
                    // await article.addTag(exitTag)
                    await TagList.insertMany({ articleSlug: slug, tagName: t })
                }
            }
        }
        // 08 获取文章 ： 文章信息 + 作者信息 + 标签信息
        let Info = await handleArticle(slug, email)

        // 10 响应数据
        res.status(200).json({
            status: 1,
            message: '创建文章成功',
            data: Info
        })

    } catch (error) {
        next(error)
    }
}

//获取单个文章
const getArticle = async (req, res, next) => {
    try {

        const slug = req.params.slug
        // 文章 + 标签
        // console.log(slug);

        // 获取文章
        let article = await Article.findOne({ slug })
        // console.log(article);

        // 获取作者
        let userEmail = article.userEmail

        //获取喜欢信息                                        文章对象    登录的用户
        const { favoriteCount, favoried } = await getFavorite(article, req.user)

        // 文章响应数据处理
        let inFo = await handleArticle(slug, userEmail, favoriteCount, favoried)

        res.status(200).json({
            status: 1,
            message: '获取文章成功',
            data: inFo
        })

    } catch (error) {
        next()
    }
}

// 更新文章
const updateArticle = async (req, res, next) => {
    try {
        // 获取更新文章slug 
        const slug = req.params.slug

        // 获取更新文章数据
        const data = req.body.article
        const title = data.title
        const description = data.description
        const body = data.body
        const tags = data.tags

        //获取更新文章 ：验证被更新文章是否存在
        let article = await Article.findOne({ slug })
        if (!article) {
            throw new HttpException(401, '更新文章不存在', 'update article  not found')
        }

        //更新业务逻辑验证：登录用户只能更新自己的文章=>登录email===文章作者的email
        let authorEmail = article.userEmail
        let loginEmail = req.user.email

        if (authorEmail !== loginEmail) {
            throw new HttpException(403, '只有作者账号才能有更新权限', 'only author have permission to update article')
        }
        //更新文章
        const updateArticle = await Article.findOneAndUpdate({ slug }, { title, description, body })

        //更新标签
        //1)删除文章和标签的关系
        // mongoose 提示remove已经弃用  可以选择使用deleteMany
        // 原有的remove 也能使用
        await TagList.deleteMany({ articleSlug: slug })

        // // 2) 创建标签和 文章与标签关系
        if (tags.length > 0) {
            for (const t of tags) {
                let exitTag = await Tag.findOne({ name: t })
                if (!exitTag) { //标签不存在
                    //存储标签
                    await Tag.insertMany({ name: t })
                    //存储文章和标签关系
                    await TagList.insertMany({ articleSlug: slug, tagName: t })
                } else { // 标签存在
                    //存储文章和标签关系
                    await TagList.insertMany({ articleSlug: slug, tagName: t })
                }
            }
        }
        // //获取喜欢信息
        const { favoriteCount, favoried } = await getFavorite(updateArticle, req.user)

        // //响应数据处理
        let inFo = await handleArticle(slug, updateArticle.userEmail, favoriteCount, favoried)

        //响应数据
        res.status(200).json({
            status: 1,
            message: "更新文章成功",
            data: inFo
        })

    } catch (error) {
        next(error)
    }
}

//删除文章
const deleteArticle = async (req, res, next) => {
    try {
        // 获取删除文章slug 
        const slug = req.params.slug

        //获取删除文章 ：验证被删除文章是否存在
        let article = await Article.findOne({ slug })
        if (!article) {
            throw new HttpException(401, '删除文章不存在', 'delete article  not found')
        }

        //更新业务逻辑验证：登录用户只能更新自己的文章=>登录email===文章作者的email
        let authorEmail = article.userEmail
        let loginEmail = req.user.email
        if (authorEmail !== loginEmail) {
            throw new HttpException(403, '只有作者账号才能有更新权限', 'only author have permission to update article')
        }

        //删除文章 
        // 适合删除单个 ： 自己
        await Article.deleteOne({ slug })

        // 对应删除文章和标签的关系
        await TagList.deleteMany({ articleSlug: slug })

        //响应数据
        res.status(200).json({
            status: 1,
            message: "删除文章成功",
            data: article
        })

    } catch (error) {
        next(error)
    }
}

// 获取文章：当前登录用户所关注角色的文章
const getFollowArticles = async (req, res, next) => {
    try {
        // 粉丝（登录用户）邮箱
        // 此时登录角色为A 找寻A关注了谁  A为粉丝 -->  被关注的就是zuozhe
        const { limit = 5, offset = 0 } = req.query
        const fansEmail = req.user.email
        const fansUser = await User.findOne({ email: fansEmail })
        if (!fansUser) {
            throw new HttpException(401, '粉丝不存在', 'update article not found')
        }

        // 获取当前粉丝关注的所有的作者
        const auhtor = await Follow.find({ userEmail: fansEmail })
        // 没有关注的作者
        if (auhtor.length == 0) {
            res.status(200).json({
                status: 1,
                message: "获取关注作者的文章成功",
                data: []
            })
        }
        //所有关注者的email  (当前粉丝所关注的所有作者)
        let authorEmails = []
        for (const item of auhtor) {
            authorEmails.push(item.followerEmail)
        }
        // console.log(authorEmails); // ['email1','email2']

        // 批量查询 ：所有关注的作者的文章 
        // count : 文章总数=>分页
        // rows  ： 文章数据数据
        let resObj = {
            count: 0
        }
        for (const item of authorEmails) {
            let cc1 = await Article.find({ userEmail: item })
            let cc = await Article.find({ userEmail: item })
            // console.log(cc,11);
            resObj[item] = cc
            resObj.count += cc1.length
        }

        // console.log(resObj);

        // 处理响应数据
        let articles = []
        for (const key in resObj) {
            if (key == "count") {
                continue;
            }
            for (const item of resObj[key]) {
                const { favoriteCount, favoried } = await getFavorite(item, req.user)

                let reslut = await handleArticle(item.slug, item.userEmail, favoriteCount, favoried)
                articles.push(reslut)
            }
        }


        let arr = []
        if (articles.length <= limit) {
            arr = articles
        } else {
            arr = articles.splice(offset, limit)
        }

        //响应数据
        res.status(200).json({
            status: 1,
            message: "获取关注作者的文章成功",
            data: {
                count: resObj.count,
                arr
            }
        })
    } catch (error) {
        next(error)
    }
}

// 全局文章： 条件 author(自己的文章)/ favorite(用户喜欢的文章) / tag / limit / offset ..
const getArticles = async (req, res, next) => {
    try {
        // 前端分页中有个小BUG 页面一直显示5条数据 
        // 原因已经定位 因为limit决定了 就显示5条 后续测试中考虑如何解决

        //获取参数：query =>author favorite tag  limit offset
        const { author, tag, favorite, limit = 10, offset = 0 } = req.query
        let result = {
            count: 0,
            rows: []
        };
        // console.log(author, tag, favorite, limit , offset  );
        //分场景查询
        //标签过滤文章 :tag
        if (tag && !author && !favorite) {
            let obj1 = await TagList.find({ tagName: tag })
            let obj = await TagList.find({ tagName: tag }).skip(offset).limit(limit)
            result.count = obj1.length
            result.rows = obj
        }

        //作者自己的文章 : author  使用用户的邮箱账号进行查询
        if (!tag && author && !favorite) {
            let obj1 = await Article.find({ username: author })
            let obj = await Article.find({ username: author }).skip(offset).limit(limit)
            result.count = obj1.length
            result.rows = obj
        }

        //作者文章和标签过滤 ： tag && author  过程很臃肿 有待提高
        if (tag && author && !favorite) {
            let arr1 = [];
            let arr2 = [];
            let arr3 = [];
            let obj1 = await Article.find({ username: author })
            let obj2 = await TagList.find({ tagName: tag })

            for (const item of obj1) {
                arr1.push(item.slug)
            }
            for (const item of obj2) {
                arr2.push(item.articleSlug)
            }
            arr1.forEach(v => {
                for (const item of arr2) {
                    if (v == item) {
                        arr3.push(item)
                    }
                }
            })
            for (const item of arr3) {
                let objEnd = await Article.findOne({ slug: item }).skip(offset).limit(limit)
                result.count += 1
                result.rows.push(objEnd)
            }
        }

        //作者喜欢的文章 ： favorite = 作者名
        if (!tag && !author && favorite) {
            // console.log(favorite)
            const fansName = favorite
            const fansUser = await User.findOne({ username: fansName })
            // console.log(fansUser);
            if (!fansUser) {
                throw new HttpException(401, '粉丝不存在', 'update article not found')
            }
            // 获取当前粉丝关注的所有的作者
            const GuanZhuauhtor = await Follow.find({ userEmail: fansUser.email })
            // 没有关注的作者
            if (GuanZhuauhtor.length == 0) {
                res.status(200).json({
                    status: 1,
                    message: "没有喜欢的文章",
                    data: { count: 0, articles: [] }
                })
                return
            }
            //所有关注者的email  (当前粉丝所关注的所有作者)
            let authorEmails = []
            for (const item of GuanZhuauhtor) {
                authorEmails.push(item.followerEmail)
            }

            for (const item of authorEmails) {
                let objEnd1 = await Article.find({ userEmail: item })
                // console.log(objEnd1.length);
                let cc = await Article.find({ userEmail: item }).skip(offset).limit(limit)
                result.rows.push(...cc)
                result.count += objEnd1.length
            }
        }

        // 其他情况 ：全局查询 没有具体条件 只做分页
        if (!tag && !author && !favorite) {
            let obj1 = await Article.find()
            let obj = await Article.find().skip(offset).limit(limit)
            result.count = obj1.length
            result.rows = obj
        }

        // 登录传token 不登录 不传token
        // const authHeader = req.headers.authorization
        // const authHeaderArray = authHeader.split(' ')
        // const token = authHeaderArray[1] //如果没有 ： undefined  没登陆
        // let userinfo = null
        // if (token) {
        //     userinfo = await decode(token)
        // }

        // 处理数据
        const articles = []
        for (const item of result.rows) {
            if (tag && !author && !favorite) {
                let test = await Article.findOne({ slug: item.articleSlug })
                const { favoriteCount, favoried } = await getFavorite(test, req.user)
                //req.user
                let reslut = await handleArticle(test.slug, test.userEmail, favoriteCount, favoried)
                articles.push(reslut)
            } else {
                const { favoriteCount, favoried } = await getFavorite(item, req.user)
                //req.user
                let reslut = await handleArticle(item.slug, item.userEmail, favoriteCount, favoried)
                articles.push(reslut)
            }

        }

        // 响应数据
        res.status(200).json({
            status: 1,
            message: "获取全局文章成功",
            data: {
                count: result.count,
                articles
            }
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createArticle,
    getArticle,
    updateArticle,
    deleteArticle,
    getFollowArticles,
    getFavorite,
    handleArticle,
    getArticles
}