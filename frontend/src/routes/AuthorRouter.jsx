import { getData } from "../utils/localStorage";
import { Navigate } from "react-router-dom";

function AuthRouter({children}){
    const token = getData("token")
    if(token){
        return<>{children}</>
    }else{
        return<Navigate to="/login"/>
    }
}

export default AuthRouter