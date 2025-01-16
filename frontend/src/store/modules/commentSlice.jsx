import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import request from "../../request";

const initialState = {
    body: "",
    comments: [],
    errors: null
}


export const createComment = createAsyncThunk("comment/create", async ({ slug, body }) => {
    const response = await request.comment.create(slug, body)
    return response.data
})

export const initComment = createAsyncThunk("comment/init", async slug => {
    const response = await request.comment.get(slug)
    return response.data
})

export const deleteComment = createAsyncThunk("comment/delete",async({slug,id})=>{
    await request.comment.delete(slug,id)
    return id
})

export const commentSlice = createSlice({
    name: "comment",

    initialState,

    reducers: {
        commentFiledUpdate: (state, action) => {
            let key = action.payload.key
            let value = action.payload.value
            state[key] = value
        },
    },
    // 配合createAsyncThunk使用 builder表示对上方createAsyncThunk的监听
    // 监听createComment完成（fulfilled）完成状态时执行回调 
    // 为了更新数据到初始值中用let更改值
    extraReducers: builder => {
        builder.addCase(createComment.fulfilled, (state, action) => {
            let comment = action.payload
            let newComments = state.comments.concat([comment])
            return { ...state, comments: newComments, body: "" }
        }). addCase(initComment.fulfilled, (state, action) => {
            let newComments = action.payload
            return { ...state, comments: newComments, body: "" }
        }). addCase(deleteComment.fulfilled, (state, action) => {
            const deletedId = action.payload
            const deleteResult =state.comments.filter(item=>{
                return item.id!==deletedId
            })
            return { ...state, comments: deleteResult, body: "" }
        })
    }
})

export const { commentFiledUpdate } = commentSlice.actions

export default commentSlice.reducer