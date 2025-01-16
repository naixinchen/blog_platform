import { shallowEqual, useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import request from "../../request"
import { followResult, getProfile } from "../../store/modules/profileSlice"
import { useEffect, useState } from "react"
import ButtonInfo from "./buttonInfo"
import { articleAuthorResult, syncCurrentPage } from "../../store/modules/articlesSlice"
import article from "../../request/article"
import Item from "../Articles/Item"
import Pagination from "../Articles/Pagination"
import Articles from "../Articles"

const Profile = () => {

    let { username } = useParams()

    const profile = useSelector((state) => {
        return state.profile
    }, shallowEqual)

    const currentUser = useSelector((state) => {
        return state.login.currentUser
    }, shallowEqual)

    // 判断是不是自己的主页
    const isCurrentUser = currentUser && currentUser.username === profile.username

    let dispatch = useDispatch()

    // 获取所有人员信息
    let getUserInfo = () => {
        request.user.get(username).then(res => {
            if (res.status == 1) {
                // ？？？？
                dispatch(getProfile(res.data))
            } else {
                dispatch(getProfile(res.message))
            }
        })
    }

    // 添加关注
    let follow = async () => {
        try {
            let result = await request.user.follow(username)//？？
            dispatch(followResult(result.data))
        } catch (error) {
            let errors = "程序内部有问题"
            dispatch(followResult(errors))
        }
    }

    // 取消关注
    let unfollow = async () => {
        try {
            let result = await request.user.unfollow(username)
            dispatch(followResult(result.data))
        } catch (error) {
            let errors = "程序内部有问题"
            dispatch(followResult(errors))
        }
    }

    // 获取自己的文章
    let getAuthorArticle = (pageNum = 1) => {
        request.article.getAuthor(username, pageNum).then((res) => {
            console.log(res);
            if (res.status === 1) {
                dispatch(articleAuthorResult(res.data))
            }
        })
    }

    // 获取喜欢的文章
    let getFavoriteArticle = (pageNum = 1) => {
        request.article.getFavorite(username, pageNum).then((res) => {
            console.log(res);
            if (res.status === 1) {
                dispatch(articleAuthorResult(res.data))
            }
        })
    }

    const articlesSlice = useSelector((state) => {
        return state.articlesSlice
    }, shallowEqual)
    // 按钮点哪个显示哪个
    let [tab, setTab] = useState(1)

    let handleClick = (pageNum) => {
        dispatch(syncCurrentPage(pageNum))
        if (tab == 1) {
            getAuthorArticle(pageNum)
        } else if (tab == 2) {
            getFavoriteArticle(pageNum)
        }
    }

    useEffect(() => {
        getUserInfo()
        getAuthorArticle()
        return () => {
        }
    }, [username, profile.username])
    return (
        <div className="profile-page">
            <div className="user-info">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 offset-md-12 col-xs-12">
                            <img src={profile.avatar || "http://localhost:8000/default.png"}
                                style={{ width: 100, height: 100 }}></img>
                            <h4>{profile.username}</h4>
                            <p style={{ color: "black" }}>{profile.bio}</p>

                            <ButtonInfo profile={profile}
                                isCurrentUser={isCurrentUser}
                                follow={follow}
                                unfollow={unfollow} />

                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row">
                    <div className="col-md-12 offset-md-12 col-xs-12">
                        {/* 选项卡 */}
                        <div className="articles-toggle">
                            <ul className="nav navbar-nav clearfix">
                                <li className="nav nav-item">
                                    <button
                                        onClick={
                                            () => {
                                                setTab(1)
                                                getAuthorArticle()
                                            }
                                        }
                                        className={tab == 1 ? "btn btn-outline-success active" : "btn btn-outline-success"}>
                                        我的文章
                                    </button>
                                </li>
                                <li className="nav nav-item">
                                    <button
                                        onClick={
                                            () => {
                                                setTab(2)
                                                getFavoriteArticle()
                                            }
                                        }
                                        className={tab == 2 ? "btn btn-outline-success" : "btn btn-outline-success"}>
                                        关注人的文章
                                    </button>
                                </li>
                            </ul>
                        </div>
                        {/* 文章的列表 */}
                        <Articles
                            articles={articlesSlice.articles}
                            count={articlesSlice.count}
                            currentPage={articlesSlice.currentPage}
                            isShowPage={true}
                            onPageClick={handleClick}

                        />


                        {/* {
                            articlesSlice.articles.map(article => {
                                return <Item key={article.slug} article={article} />
                            })
                        }
                        <Pagination
                            count={articlesSlice.count}
                            currentPage={articlesSlice.currentPage} /> */}

                    </div>
                </div>
            </div>
        </div>
    )
}
export default Profile