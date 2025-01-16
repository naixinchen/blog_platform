import Item from "./Item";
import Pagination from "./Pagination";

const Articles = props => {
    // articles里面是所有的文章 isShowPage是否显示分页组件
    let { currentPage, count, onPageClick, articles, isShowPage } = props
    if (!articles) {
        return <div>正在加载...</div>
    }
    if (articles && articles.length == 0) {
        return <div>此处没有文章...</div>
    }
    return (
        <div>
            {
                // ？？？
                articles.map(article => {
                    return <Item article={article} key={article.slug} />
                })
            }
            {
                isShowPage ? <Pagination
                    count={count}
                    currentPage={currentPage}
                    onPageClick={onPageClick}
                /> : null

            }
        </div>
    )
}
export default Articles