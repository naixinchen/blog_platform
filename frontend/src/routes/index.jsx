import { lazy } from "react";
import AuthRouter from "./AuthorRouter";

// import Setting from "../pages/Setting";
// import Profile from "../pages/Profile";
// import Regist from "../pages/Regist";

const Home = lazy(() => import("../pages/Home"))
const Login = lazy(() => import("../pages/Login"))

const Regist = lazy(() => import("../pages/Regist"))
const Setting = lazy(() => import("../pages/Setting"))

const Profile = lazy(() => import("../pages/Profile"))
const ArticleNew = lazy(() => import("../pages/ArtivcleNew"))

const Article = lazy(() => import("../pages/Article"))
const ArticleEdit = lazy(() => import("../pages/ArticleEdit"))



export default [
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/setting",
        element: <AuthRouter>
            <Setting />
        </AuthRouter>
    },
    {
        path: "/profile/:username",
        element: <AuthRouter>
            <Profile />
        </AuthRouter>
    },
    {
        path: "/regist",
        element: <Regist />
    },
    {
        path: "/article/new",
        element: <AuthRouter>
            <ArticleNew />
        </AuthRouter>
    },
    {
        path: "/article/:slug",
        element: <Article />
    }, {
        path: "/article/edit/:slug",
        element: <AuthRouter>
            <ArticleEdit />
        </AuthRouter>
    }
]