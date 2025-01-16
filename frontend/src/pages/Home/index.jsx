import { PureComponent } from "react";
import Banner from "./banner";
import Tags from "./Tags";
import { connect, useDispatch } from "react-redux";
import { getTags } from "../../store/modules/homeSlice";
import Main from "./Main";

class Home extends PureComponent {
    render() {
        return (
            <div className="home-page">
                <Banner />
                <div className="container page">
                    <div className="row">
                        {/* 文章 */}
                        <div className="col-md-9">
                            <Main />
                        </div>
                        {/* 标签 */}
                        <div className="col-md-3">
                            <div className="sidebar">
                                <p>热门标签</p>
                                <Tags tags={this.props.tags} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    componentDidMount() {
        this.props.getTags()
    }
}

const mapState = state => ({
    ...state.home
})
const mapDispatch = dispatch => ({
    getTags: () => dispatch(getTags())
})

export default connect(mapState, mapDispatch)(Home)