import { IoChevronBackOutline } from 'react-icons/io5'
import { NavLink } from 'react-router-dom'

interface IGoBack {
    goback: string
    }

export const GoBack = ({goback}: IGoBack) => {
  return (
    <NavLink to={goback} className="text-sky-500 flex items-center"><IoChevronBackOutline />Back</NavLink>
  )
}
