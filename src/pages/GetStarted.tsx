import sideImage from "../assets/images/get-started-side-image.png";
import Navbar from "../components/header/Navbar";

const GetStarted = () => {
  return (
    <>
    <Navbar />
      <div className="flex justify-between gap-4 pt-20">
        <div className="w-1/2 hidden lg:block">
          <img src={sideImage} alt="side image" className="h-full" />
        </div>
        <form className="max-w-md mx-auto">
          <h1 className="max-md:text-3xl flex text-4xl font-semibold mb-4">
            Have a project? <br />
            We would love to help.
          </h1>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="name"
              id="name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="name"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Your Name
            </label>
          </div>

          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="email"
                name="email"
                id="email"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="email"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Your Email
              </label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="phoneNumber"
                id="phone number"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="phone number"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Phone Number
              </label>
            </div>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="projectName"
              id="projectName"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 ark:focus:border-blue-500d focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="projectName"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Project Name
            </label>
          </div>

          <label htmlFor="projectType" className="sr-only">
            Project Type
          </label>
          <select
            id="projectType"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-gray-600 peer"
          >
            <option value="" disabled selected hidden>
              Please select an option
            </option>
            <option value="" disabled>
              DOCUMENT PRINTING
            </option>
            <option value="color-copies">Color Copies</option>
            <option value="black-white-copies">Black And White Copies</option>
            <option value="" disabled>
              GRAPHICS PRINTING
            </option>
            <option value="mini-posters">Mini Posters</option>
            <option value="posters">Posters</option>
            <option value="banners">Banners</option>
            <option value="" disabled>
              MARKETING PRINTING
            </option>
            <option value="business-cards">Business Cards</option>
            <option value="flyers">Flyers</option>
            <option value="brochures">Brochures</option>
            <option value="postcards">Postcards</option>
            <option value="door-hangers">Door Hangers</option>
            <option value="folders">Folders</option>
            <option value="stickers">Stickers</option>
            <option value="menus">Menus</option>
            <option value="rack-cards">Rack Cards</option>
            <option value="" disabled>
              BOOKLETS PRINTING
            </option>
            <option value="saddle-sticked-booklets">
              Saddle-Sticked Booklets
            </option>
            <option value="perfect-bound-booklets">
              Perfect Bound Booklets
            </option>
            <option value="wire-o-booklets">Wire-O Booklets</option>
            <option value="spiral-bound-booklets">Spiral Bound Booklets</option>
          </select>

          <label
            htmlFor="message"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your message
          </label>
          <textarea
            id="message"
            rows={5}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tell us About Your Project"
          ></textarea>

          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="file_input"
          >
            Upload file
          </label>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            id="file_input"
            type="file"
          />

          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none mt-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Get Started
          </button>
        </form>
      </div>
    </>
  );
};

export default GetStarted;
