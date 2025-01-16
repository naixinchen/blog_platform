import { Link } from "react-router-dom";

const ButtonInfo = props => {
    // ？？？？
    const { profile, isCurrentUser, follow, unfollow } = props

    let handleClick = (e) => {
        e.preventDefault()
        if (profile.following) {
            unfollow(profile.username)
        } else {
            follow(profile.username)
        }
    }
    if (isCurrentUser) {
        return (
            <Link
                to={"/setting"}
                className="btn btn-outline-success">
                编辑<i className="iconfont icon-bianji" style={{ fontSize: 19 }}></i>
            </Link>
        )
    } else {
        return <button
            onClick={handleClick}
            className={profile.following ? "btn btn-danger" : "btn btn-success"}>
            {profile.following ? "取消关注" : "添加关注"}<i className="iconfont icon-heart" style={{ fontSize: 18 }}></i>
        </button>
    }
}
export default ButtonInfo