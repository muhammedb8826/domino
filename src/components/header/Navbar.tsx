import { NavLink } from "react-router-dom"

const Navbar = () => {
  return (
    <header>
    <nav>
        <div>
            <NavLink to="/">Logo</NavLink>
        </div>
            <ul>
                <li>
                    <NavLink to="/about">About</NavLink>
                </li>
                <li>
                    <NavLink to="/services">Services</NavLink>
                </li>
                <li>
                    <NavLink to="/latest-work">Latest Work</NavLink>
                </li>
                <li>
                    <NavLink to="/blog">Blog</NavLink>
                </li>
                <li>
                    <NavLink to="/contact">Contact</NavLink>
                </li>
                <li>
                    <NavLink to="/get-started">Get started</NavLink>
                </li>
            </ul>
    </nav>
    </header>
  )
}

export default Navbar