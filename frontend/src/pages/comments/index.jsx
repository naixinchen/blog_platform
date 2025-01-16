import { PureComponent } from "react"
import { connect } from "react-redux"
import { commentFiledUpdate, createComment, initComment, deleteComment } from "../../store/modules/commentSlice"
import { Link } from "react-router-dom"
import CommentList from "./CommentList"

class Comments extends PureComponent {

    createComment = (e) => {
        e.preventDefault()
        const slug = this.props.slug
        const body = this.props.body
        this.props.createComment({ slug, body })
    }
    deleteComment = (slug, id) => {
        this.props.deleteComment({ slug, id })
    }

    render() {
        const { currentUser, body, comments, slug } = this.props
        console.log(comments);
        if (!currentUser) {
            // 未登录
            return (
                <div className="col-md-6 offset-md-3 col-xs-12">
                    <p>
                        <Link to={"/login"}>登录</Link>
                        &nbsp; or &nbsp;
                        <Link to={"/regist"}>注册</Link>
                    </p>
                </div>
            )
        } else {
            return (
                <div className="col-md-6 offset-md-3 col-xs-12">
                    <form className="card comment-form" onSubmit={this.createComment}>
                        <div className="card-block">
                            <textarea
                                value={body || ""}
                                placeholder="发表评论"
                                className="form-control"
                                rows={3}
                                onChange={(e) => {
                                    this.props.commentFiledUpdate({ key: "body", value: e.target.value })
                                }}>
                            </textarea>
                        </div>
                        <div className="card-footer">
                            <img
                                className="comment-author-img"
                                src={currentUser && currentUser.avatar || "http://localhost:8000/default.png"}></img>
                            <button
                                type="submit"
                                className="btn btn-success">提交</button>
                        </div>
                    </form>
                    <CommentList
                        comments={comments}
                        currentUser={currentUser}
                        deleteComment={this.deleteComment}
                        slug={slug}></CommentList>
                </div>
            )
        }
    }
    componentDidMount() {
        const { slug } = this.props
        this.props.initComment(slug)
    }
}



const mapState = state => {
    return { ...state.comment }
}
const mapDispatch = (dispatch) => ({
    commentFiledUpdate: (key, value) => dispatch(commentFiledUpdate(key, value)),
    createComment: (slug, body) => dispatch(createComment(slug, body)),
    initComment: (slug) => dispatch(initComment(slug)),
    deleteComment: (slug, id) => dispatch(deleteComment(slug, id))
})

export default connect(mapState, mapDispatch)(Comments)
