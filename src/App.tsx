import { Route, Routes } from "react-router-dom"
import Navbar from "./components/header/Navbar"
import About from "./pages/About"
import Services from "./pages/Services"
import LatestWork from "./pages/LatestWork"
import Blog from "./pages/Blog"
import Contact from "./pages/Contact"
import GetStarted from "./pages/GetStarted"
import Home from "./pages/Home"
import "./assets/styles/main.css"
import { ParallaxProvider } from "react-scroll-parallax"

const App = () => {
  return (
    <ParallaxProvider>
    <main>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/services" element={<Services/>} />
        <Route path="/latest-work" element={<LatestWork/>} />
        <Route path="/blog" element={<Blog/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/get-started" element={<GetStarted/>} />
      </Routes>
    </main>
    </ParallaxProvider>
  )
}

export default App
