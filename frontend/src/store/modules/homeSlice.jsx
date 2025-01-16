import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import request from "../../request"

const initialState = {
    count: 0,
    currentPage: 1,
    tab: "all",
    tags: [],
    tag: null,
    articles: []
}

export const getTags = createAsyncThunk("home/getTags", async () => {
    const response = await request.tag.getAll()
    return response.data
})

export const getTabArticles = createAsyncThunk("home/getTabArticles", async (msg, action) => {
    // 此时 也要获取 homeSlice中的tab数据
    let { tab, currentPage, tag } = action.getState().home

    let result = {}
    if (tab) {
        if (tab == "all") {
            result = await request.article.getAll(currentPage)
        }
    }

    if (tag) {
        result = await request.article.byTag(tag, currentPage)
    }
    return result.data
})

export const homeSlice = createSlice({
    name: "home",

    initialState,

    reducers: {
        syncTag: (state, action) => {
            return { ...state, tag: action.payload }
        },
        syncTab: (state, action) => {
            return { ...state, tab: action.payload }
        },
        syncCurrentPage: (state, action) => {
            return { ...state, currentPage: action.payload }
        },
        onUnload: () => {
            return { ...initialState }
        }
    },
    extraReducers: builder => {
        builder.addCase(getTags.fulfilled, (state, action) => {
            const tags = action.payload
            return { ...state, tags }
        }).addCase(getTabArticles.fulfilled, (state, action) => {
            return { ...state, ...action.payload }
        })
    }
})

export const { syncTag, syncTab, syncCurrentPage, onUnload } = homeSlice.actions

export default homeSlice.reducer