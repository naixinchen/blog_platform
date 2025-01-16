import routes from "./routes"
import Header from "./components/Header"
import {useRoutes} from "react-router-dom"

import { Suspense,memo } from "react"
function App() {
  const element =useRoutes(routes)
  return (
    <>
    <Header />
    <div>
      <Suspense fallback={<h2>loading...</h2>}>
      {element}
      </Suspense>
    </div>
    </>
  )
}

export default memo(App)
