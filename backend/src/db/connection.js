// const mongoose = require('mongoose');

// const initDB = async () => {
//     return new Promise((resolve, reject) => {
//         try {
//             mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`);
//             console.log(`数据库连接成功:${process.env.DB_NAME}`);
//         } catch (error) {
//             console.log("数据库连接失败", error);
//             reject()
//         }
//     }) 
// }

// module.exports = initDB