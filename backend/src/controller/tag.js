const HttpException = require("../exception/http.exception")
const Tag = require("../model/tag")

const createTag = async (req, res, next) => {
    try {

        const tag = req.body.tag
        // TODO ：校验
        if (!tag) {
            throw new HttpException(401, 'tag 标签必须传递', 'tag not found')
        }

        const result = await Tag.insertMany({ name: tag })
        // tag表只有一个字段 name 且是唯一的再次存储会抛出异常

        res.status(200).json({
            status: 1,
            message: '创建标签成功',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const getTags = async (req, res, next) => {
    try {
        const tagAll = await Tag.find()
        // console.log(tagAll); // [{name:'react'},{name:'css'}]

        const tags = []
        if (tagAll.length > 0) {
            for (const tag of tagAll) {
                tags.push(tag.name)
            }
        }

        res.status(200).json({
            status: 1,
            message: '获取所有标签成功',
            data: tags
        })
    } catch (error) {
        next(error)
    }
}

const deleteTag = async (req, res, next) => {
    try {
        const tag = req.params.tag
        // TODO ：校验

        await Tag.deleteMany({ name: tag })

        res.status(200).json({
            status: 1,
            message: '删除标签成功'
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createTag,
    deleteTag,
    getTags
}