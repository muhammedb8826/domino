import { ParallaxBanner } from "react-scroll-parallax";
import bannerForeGround from "./images/klipartz.png";
import bannerBackground from "./images/bg3.jpg";
import front from "./images/foreground.png";
import back from "./images/graphtree1.png";

const ScrollablePages = () => {
  return (
    <>
      <ParallaxBanner 
      layers={[
        { image: `${bannerBackground}`, speed: -20 },
        {
          speed: -20,
          children: (
            <div className="absolute inset-0 flex flex-col gap-5 justify-end items-center h-[65%]">
              <h1 className="text-8xl text-white font-medium">DESTROY</h1>
              <p className="text-4xl text-white font-medium">YOUR COMPETITION</p>
            </div>
          ),
        },
        { image: `${bannerForeGround}`, speed: -10 },
      ]}
      className="aspect-[2/1] h-screen"
    />

<ParallaxBanner 
      layers={[
        { image: `${back}`, speed: 0 },
        {
          speed: -20,
          children: (
            <div className="absolute inset-0 flex flex-col gap-5 justify-end items-center h-[72%]">
            <h1 className="text-8xl text-[#CCC7BF] font-medium">ALWAYS</h1>
            <p className="text-3xl text-[#3E342F] font-medium">CUTTING EDGE. NEVER COOKIE CUTTER</p>
          </div>
          ),
        },
        { image: `${front}`, speed: 10 },
      ]}
      className="aspect-[2/1] h-screen"
    />
    <div className="h-screen flex justify-center items-center">
      <h1>Getting Started section</h1>
    </div>
    </>
  );
};

export default ScrollablePages;
