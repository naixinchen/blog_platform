import { memo } from "react"

function CommentItem(props) {
    const { comment, currentUser, deleteComment, slug } = props

    const showDelete = currentUser && comment && currentUser.username == comment.userInfo.username

    return (
        <div className="card">
            <div className="card-block">
                <p className="card-text">{comment && comment.body}</p >
            </div>
            <div className="card-footer">
                <img
                    className="comment-author-img"
                    src={comment.userInfo.avatar || "http://localhost:8000/default.png"} alt="" />
                {comment.userInfo.username}
                {
                    showDelete ? <button
                        className="btn btn-danger pull-xs-right"
                        onClick={() => deleteComment(slug, comment.id)}
                    >删除</button> : null
                }
            </div>
        </div>
    )
}
export default memo(CommentItem)