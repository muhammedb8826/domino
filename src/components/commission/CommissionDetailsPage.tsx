import { useParams } from "react-router-dom"

const CommissionDetailsPage = () => {
    const {id} = useParams()
  return (
    <div>
      <h1>commission {id}</h1>
    </div>
  )
}

export default CommissionDetailsPage
