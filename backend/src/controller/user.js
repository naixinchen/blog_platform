const HttpException = require("../exception/http.exception")
const { validateCreateUser, validateLoginUser } = require("../utils/validate/user.vaildate")
const User = require("../model/user")
const { md5Password, matchPassword } = require("../utils/md5")
const { sign } = require("../utils/jwt")
const Follower = require("../model/followers")

// 注册
const createUser = (req, res, next) => {
    try {
        // 01获取数据
        const { email, username, password } = req.body.user

        // 02验证数据   --  检查数据是否合理
        const { error, validate } = validateCreateUser(email, username, password)

        if (!validate) {
            throw new HttpException(401, "用户提交的数据校验失败", error)
        }

        // 03 查询用户名或邮箱是否存在
        User.find({
            $or: [
                { email },
                { username }
            ]
        }, (err, data) => {
            try {
                if (err) {
                    throw new HttpException(401, "数据库查询失败", err)
                }
                if (data.length !== 0) {
                    throw new HttpException(401, "用户或邮箱已存在", "username or email already resigt")
                }
            } catch (error) {
                next(error)
                return
            }

            // 04 用户密码加密  单向加密   --  md5
            const md5PWD = md5Password(password)

            let UserInfo = {
                email,
                username,
                password: md5PWD
            }

            new User(UserInfo).save().then((data, err) => {
                if (data) {
                    return res.status(200).json({
                        status: 1,
                        message: "注册用户成功",
                        data: {
                            email: data.email,
                            username: data.username
                        }
                    })
                }
                if (err) {
                    return res.status(500).json({
                        code: 3000,
                        message: "存储失败,请联系后台"
                    })
                }
            })

        })

    } catch (error) {
        // error 是HttpException 的实例
        next(error)
    }
}

// 登录
const loginUser = async (req, res, next) => {
    try {
        let UserInfo;
        //01 获取数据 ： 邮箱 密码
        const { email, password } = req.body.user

        //02 验证数据
        const { error, validate } = validateLoginUser(email, password)
        if (!validate) {
            throw new HttpException(401, '用户提交数据校验失败', error)
        }

        //03 验证账号是否存在 ： 验证邮箱账号
        User.find({ email }, (err, data) => {
            try {
                if (err) {
                    throw new HttpException(401, "数据库查询失败", err)
                }
                if (data.length == 0) {
                    throw new HttpException(401, "用户不存在", "user not found")
                }

                //04 验证密码 ： 登录密码和账号对应的数据密码比较
                // 利用解构赋值 把数据库中存储的密码取出来
                let [{ password: oldMD5PWD }] = data
                let match = matchPassword(oldMD5PWD, password)
                if (!match) {
                    throw new HttpException(401, '用户密码不匹配', 'password not match')
                }

                //05 生成token : 给客户端发布令牌（标记）
                // client --login-> server (token)  钥匙（secrect）
                // client (token) -header->server 钥匙解锁
                // 根据密钥生成token ; 根据密钥验证token；
                const [{ username }] = data

                sign(email, username).then(msg => {
                    //06 响应数据 ： 响应用户信息 + token 注意：去除密码
                    // 使用UserInfo 缓存数据 屏蔽密码
                    let [{ avatar, bio }] = data
                    UserInfo = {
                        email,
                        username,
                        token: msg,
                        avatar,
                        bio
                    }

                    res.status(200).json({
                        status: 1, // 合理  
                        message: '登录用户成功',
                        data: UserInfo
                    })
                }).catch((err) => {
                    res.status(200).json({
                        status: 1, // 合理  
                        message: '登录用户失败',
                        data: err
                    })
                })
            } catch (error) {
                next(error)
                return
            }
        })

    } catch (error) {
        //07 捕获错误  ： 统一错误中间件处理
        next(error)
    }
}

// 获取用户 : token 
const getUser = async (req, res, next) => {
    try {
        // 01 获取用户邮箱
        const { email } = req.user

        // 获取用户信息
        User.find({ email }, (err, data) => {
            try {
                if (err) {
                    throw new HttpException(401, "数据库查询失败", err)
                }
                if (data.length == 0) {
                    throw new HttpException(401, "用户不存在", "user not found")
                }

                const [{ username }] = data
                let UserInfo = {
                    email,
                    username,
                }

                res.status(200).json({
                    status: 1,
                    message: '获取用户成功',
                    data: UserInfo
                })

            } catch (error) {
                next(error)
                return
            }
        })
    } catch (error) {
        next(error)
    }
}

// 获取用户 : username
const getUserByUsername = async (req, res, next) => {
    try {
        // 01 获取用户username
        const username = req.params.username
        // 验证
        if (!username) {
            throw new HttpException(404, '请求用户名参数不存在', 'username not found')
        }

        // 获取用户信息
        const user = await User.findOne({ username })

        if (!user) {
            throw new HttpException(401, '用户不存在', 'user not found')
        }

        //当前登录用户是否是粉丝 => 是否已经关注
        //当前登录者为张三1 查看他 是否关注了 C
        let { email } = req.user

        let follower = await Follower.find({ userEmail: email })

        // console.log(follower);

        let following = false
        let followers = []

        for (const item of follower) {
            // console.log(item);
            if (user.email === item.followerEmail) {
                following = true
                let followUser = await User.findOne({ email: item.followerEmail })
                // 拿到被关注人的信息
                followers.push({
                    email: followUser.email,
                    username: followUser.username,
                    bio: followUser.bio,
                    avatar: followUser.avatar
                })
            }
        }

        const profile = {
            username: user.username,
            bio: user.bio,
            avatar: user.avatar,
            following,
            followers
        }

        //响应数据
        res.status(200).json({
            status: 1,
            message: '获取用户成功',
            data: profile
        })
    } catch (error) {
        next(error)
    }
}

//更新用户 ： 得登录（authMiddleware），
const updateUser = async (req, res, next) => {
    try {

        //01 获取数据 ： 账号email
        const { email } = req.user

        //02 获取更新数据：body.user
        const bodyUser = req.body.user
        if (!bodyUser) {
            throw new HttpException(401, '需要提交更新数据', 'update user info is required')
        }

        // 03 更新账号：是否存在
        User.findOne({ email }, async (err, data) => {
            try {
                if (err) {
                    throw new HttpException(401, "数据库查询失败", err)
                }
                if (data.length == 0) {
                    throw new HttpException(401, "用户不存在", "user not found")
                }

                //04 校验更新数据
                // 保证用户名没有被占用
                // const { username } = bodyUser

                // if (data.username == username) {
                //     throw new HttpException(401, '用户名已占用', 'username already exist')
                // }

                // 05 重新生成token : 因为信息已经改变
                const token = await sign(email, bodyUser.username)

                // 06是否有密码传入   ---  是否可以不更改密码
                let password = bodyUser.password ? md5Password(bodyUser.password) : data.password

                bodyUser.password = password
                // 07将更新的数据传入数据库
                User.findOneAndUpdate({ email }, bodyUser, (err, data) => {
                    if (err) {
                        throw new HttpException(401, "数据库更新失败", err)
                    }
                    // console.log(bodyUser);
                    // 响应回客户端
                    let userInfo = {
                        email,
                        username: bodyUser.username,
                        token,
                        avatar: bodyUser.avatar,
                        bio: bodyUser.bio
                    }
                    res.status(200).json({
                        status: 1,
                        message: '更新用户成功',
                        data: userInfo
                    })
                });
                // 此处还有个小BUG 更新后 文章并没有跟着更新 以及喜欢信息没有更新

            } catch (error) {
                next(error)
                return
            }
        })

    } catch (error) {
        next(error)
    }
}

module.exports = {
    createUser,
    loginUser,
    getUser,
    updateUser,
    getUserByUsername
}