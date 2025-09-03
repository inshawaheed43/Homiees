import houseImage1 from '../assets/houses/houseImage1.png';
import houseImage4 from '../assets/houses/houseImage4.png';
import strokeImg from '../assets/houses/storke-img.png'
import getHomeImg from '../assets/houses/1.png'
import { Link } from "react-router-dom"
import rentImg from '../assets/houses/2.png'
import saleImg from '../assets/houses/3.png'
import exploreHouse1 from '../assets/houses/exploreImg-Main.jpeg'
import exploreHouse2 from '../assets/houses/exploreImg-1.jpeg'
import exploreHouse3 from '../assets/houses/exploreImg-3.jpeg'
import exploreHouse4 from '../assets/houses/exploreImg-4.jpeg'
import { useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import { useState, useEffect, useRef } from 'react';
// import ListingItem1 from '../components/ListingItem1';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ListingItem1 from '../Components/ListingItem1.jsx';
import { LucideHome, LucideBuilding2 } from 'lucide-react'
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const navigate = useNavigate();
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  const keywords = ['Apartment', 'House', 'Studio', 'Luxury', 'Furnished'];
  // console.log('Sale Listings:', data.listings);

  const handleKeywordClick = (keyword) => {
    navigate(`/search?query=${keyword}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (query) navigate(`/search?query=${query}`);
  };

  const houseImgRef = useRef(null);
  const leftTextRef = useRef(null);
  const rightTextRef = useRef(null);
  const homieesTextRef = useRef(null);
  const benefitTextRef = useRef(null)
  const exploreHeadingRef = useRef(null);
  const benefitsPointRef = useRef(null)
  const exploreSliderRef = useRef(null)
  const exploreSliderRef1 = useRef(null)
  const rentListingItemsRef = useRef(null)
  const saleListingItemsRef = useRef(null);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {

      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data.listings); // ✅ FIXED
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }

    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data.listings); // ✅ FIXED
      } catch (error) {
        log(error);
      }
    };
    fetchOfferListings();

    const tl = gsap.timeline({ delay: 1 });
    tl.fromTo(houseImgRef.current, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power2.out' })
      .fromTo(leftTextRef.current, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power2.out' }, '-=0.8')
      .fromTo(rightTextRef.current, { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power2.out' }, '-=0.8')
      .fromTo(homieesTextRef.current, { x: 0, opacity: 0 }, { x: 100, opacity: 1, duration: 0.8, ease: 'power2.out' });





    gsap.fromTo(exploreHeadingRef.current,
      { x: 40, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: exploreHeadingRef.current,
          start: 'top 85%',
        }
      });
  }, []);

  gsap.fromTo(exploreSliderRef.current, {
    x: 60, opacity: 0
  }, {
    x: 0,
    opacity: 1,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: exploreSliderRef.current,
      start: 'top 85%',

    }
  })
  gsap.fromTo(exploreSliderRef1.current, {
    x: -60, opacity: 0
  }, {
    x: 0,
    opacity: 1,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: exploreSliderRef1.current,
      start: 'top 85%',

    }
  })
  gsap.fromTo(benefitTextRef.current, {
    y: 60, opacity: 0
  }, {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: benefitTextRef.current,
      start: 'top 85%',

    }
  })
  gsap.fromTo(benefitsPointRef.current, {
    x: 40, opacity: 0
  }, {
    x: 0,
    opacity: 1,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: benefitsPointRef.current,
      start: 'top 85%',
    }
  })

  gsap.fromTo(rentListingItemsRef.current, {
    y: 70, opacity: 0,
  }, {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: rentListingItemsRef.current,
      start: 'top 85%',
    }
  })
  gsap.fromTo(saleListingItemsRef.current, {
    y: 70, opacity: 0,
  }, {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: saleListingItemsRef.current,
      start: 'top 85%',
    }
  })
  return (
    <main>
      <div className=" bg-[#354f69] w-[96%] left-[1.8vw] -top-2 rounded-xl  relative h-[109vh]" >
        <p className='text-center text-2xl mt-10 relative top-[90px] text-[#F5EDE8] '>
          Get Home & Shelter under Budget
        </p>

        <h1 ref={homieesTextRef} className='font-extrabold text-center text-[15vw] tracking-widest  font-orbitron relative left-[-5vw] -top-3  text-[#F5EDE8]'>HOMIEES</h1>

        <div className="container-fluid" id='forLandLords'>
          <div className="row">
            <div className="-col-md-4">
              <img ref={houseImgRef} src={houseImage4} alt="" className=' object-cover relative top-[-27vh] self-center left-56 w-[72vw]' />
            </div>

            <div className="-col-md-4" ref={leftTextRef}>
              <p className=' flex flex-wrap text-justify text-[1vw] relative top-[-80vh] ml-20 text-[#F5EDE8]'>
                List your property, find the <br /> right tenants, and earn with <br /> ease — all in one place."
              </p>

              <Link to={"/sign-up"}>
                <button className='bg-[#F5EDE8] text-[#354f69] px-7 py-2  rounded-lg text-lg mt-10 relative top-[-84vh] left-[4.5vw] hover:border-[0.1rem] hover:border-[#F5EDE8] hover:text-[#F5EDE8] hover:bg-transparent hover:scale-95 transition-all'>
                  Be the LandLord
                </button>
              </Link>

              <p className=' flex flex-wrap text-justify text-lg relative text-[1vw] top-[-81vh] ml-20 text-[#F5EDE8]'>
                Search smart. Live better. <br /> Rentals that fit your lifestyle <br />and budget.
              </p>

              <Link to={"/sign-up"}>
                <button className='bg-[#F5EDE8] text-[#354f69] px-7 py-2  rounded-lg text-lg mt-10 hover:border-[0.1rem] hover:border-[#F5EDE8] hover:text-[#F5EDE8]  relative top-[-85vh] left-[4.5vw] hover:bg-transparent hover:scale-95 transition-all'>
                  Get your Home
                </button>
              </Link>
            </div>

            <div className="-col-md-4" ref={rightTextRef}>
              <div className="p-6  w-full max-w-xs relative top-[-120vh] right-[-75vw]">
                <form onSubmit={handleSearch} className=" px-8  rounded-full flex items-center shadow-cyan-800-500/50 shadow-md bg-[#F5EDE8] w-full">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search homes"
                    className="flex-1 p-4 bg-transparent focus:outline  rounded-full focus:outline-none  w-1 bg-[#F5EDE8]   "
                  />
                  <button >
                    <FaSearch className="text-[#273b4f]" />
                  </button>
                </form>

                <div className="text-[#F5EDE8] mb-2 text-lg mt-2 ml-3">Popular:</div>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((word) => (
                    <button
                      key={word}
                      onClick={() => handleKeywordClick(word)}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 transition"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <section className=''>
        <div className="benefit-head" ref={benefitTextRef}>

          <h1 className='text-[#354f69] text-5xl text-center font-semibold mt-16'  >
            Unlock Homiees benefits!
          </h1>
          <img src={strokeImg} alt="" className='w-[12vw] relative ml-[55vw] top-[-1vh]' />
        </div>

        <div className='flex flex-row items-center text-[#354f69] ml-36' ref={benefitsPointRef} >

          <div>
            <img src={getHomeImg} alt="" />
            <h1 className='text-slate-400 text-sm relative top-[-13vh] left-[7vw]'> GET A RENTED HOME</h1>
            <p className='w-[16rem] relative top-[-12vh] left-16 text-lg text-center ' >From city vibes to countryside calm, Homiees brings your perfect home within reach.

            </p>
          </div>
          <div>
            <img src={rentImg} alt="" />
            <h1 className='text-slate-400 text-sm relative top-[-13vh] left-[9vw]'> RENT A HOME</h1>
            <p className='w-[16rem] relative top-[-12vh] left-16 text-lg text-center '>Discover a rental you'll love on Homiees, thanks to 10+ filters and tailored keywords.</p>
          </div>
          <div>
            <img src={saleImg} alt="" />
            <h1 className='text-slate-400 text-sm relative top-[-13vh] left-[10vw]'>SELL PROPERTY </h1>
            <p className='w-[16rem] relative top-[-12vh] left-20 text-lg text-center '>List, sell, thrive – with our top-notch real estate agency. It's super easy & fun.</p>
          </div>
        </div>
      </section>

      <div className='flex flex-row items-center text-lg '>

        <hr className='w-[40vw] border-slate-400 border-[1px] ml-20 mr-3 ' />
        <LucideHome className='text-lg gap-3 mr-9' /><LucideBuilding2 />
        <hr className='w-[40vw] border-slate-400 border-[1px] ml-3 mr-10 ' />
      </div>

      {/* Explore Section */}

      <div id="exploreListings" className='flex flex-col items-center mt-10'>
        <h1 ref={exploreHeadingRef} className='text-6xl font-bold text-[#273b4f] mb-6'>
          Explore Popular Places
          <img src={strokeImg} className=" w-[12rem] ml-[27rem]  top-[-2vh] relative" alt="" />
        </h1>

      </div>

      <div className='w-full h-[700px]  gap-4 ml-16 items-center justify-center  '>
        <div className='flex flex-row gap-2 mt-2 ' ref={exploreSliderRef}>

          <img src={exploreHouse1} alt="" className='object-cover w-[55vw] h-[40vh] rounded-xl' />
          <img src={exploreHouse3} alt="" className='object-cover w-[35vw] h-[40vh] rounded-xl' />
        </div>
        <div className='flex flex-row gap-2 mt-2  ' ref={exploreSliderRef1}>
          <img src={exploreHouse4} alt="" className='object-cover w-[35vw] h-[40vh] rounded-xl  ' />
          <img src={exploreHouse2} alt="" className='object-cover w-[55vw] h-[40vh] rounded-xl' />

        </div>


      </div>

      {/* HR LINE */}

      <div className='flex flex-row top-[15vh] relative items-center text-lg '>

        <hr className='w-[40vw] border-slate-400 border-[1px] ml-20 mr-3 ' />
        <LucideHome className='text-lg gap-3 mr-9' /><LucideBuilding2 />
        <hr className='w-[40vw] border-slate-400 border-[1px] ml-3 mr-10 ' />
      </div>


      <div className='max-w-6xl mx-auto p-3 top-[15vh] relative flex flex-col gap-8 my-10'>




        {/* {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-5xl  font-semibold text-slate-600'>Recent offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem1 listing={listing} key={listing._id} />
              ))}
            </div>
        
          </div>
        )} */}



        {/* RENTED PLACES */}


        {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='my-3 '>
              <h2 className='text-5xl font-semibold text-slate-600'>Rented Places</h2>
              <Link className='text-sm float-end bg-[#354F69] text-white/85  relative rounded-lg px-4 py-3 -top-12 hover:border-[0.1rem] hover:bg-transparent hover:scale-95 transition-all hover:text-[#354f69] hover:border-[#354F69]' to={'/search?type=rent'}>Show more places for rent</Link>
            </div>
            <div className=' flex flex-row ml-14 flex-wrap mt-20 gap-3' ref={rentListingItemsRef}>
              {rentListings.map((listing) => (
                <ListingItem1 listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {/* SALES LISTINGS */}

        {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='my-3 mt-28'>
              <h2 className='text-5xl font-semibold text-slate-600'>Places For Sale</h2>
              <Link className='text-sm float-end bg-[#354F69] text-white/85 relative rounded-lg px-4 py-3 -top-12 hover:border-[0.1rem] hover:bg-transparent hover:scale-95 transition-all hover:text-[#354f69] hover:border-[#354F69]' to={'/search?type=sale'}>Show more places for sale</Link>
            </div>
            <div className='flex  flex-wrap mt-10 gap-4  ' ref={saleListingItemsRef}>

              {saleListings.map((listing) => (
                <ListingItem1 listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
