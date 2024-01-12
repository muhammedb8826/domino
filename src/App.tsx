import { Route, Routes } from "react-router-dom"
import About from "./pages/About"
import Services from "./pages/Services"
import LatestWork from "./pages/LatestWork"
import Blog from "./pages/Blog"
import Contact from "./pages/Contact"
import GetStarted from "./pages/GetStarted"
import Home from "./pages/Home"
import "./assets/styles/main.css"
// import Dashboard from "./pages/Dashboard"
import AddOrder from "./components/order/AddOrder"
import NotFound from "./components/header/NotFound"
import Login from "./auth/Login"
import Dashboard from "./pages/Dashboard"

const App = () => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/services" element={<Services/>} />
        <Route path="/latest-work" element={<LatestWork/>} />
        <Route path="/blog" element={<Blog/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/get-started" element={<GetStarted/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/add-order" element={<AddOrder />} />
        <Route path="*" element={<NotFound/>} />
        </Routes>
    </main>
  )
}

export default App
