const md5 = require('md5')

const SALT = 'salt2'

// 加密
const md5Password = (password) => {
    const md5PWD = md5(password + SALT)
    return md5PWD
}

// 密码匹配
// 登录场景 ： oldMD5PWD , newPWD
const matchPassword = (oldMD5PWD, newPWD) => {
    let newMD5PWD = md5Password(newPWD)
    // console.log(newMD5PWD,22);
    if (newMD5PWD === oldMD5PWD) {
        return true
    }
    return false
}

module.exports = { md5Password, matchPassword }


