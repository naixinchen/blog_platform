import { PureComponent } from "react";
import { Link } from "react-router-dom"
import Menu from "./menu";

// const currentUser  ={avatar:null}
class Header extends PureComponent {
    render() {
        return (
            <nav className="navbar navbar-light">
                <div className="container">
                    <Link to={"/"} className="navbar-brand">BlOG-V1</Link>
                    <Menu />
                </div>
            </nav>
        )
    }
}
export default Header