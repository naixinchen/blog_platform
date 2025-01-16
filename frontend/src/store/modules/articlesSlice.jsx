import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    articles: [],
    count: 0,
    currentPage: 1,
    tags: [],
    tag: ""
}

export const articlesSlice = createSlice({
    name: "articles",

    initialState,

    reducers: {
        articleAuthorResult: (state, action) => {
            state.articles = action.payload.articles
            state.count = action.payload.count
        },
        syncCurrentPage: (state, action) => {
            return { ...state, currentPage: action.payload }
        }
    }
})

export const { articleAuthorResult, syncCurrentPage } = articlesSlice.actions

export default articlesSlice.reducer