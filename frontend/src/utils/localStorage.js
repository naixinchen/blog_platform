// 存储
export const savaData = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
}

// 获取
export const getData = (key) => {
    return JSON.parse(localStorage.getItem(key))
}

// 删除
export const deleteData = (key) => {
    return localStorage.removeItem(key)
}