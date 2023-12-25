import sideImage from '../assets/images/get-started-side-image.png'

const GetStarted = () => {
  return (
    <div>
      <h1>have a project? <br />We would love to help.</h1>
      <div className="container flex justify-between gap-4">
       <div className="w-1/2 border border-black hidden lg:block">
        <img src={sideImage} alt="side image"  className='w-full'/>
       </div>
        <form action="" className=''>
          <input type="text" placeholder="Your Name" />
          <div className="flex">
          <input type="email" placeholder="Your Email" />
          <input type="text" placeholder="Phone Number" />
          </div>
          <input type="text" placeholder="Project Name" />
          <select name="" id="" title="Product Type" >
            <option value="" disabled>DOCUMENT PRINTING</option>
            <option value="color-copies">Color Copies</option>
            <option value="black-white-copies">Black And White Copies</option>
            <option value="" disabled>GRAPHICS PRINTING</option>
            <option value="mini-posters">Mini Posters</option>
            <option value="posters">Posters</option>
            <option value="banners">Banners</option>
            <option value="" disabled>MARKETING PRINTING</option>
            <option value="business-cards">Business Cards</option>
            <option value="flyers">Flyers</option>
            <option value="brochures">Brochures</option>
            <option value="postcards">Postcards</option>
            <option value="door-hangers">Door Hangers</option>
            <option value="folders">Folders</option>
            <option value="stickers">Stickers</option>
            <option value="menus">Menus</option>
            <option value="rack-cards">Rack Cards</option>
            <option value="" disabled>BOOKLETS PRINTING</option>
            <option value="saddle-sticked-booklets">Saddle-Sticked Booklets</option>
            <option value="perfect-bound-booklets">Perfect Bound Booklets</option>
            <option value="wire-o-booklets">Wire-O Booklets</option>
            <option value="spiral-bound-booklets">Spiral Bound Booklets</option>
          </select>
          <textarea name="" id="" cols={50} rows={5} placeholder="Tell us About Your Project"></textarea>
          <input type="file" placeholder="Add attachment" name="" />
          <button type="submit">Submit</button>
        </form>
      </div>
    
    </div>
  )
}

export default GetStarted