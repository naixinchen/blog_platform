import { memo } from "react";
import { connect } from "react-redux";
import {
    getTabArticles,
    syncCurrentPage,
    syncTab,
    syncTag
} from "../../store/modules/homeSlice"

const Tags = memo(props => {
    const { tags } = props

    if (tags) {
        return (
            <div className="tag-list">
                {
                    tags.map(tag => {
                        return (
                            <span
                                className="btn btn-secondary btn-sm"
                                onClick={
                                    () => {
                                        // 条件查询更新页码
                                        props.syncTab(null)
                                        props.syncTag(tag)
                                        props.syncCurrentPage(1)
                                        props.getTabArticles()
                                    }
                                }
                                key={tag}>{tag}&nbsp;
                            </span>
                        )
                    })
                }
            </div>
        )
    } else {
        return <div>加载标签...</div>
    }
})

const mapDispatch = dispatch => ({
    getTabArticles:()=>dispatch(getTabArticles()),
    syncCurrentPage:(page)=>dispatch(syncCurrentPage(page)),
    syncTab:(tab)=>dispatch(syncTab(tab)),
    syncTag:(tag)=>dispatch(syncTag(tag)),
   
})
export default connect(null,mapDispatch)(Tags)