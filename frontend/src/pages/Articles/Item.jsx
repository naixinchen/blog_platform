import { Link } from "react-router-dom";

let favorite_class = "btn btn-success"
let not_favorite_class = "btn btn-danger"

const Item = ({ article })=> {
    // console.log(article);
    return (
        <div className="article-preview">
            <div className="article-meta">
                {/* 点击头像去看作者的个人信息 */}
                <Link to={`/profile/${article.author.username}`}>
                    {/* 获取用户头像 */}
                    <img src={article.author.avatar || "http://localhost:8000/default.png"}></img>
                </Link>
                <div>
                    <Link to={`/profile/${article.author.username}`}>
                        {/* 用户的名字 */}
                        {article.author.username}
                    </Link>
                </div>
                <div className="pull-xs-right">
                    {/* 根据传来的信息 去动态显示按钮的颜色 */}
                    <button className={article.favorite ? favorite_class : not_favorite_class}>
                        <i className="iconfont icon-heart"></i>{article.favoriteCount}
                    </button>
                </div>
            </div>
            {/* 文章的基本信息 点击后会跳转到文章的详情页 */}
            {/* 根据props写跳转到哪里 */}
            <Link to={"/article/" + article.slug} className="preview-link">
                <h5>{article.title}</h5>
                <p>{article.description}</p>
                <span>阅读更多...</span>
                <ul>
                    {
                        article.tags.map(tag => {
                            return (
                                <li
                                    style={{marginRight: "4px"}}
                                    className="btn btn-secondary btn-sm"
                                    key={tag}>{tag}
                                </li>
                            )
                        })
                    }
                </ul>
            </Link>
        </div>
    )
}

export default Item