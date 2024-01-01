import { Route, Routes } from "react-router-dom"
import About from "./pages/About"
import Services from "./pages/Services"
import LatestWork from "./pages/LatestWork"
import Blog from "./pages/Blog"
import Contact from "./pages/Contact"
import GetStarted from "./pages/GetStarted"
import Home from "./pages/Home"
import "./assets/styles/main.css"
import OrderPage from "./pages/OrderPage"
import AddOrder from "./components/order/AddOrder"

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
        <Route path="/sign-in" element={<OrderPage/>} />
        <Route path="/add-order" element={<AddOrder />} />
        <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
    </main>
  )
}

export default App
