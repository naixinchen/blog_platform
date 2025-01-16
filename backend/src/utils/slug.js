const uniqueSlug = require('unique-slug')

const getSlug = () => {
    let randomSlug = uniqueSlug()
    return randomSlug
}

module.exports = getSlug