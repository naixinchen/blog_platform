const HttpException=require("../exception/http.exception")

const noMachMiddleware = (req, res, next) => {
    // res.status(404).json({
    //     message: "url not found"
    // })

    const noMachError=new HttpException(404,"访问路径不存在","route url not fond")
    // 此处为 自身不处理 任何事物
    // 交给下一个中间件去处理---->统一错误处理中间件
    next(noMachError)
}

module.exports = noMachMiddleware