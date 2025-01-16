import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { onUnload, ArticleBySlugResult, articleDeleteResult } from "../../store/modules/articleSlice";
import request from "../../request";
import ArticleAction from "./ArticleAction";
import article from "../../request/article";
import { marked } from "marked"
import Comments from "../comments";

function Article() {
    const { slug } = useParams()

    let dispatch = useDispatch()

    // 通过文章别名获取文章信息
    let getArticleBySlug = async (routeSlug) => {
        let result = await request.article.get(routeSlug)
        console.log(result);
        if (result.status == 1) {
            dispatch(ArticleBySlugResult(result.data))
        } else {
            dispatch(ArticleBySlugResult(result.message))
        }
    }

    useEffect(() => {
        getArticleBySlug(slug)
        return () => {
            dispatch(onUnload())
        }
    }, [])

    let article = useSelector((state) => {
        return state.article
    })

    let currentUser = useSelector((state) => {
        return state.login.currentUser
    })

    const { title, description, body, tags, author } = article

    if (!body) {
        return null
    }

    const markData = body
    const markHtml = marked.parse(markData, { sanitize: true })
    const markObj = { __html: markHtml }

    return (
        <div className="article-page">
            {/* 文章的信息 */}
            <div className="banner">
                <div className="container">
                    <h1>{article.title}</h1>
                    <div className="article-meta">
                        <div className="info">
                            <Link to={`/profile/${author && author.username}`}>
                                <img src={(author && author.avatar) || "http://localhost:8000/default.png"}></img>
                            </Link>
                        </div>
                        <div className="info">
                            <Link to={`/profile/${author && author.username}`}>
                                {author && author.username}
                            </Link>
                        </div>
                        <ArticleAction article={article} currentUser={currentUser} />
                    </div>
                </div>
            </div>

            {/* 文章主体 */}
            <div className="row article-counter">
                <div className="col-xs-10">
                    <div dangerouslySetInnerHTML={markObj}></div>
                    <ul className="tag-list">
                        {
                            tags.map(tag => {
                                return <li key={tag}
                                    className="btn btn-secondary btn-sm">
                                    {tag}
                                </li>
                            })
                        }
                    </ul>
                </div>
            </div>

            {/* 文章的评论 */}
            <Comments currentUser={currentUser} slug={slug} />
        </div>

    )
}
export default Article