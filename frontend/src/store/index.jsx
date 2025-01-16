import {configureStore} from "@reduxjs/toolkit"
import registSlice from "./modules/registSlice"
import loginSlice from "./modules/loginSlice"
import settingSlice from "./modules/settingSlice"
import profileSlice from "./modules/profileSlice"
import articleSlice from "./modules/articleSlice"
import articlesSlice from "./modules/articlesSlice"
import commentSlice from "./modules/commentSlice"
import homeSlice from "./modules/homeSlice"

export default configureStore({
    reducer:{
        regist:registSlice,
        login:loginSlice,
        setting:settingSlice,
        profile:profileSlice,
        article:articleSlice,
        articlesSlice,
        comment:commentSlice,
        home:homeSlice
    }
})