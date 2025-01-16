const userRouter = require("../routes/users")
const followRouter = require('../routes/follow')
const tagRouter = require('../routes/tags')
const articleRouter = require("../routes/articles")
const favoriteRouter = require('../routes/favorites')
const commentRouter = require('../routes/comments')

const initRoute = (app) => {
    // app.get("/", (req, res) => {
    //     res.json({
    //         name: "hello"
    //     })
    // }) 

    // 路径问题 为什么 此处是/api/v1/users
    // 而route/users.js 中的 路径是 /
    // 我们还需要通个/api/v1/users 进行访问
    // 按照程序的执行 由APP进入逐层向下
    // 先加载/api/v1/users 后 加载 / 合并后就是  /api/v1/users/
    app.use("/api/v1/users", userRouter)
    app.use('/api/v1/follow', followRouter)
    app.use('/api/v1/tags', tagRouter)
    app.use('/api/v1/articles', articleRouter)
    app.use('/api/v1/favorites', favoriteRouter)
    app.use('/api/v1/comments', commentRouter)
}

module.exports = initRoute