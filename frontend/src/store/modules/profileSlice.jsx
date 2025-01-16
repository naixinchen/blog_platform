import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username: "",
    bio: "",
    avatar: "",
    errors: null,
    following: false,
    followers: []
}

export const profileSlice = createSlice({
    name: "profile",

    initialState,

    reducers: {
        getProfile: (state, action) => {
            return { ...state, ...action.payload }
        },
        followResult: (state, action) => {
            return {...state, ...action.payload}
        }
    }
})

export const { getProfile, followResult } = profileSlice.actions

export default profileSlice.reducer