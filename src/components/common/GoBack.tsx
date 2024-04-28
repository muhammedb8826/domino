import { IoChevronBackOutline } from 'react-icons/io5'
import { NavLink } from 'react-router-dom'

interface IGoBack {
    goback: string
    }

export const GoBack = ({goback}: IGoBack) => {
  return (
    <NavLink to={goback} className="px-4 text-secondary flex items-center mb-4"><IoChevronBackOutline />Back</NavLink>
  )
}
