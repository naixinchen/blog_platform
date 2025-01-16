// 配置项目环境
require("dotenv").config('.env')  //加载包 找到本地的env文件

// 第三方中间件
const cors = require("cors")
const morgan = require("morgan")

// 自定义中间件
const noMachMiddleware = require("./src/middleware/404middleware")
const errorMiddleware = require("./src/middleware/error.middleware")

const express = require("express")
// const initDB = require("./src/db/connection")
const initServer = require("./src/init/initServer")
const initRoute = require("./src/init/initRoute")
const app = express()

app.use(cors())  //解决跨域

app.use(express.json())  //数据解析

app.use(morgan("tiny")) //http请求日志 下方为格式
//morgan(':method :url :status :res[content-length] - :response-time ms')

initRoute(app)   //------

//静态服务
app.use(express.static('public'))

// 处理404
app.use(noMachMiddleware)

app.use(errorMiddleware)

const main = async () => {
    // await initDB()
    await initServer(app)
}

main()