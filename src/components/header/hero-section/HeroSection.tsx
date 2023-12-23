import { Parallax } from "react-scroll-parallax"
import heroImage from './transparent-light-bulb.png';
import light from './klipartz1.png';
import { LiaAngleDoubleDownSolid } from "react-icons/lia";


const HeroSection = () => {
  return (
    <Parallax speed={-10}>
    <section className="h-screen bg-[#f01d52] flex items-center justify-center p-4 hero-section">
      <img src={light} alt="hero image" className="hero-image absolute z-10" />
      <img src={heroImage} alt="hero image" className="hero-image z-20" />
      <div className="h-full flex flex-col justify-center items-center absolute z-30">
        <h1 className="hero-text max-md:text-[10vw] text-6xl text-white font-bold p-4 text-center">GET THE RESULTS YOU WANT</h1>
        <p className="max-md:text-[5vw] text-4xl text-white text-center typed">MAXIMIZE PROFITABILITY</p>
      </div>
      <div className="scroll-icon absolute bottom-6 text-white text-4xl">
      <LiaAngleDoubleDownSolid />
      </div>
    </section>
    </Parallax>
  )
}

export default HeroSection
