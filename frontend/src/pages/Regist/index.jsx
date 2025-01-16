import { memo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Errors from "../../components/Errors";
import { useSelector, useDispatch } from "react-redux"
import { registFiledUpdate, registSubmit, onUnload } from "../../store/modules/registSlice";
import request from "../../request"

const Regist = memo(() => {

    // ？？？？？
    let { email, username, password, errors } = useSelector((state) => {
        return state.regist
    })

    let dispatch = useDispatch()

    let navigate = useNavigate() 

    let toNavigate = async (e) => {
        // 清除form表单自动提交的效果
        e.preventDefault()
        try {
            // 拿到数据 
            let result = await request.user.regist({ email, username, password })
            console.log(result);
            if (result.status === 1) {
                navigate("/login")
            } else {
                dispatch(registSubmit(result.message))
            }
        } catch (error) {
            let err = "程序内部有问题"
            dispatch(registSubmit(err))
        }
    }

    useEffect(() => {
        return () => {
            dispatch(onUnload())
        }
    }, [])
    return (
        <div className="container page">
            <div className="row">
                <div className="col-md-6 offset-md-3 col-xs-12">
                    <h1 className="text-xs-center">注册</h1>
                    <p className="text-xs-center">
                        <Link to={"/login"}>有账号直接登录?</Link>
                    </p>
                    <Errors errors={errors} />
                    <form onSubmit={toNavigate}>
                        <fieldset className="form-group">
                            <input
                                value={email}
                                type="text"
                                placeholder="用户邮箱"
                                className="form-control form-control-lg"
                                onChange={(e) => dispatch(registFiledUpdate({
                                    key: "email",
                                    value: e.target.value
                                }))}>
                            </input>
                        </fieldset>
                        <fieldset className="form-group">
                            <input
                                value={username}
                                type="text"
                                placeholder="用户昵称"
                                className="form-control form-control-lg"
                                onChange={(e) => dispatch(registFiledUpdate({
                                    key: "username",
                                    value: e.target.value
                                }))}>
                            </input>
                        </fieldset>
                        <fieldset className="form-group">
                            <input
                                value={password}
                                type="password"
                                placeholder="用户密码"
                                className="form-control form-control-lg"
                                onChange={(e) => dispatch(registFiledUpdate({
                                    key: "password",
                                    value: e.target.value
                                }))}>
                            </input>
                        </fieldset>
                        <button
                            className="btn btn-success"
                            type="submit"
                        >注册</button>
                    </form>
                </div>
            </div>
        </div>
    )
})

export default Regist