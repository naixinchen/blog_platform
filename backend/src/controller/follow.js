const HttpException = require("../exception/http.exception")
const User = require('../model/user')
const Follow = require("../model/followers")

// 控制器 ： 添加关注 ： A（登录用户：关注者）关注 B（被关注者） 
const follow = async (req, res, next) => {
    try {
        //00 验证登录 =>authMiddleware

        //01 获取被关注者 
        //获取username
        const beFollowUsername = req.params.username

        //通过获取的被关注者查询数据库中是否存在
        let beFollower = await User.findOne({ username: beFollowUsername })
        if (!beFollower) {
            throw new HttpException(401, '被关注的用户不存在', 'user with this username not found')
        }

        //02 获取关注者
        // 获取登录用户email  --  通过  token 自动获取的登录的用户
        const folllowerEmail = req.user.email
        // 通过email查询数据库中是否存在此用户
        let follower = await User.findOne({ email: folllowerEmail })
        if (!follower) {
            throw new HttpException(401, '登录用户不存在', 'user  not found')
        }

        //03 关注的规则判断：自己不能关注自己
        if (beFollower.email === folllowerEmail) {
            throw new HttpException(401, '用户不能关注自己', 'user  can not follow yourself')
        }

        // 存入数据库之前先查询一次 查看表中是否有重复数据
        // 如果有则不在存入 如果没有则存入数据中
        let result = await Follow.findOne({ userEmail: folllowerEmail, followerEmail: beFollower.email })

        if (!result) {
            await Follow.insertMany({ userEmail: folllowerEmail, followerEmail: beFollower.email })
        }

        res.status(200).json({
            status: 1,
            message: '关注成功',
            data: {
                email: beFollower.email,
                username: beFollower.username, 
                avatar: beFollower.avatar,
                bio: beFollower.bio,
                following:true
            }
        })

    } catch (error) {
        next(error)
    }
}

// 控制器 ： 取消关注
const unfollow = async (req, res, next) => {
    try {
        //00 验证登录 =>authMiddleware

        //01 获取被关注者 
        //获取username
        const beFollowUsername = req.params.username

        //通过获取的被关注者查询数据库中是否存在
        let beFollower = await User.findOne({ username: beFollowUsername })
        if (!beFollower) {
            throw new HttpException(401, '被关注的用户不存在', 'user with this username not found')
        }

        //02 获取关注者
        // 获取登录用户email
        const folllowerEmail = req.user.email
        // 通过email查询数据库中是否存在此用户
        let follower = await User.findOne({ email: folllowerEmail })
        if (!follower) {
            throw new HttpException(401, '登录用户不存在', 'user  not found')
        }

        // 存入数据库之前先查询一次 查看表中是否有重复数据
        // 如果有则不在存入 如果没有则存入数据中
        let result = await Follow.findOne({ userEmail: folllowerEmail, followerEmail: beFollower.email })

        if (result) {
            await Follow.remove({ userEmail: folllowerEmail, followerEmail: beFollower.email })
        }

        res.status(200).json({
            status: 1,
            message: '取消关注',
            data: {
                email: beFollower.email,
                username: beFollower.username, 
                avatar: beFollower.avatar,
                bio: beFollower.bio,
                following:false
            }
        })

    } catch (error) {
        next(error)
    }
}


module.exports = {
    follow,
    unfollow
}