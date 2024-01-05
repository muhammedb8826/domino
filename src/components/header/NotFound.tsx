import { NavLink } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="wrapper">
      <h1 className="text-2xl font-bold">Not Found</h1>
      <p className="lead">The page you are looking for does not exist...
      <NavLink to="/" className="text-blue-700 hover:underline font-medium text-sm px-5 py-2.5">
        Go Back
    </NavLink>
      </p>
            
    </div>
  )
}

export default NotFound
