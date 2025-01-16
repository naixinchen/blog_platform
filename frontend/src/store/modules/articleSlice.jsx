import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    title: "",
    description: "",
    body: "",
    tags: [],
    tag: "",
    errors: null
}

export const articleSlice = createSlice({
    name: "article",
    initialState,
    reducers: {
        articleFiledUpdate: (state, action) => {
            let key = action.payload.key
            let value = action.payload.value
            state[key] = value
        },
        // 添加标签的方法
        articleAddTag: (state) => {
            const tags = state.tags.concat([state.tag])
            return { ...state, tags, tag: "" }
        },
        // 删除标签的方法
        articleRemoveTag: (state, action) => {
            let removeTag = action.payload
            let filterTags = state.tags.filter(tag => {
                return tag !== removeTag
            })
            return { ...state, tags: filterTags }
        },

        // 创建文章
        articleResult: (state, action) => {
            state.errors = action.payload
        },
        onUnload: () => {
            return { ...initialState }
        },
        // 获取文章详细信息
        ArticleBySlugResult: (state, action) => {
            return { ...state, ...action.payload }
        },

        // 喜欢和取消喜欢文章

        articleDeleteResult: (state, action) => {
            state.errors = action.payload
        },
        articleFavoriteResult: (state, action) => {
            return { ...state, ...action.payload }
        }
    }
})

export const { articleFiledUpdate,
    articleAddTag,
    articleRemoveTag,
    articleResult,
    onUnload,
    ArticleBySlugResult,
    articleDeleteResult,
    articleFavoriteResult } = articleSlice.actions

export default articleSlice.reducer