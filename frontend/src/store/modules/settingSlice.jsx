import { createSlice } from "@reduxjs/toolkit";
import { savaData, getData, deleteData } from "../../utils/localStorage";

const initUser = () => {
    const currentUser = getData("currentUser")
    if (currentUser) {
        return currentUser
    } else {
        return null
    }
}
const initToken = () => {
    const token = getData("token")
    if (token) {
        return token
    } else {
        return null
    }
}


const initialState = {
    ...initUser(),
    errors: "",
    currentUser: initUser(),
    token: initToken()
}

export const settingSlice = createSlice({
    name: "setting",

    initialState,

    reducers: {
        settingFiledUpdate: (state, action) => {
            let key = action.payload.key
            let value = action.payload.value
            state[key] = value
        },
        // 退出方法
        userLogOut: () => {
            deleteData("currentUser")
            deleteData("token")
        },
        // 更新方法
        userUpdate: (state, action) => {
            if (action.payload.status === 1) {
                let currentUser = action.payload.data
                let token = action.payload.data.token

                // 回传到localStorage
                savaData("currentUser", currentUser)
                savaData("token", token)
                state = { ...state, ...initUser() }
            } else {
                state.errors = action.payload.message
            }
        },
        onUnload:(state)=>{
            return{
                ...state,
                ...initUser(),
                errors:"",
                currentUser:initUser(),
                token:initToken()
            }
        }
    }
})
export const { settingFiledUpdate, userLogOut, userUpdate,onUnload } = settingSlice.actions
export default settingSlice.reducer