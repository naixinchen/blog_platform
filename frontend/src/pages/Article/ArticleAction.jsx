import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import request from "../../request"
import { useDispatch } from "react-redux"
import { articleDeleteResult,articleFavoriteResult } from "../../store/modules/articleSlice"



let favorite_class = "btn btn-success"
let not_favorite_class = "btn btn-danger"

// ？？props
const ArticleAction = (props) => {
    let navgation = useNavigate()

    let dispatch = useDispatch()

    const { article, currentUser } = props
    const { slug, author } = article

        // 删除文章
        const deleteArticle = async () => {
            let result = await request.article.delete(slug)
            if (result.status == 1) {
                navigaton("/")
            } else {
                dispatch(articleDeleteResult(result.message))
            }
        }
    
        // 喜欢文章
        const favoriteArticle = async () => {
            let result = await request.article.favorite(slug)
            if (result.status == 1) {
                dispatch(articleFavoriteResult(result.data))
            }
            
        }
    
        // 取消喜欢
        const unfavoriteArticle = async () => {
            let result = await request.article.unfavorite(slug)
            if (result.status == 1) {
                dispatch(articleFavoriteResult(result.data))
            } 
                
        }

    if (currentUser) {
        const isMe = author && currentUser.username == author.username
        if (isMe) {
            return (
                <span>
                    <Link to={`/article/edit/${slug}`}
                        className="btn btn-outline-info">
                        <i className="iconfont icon-bianji"></i>编辑
                    </Link>
                    {""}
                    <button className="btn btn-danger"
                        onClick={() => {
                            deleteArticle(slug)
                        }}>删除<i className="iconfont icon-delete"></i>
                    </button>
                </span>
            )
        } else {
            return (
                <button className={article.favorited ? not_favorite_class :favorite_class}
                    onClick={() => {
                        if (article.favorited) {
                            unfavoriteArticle(slug)
                        } else {
                            favoriteArticle(slug)
                        }
                    }}>
                    <i className="iconfont icon-heart"></i>{article.favoriteCount}
                </button>
            )
        }
    }else{
        return <button
        onClick={()=>{
            alert("你没有登录，请返回登录，即将为您跳转")
            navgation("/")
        }}
        className="btn btn-danger">
            <i className="iconfont icon-xihuan"></i>喜欢
        </button>

        
    }
}
export default ArticleAction