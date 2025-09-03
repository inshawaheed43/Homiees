import React from 'react'
import { Link } from 'react-router-dom'
import auHeadImg from '../assets/about-page-imgs/about-us-title-img.jpg'
import visionImg from '../assets/about-page-imgs/about-us-img1.jpg'
import missionImg from '../assets/about-page-imgs/mission-img.jpg'
import aboutImg from '../assets/about-page-imgs/about-us-img4.jpg'
import gsap from 'gsap'
export default function About() {



  return (
    <main>



      <div className='top-[9vh] relative'>


      <div>
        <h1 className='  relative top-[28vh]  text-center font-semibold text-8xl text-[#ffffff]   z-10'>About Us</h1>
      </div>
      <img
        src={auHeadImg}
        alt=""
        className='rounded-lg relative top-[-7vh] w-[97%] mx-5 opacity-80  h-[60vh] object-cover'

      />
      </div>










      <h1 className='text-[70px] text-[#273b4f] relative top-[19vh] ml-[54vw]   '>Vision</h1>
      <div className='flex  items-center justify-center mt-10'>
        <img
          src={visionImg}
          alt=""
          className='w-[750px] h-[455px] object-cover rounded-lg '
          style={{ display: 'block', margin: 0, padding: 0, border: 0 }}
        />
        <p className='text-[25px] text-[#273b4f] max-w-[40vw] relative left-[3vw] mt-4 right-10 '>
          Mazim saepe instructior mel ei, sanctus assueverit per at, ad eam veri putent nonumes. Id duo modo quidam maluisset, ut mel tractatos intellegat. Ea electram repudiandae qui. Ea soluta meliore accumsan vel, est veniam populo ea. Mel habeo elitr dissentiunt id, oratio fabulas lobortis te pri.

        </p>
      </div>
      <Link to="/" className='flex justify-center mt-10'>
        <button className='bg-[#273b4f] hover:bg-transparent transition-all text-[#EFF4FD]  py-3 px-12 rounded-lg  relative top-[-15vh] left-[10%] hover:scale-95 hover:border-[1px] hover:border-[#273b4f] hover:text-[#273b4f] '> View More</button>
      </Link>







      <div className="bg-[#273b4f] h-[50vh] w-[95%] rounded-lg mx-auto mt-10 flex items-center justify-center">

      </div>









      <h1 className='text-[70px] text-[#273b4f] relative top-[19vh] ml-[32vw]   '>Mission</h1>

      <div className='flex  items-center justify-center mt-10'>
        <p className=' text-right text-[25px] text-[#273b4f] max-w-[40vw] mt-4 mr-14'>
          Mazim esdnxmeklwms,2wklms instructior mel ei, sanctus assueverit per at, ad eam veri putent nonumes. Id duo modo quidam maluisset, ut mel tractatos intellegat. Ea electram repudiandae qui. Ea soluta meliore accumsan vel, est veniam populo ea. Mel habeo elitr dissentiunt id, oratio fabulas lobortis te pri.
        </p>
        <img
          src={missionImg}
          alt=""
          className='w-[750px] h-[455px] object-cover rounded-lg '
          style={{ display: 'block', margin: 0, padding: 0, border: 0 }}
        />

      </div>
      <Link to="/" className='flex justify-center mt-10'>
        <button className='bg-[#273b4f] hover:bg-transparent transition-all text-[#EFF4FD] py-3 px-11 rounded-lg  relative top-[-15vh] left-[-8.6%] hover:scale-95 hover:border-[1px] hover:border-[#273b4f] hover:text-[#273b4f] '> View More</button>
      </Link>








      <div className="h-[50vh] w-[95%] rounded-lg mx-auto mt-52 flex items-center justify-center relative flex-col">
        <img src={aboutImg} alt="" className='rounded-lg opacity-80' />
        <h1 className='text-[60px] text-[#EFF4FD] font-bold -top-44 -mt-24 relative '> Houses and Apartments for Rent & Sale</h1>
        <p className='relative text-[25px] text-[#EFF4FD] max-w-[60vw] text-center z-10 top-[-23vh]'>
          Discover your dream home with our extensive listings of houses and apartments for rent and sale. Whether you're looking for a cozy apartment in the city or a spacious house in the suburbs, we have something for everyone.
        </p>
      </div>














      <section className="bg-gray-50 py-12 mt-10 w-[94vw] ml-9 rounded-lg">
        <div className="max-w-6xl mx-auto px-4">



          <h2 className="text-3xl font-bold text-center mb-10 text-[#273b4f]">
            What Our Clients Say
          </h2>





          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Review Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <p className="text-gray-700 italic mb-4">
                "This team helped us launch our rental platform with ease and professionalism. Highly recommended!"
              </p>



              <div className="flex items-center gap-4">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Client 1"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">Sarah Khan</h4>
                  <p className="text-sm text-gray-500">Marketing Lead, ZEstate</p>
                </div>
              </div>
            </div>

            {/* Review Card 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <p className="text-gray-700 italic mb-4">
                "Amazing support and great communication. Our listings have never looked better!"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Client 2"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">Ahmed Raza</h4>
                  <p className="text-sm text-gray-500">Founder, HomeBay</p>
                </div>
              </div>
            </div>

            {/* Review Card 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <p className="text-gray-700 italic mb-4">
                "They delivered beyond expectations. Super easy to work with and the UI is so clean!"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src="https://randomuser.me/api/portraits/women/68.jpg"
                  alt="Client 3"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">Fatima Noor</h4>
                  <p className="text-sm text-gray-500">UI Designer, PropBuilt</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>





    </main>
  )
}
