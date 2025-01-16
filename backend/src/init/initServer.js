const initServer = async (app) => {
    return new Promise((resolve, reject) => {
        const PORT = process.env.PORT || 8000
        const HOST = process.env.HOST || localhost

        app.listen(PORT, () => {
            console.log(`server is running on http://${HOST}:${PORT}`);
            resolve()
        }).on("error", (error) => {
            console.log("服务器启动失败", error);
            reject()
        })
    })
}

module.exports = initServer