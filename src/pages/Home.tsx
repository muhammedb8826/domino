import heroImage from '../assets/images/transparent-light-bulb.png'


const Home = () => {
  return (
    <section className="h-[calc(100vh-64px)] bg-[#f01d52] flex items-center justify-center p-4">
      <img src={heroImage} alt="hero image" className="hero-image" />
      <div className="h-full flex flex-col justify-center items-center absolute">
        <h1 className="hero-text text-6xl text-white font-bold p-4 text-center">GET THE RESULTS YOU WANT</h1>
      </div>
    </section>
  )
}

export default Home