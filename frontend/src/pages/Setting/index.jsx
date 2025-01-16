import Errors from "../../components/Errors";
import { memo } from "react";
import SettingFrom from "./SettingFrom";
import { userLogOut } from "../../store/modules/settingSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

let Setting = () => {
    let dispatch = useDispatch()
    let navigate = useNavigate()
    const logout = () => {
        dispatch(userLogOut())
        navigate("/login")
    }
    return (
        <div className="container page">
            <div className="row">
                <div className="col-md-6 offset-md-3 col-xs-12">
                    <h1 className="text-xs-center">设置</h1>
                    <Errors errors={null} />

                    <SettingFrom />
                    <button
                        onClick={logout}
                        className="btn btn-danger pull-xs-right">退出</button>
                </div>
            </div>
        </div>
    )
}
export default memo(Setting)