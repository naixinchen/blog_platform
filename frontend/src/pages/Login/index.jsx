import { memo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Errors from "../../components/Errors";
import { useDispatch, useSelector } from "react-redux";
import { 
    loginFiledUpdate,
    onUnload,
    loginSubmit
} from "../../store/modules/loginSlice";

import request from "../../request";

const Login = memo(() => {

    // ？？？？？
    let { email, username, errors, password } = useSelector((state) => {
        return state.login
    })
    let dispatch = useDispatch()

    useEffect(() => {
        return () => {
            dispatch(onUnload())
        }
    }, [])
    let navigate = useNavigate()

    // 声明一个表单提交方法
    let toNavigate = async (e) => {
        e.preventDefault()
        try {
            // 声明一个变量存储值
            let result = await request.user.login(email, password)
            console.log(result);
            dispatch(loginSubmit(result))
            if (result.status === 1) {
                navigate("/")
            }
        } catch (error) {
            let err = "程序内部有问题"
            dispatch(loginSubmit(err))
        }
    }
    return (
        <div className="container page">
            <div className="row">
                <div className="col-md-6 offset-md-3 col-xs-12">
                    <h1 className="text-xs-center">登录</h1>
                    <p className="text-xs-center">
                        <Link to={"/regist"}>没有账号去注册?</Link>
                    </p>
                    <Errors errors={errors} />
                    <form onSubmit={toNavigate}>
                        <fieldset className="form-group">
                            <input
                                value={email}
                                type="text"
                                placeholder="用户邮箱"
                                className="form-control form-control-lg"
                                onChange={(e) => dispatch(loginFiledUpdate(
                                    { key: "email", value: e.target.value }))}>
                            </input>
                        </fieldset>
                        <fieldset className="form-group">
                            <input
                                value={password}
                                type="password"
                                placeholder="用户密码"
                                className="form-control form-control-lg"
                                onChange={(e) => dispatch(loginFiledUpdate(
                                    { key: "password", value: e.target.value }))}>
                            </input>
                        </fieldset>
                        <button
                            className="btn btn-success"
                            type="submit"
                        >登录</button>
                    </form>
                </div>
            </div>
        </div>
    )
})

export default Login