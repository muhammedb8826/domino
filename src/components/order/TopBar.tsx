const TopBar = () => {
  return (
    <div className="flex h-20 p-4 justify-evenly items-center border border-black w-full">
     <form action="">
      <label htmlFor="search"/>
      <input name="search" placeholder="search orders" id="search" type="search" />
     </form>
     <div>
      notification
     </div>
      <div className="">
        profile
      </div>
    </div>
  )
}

export default TopBar
