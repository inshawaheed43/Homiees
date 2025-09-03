import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import { LucideMapPin } from 'lucide-react';
import { FaChevronLeft, FaFire, FaMapMarkerAlt, FaChevronRight, FaTimes, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import sideBarBg from '../assets/houses/search-filter-bg.png'
import { FiHeart, FiBookmark, } from 'react-icons/fi';
import { LucideShowerHead, LucideBedDouble, LucideArmchair, LucideCar, LucidePlug } from 'lucide-react';
import MapComponent from '../Components/Map.jsx';
import 'swiper/css/navigation';
import { useNavigate } from 'react-router-dom'

export default function Listing() {
  SwiperCore.use([Navigation]);
  const navigate = useNavigate();
  const [listing, setListing] = useState(null)
  const [landlord, setLandlord] = useState(null);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isSaved, setIsSaved] = useState(false);
  const params = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("pending");
  const { listingId } = useParams();
  const { saved, setSaved } = useState(false);
  // const [viewingDateTime, setViewingDateTime] = useState("");
  // const [bookingDateTime, setBookingDateTime] = useState("");
  // const [bookingStatus, setBookingStatus] = useState(null);
  console.log("Listing ID:", listingId); // should not be undefined

  const nextImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % listing.imageUrls.length);
  };
  const prevImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? listing.imageUrls.length - 1 : prevIndex - 1
    );
  };
  useEffect(() => {
    const fetchListing = async () => {
      console.log(" listing fetched from API:", listingId);
      console.log("Listing Data:", listingId);
      if (listing) {
        console.log("Video URLs:", listingId.videoUrls);
      }
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }

        console.log("API Response:", data);
        setListing(data);

        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  useEffect(() => {
    const fetchLandlord = async () => {
      if (listing?.userRef) {
        try {
          const res = await fetch(`/api/user/${listing.userRef}`);
          const data = await res.json();
          console.log("Landlord's Data: ", data)
          if (data.success !== false) {
            setLandlord(data);
          }
        } catch (err) {
          setLandlord(null);
        }
      }
    };
    fetchLandlord();
  }, [listing]);
  useEffect(() => {
    if (listing && currentUser?.savedListings?.includes(listing._id)) {
      setIsSaved(true);
    }
  }, [currentUser, listing]);
  // const handleToggleSave = async () => {
  //   if (!listing) return;

  //   const endpoint = isSaved
  //     ? `/api/user/unsave-listing/${listing._id}`
  //     : `/api/user/save/${listing._id}`;
  //   const method = isSaved ? "PUT" : "POST";

  //   console.log("🛠️ Save toggle clicked!");
  //   console.log("🔗 Endpoint:", endpoint);
  //   console.log("🧠 Current isSaved:", isSaved);

  //   try {
  //     const res = await fetch(endpoint, {
  //       method,
  //       credentials: "include",
  //     });

  //     const data = await res.json();

  //     if (res.ok) {
  //       setIsSaved((prev) => !prev); // ✅ toggle correctly
  //       console.log("✅ Save/unsave worked");
  //     } else {
  //       console.error("❌ Error from backend:", data.message);
  //     }
  //   } catch (err) {
  //     console.error("🔥 Save/Unsave failed:", err);
  //   }
  // };
  const handleContact = async () => {
    try {
      const res = await fetch("/api/chat/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUser._id,
          receiverId: landlord._id,
        }),
      });

      const data = await res.json();
      navigate(`/chatroom/${data._id}`);
    }

    catch (err) {
      console.error("Chat creation failed", err);
    }
  };
  // const handleBooking = async () => {
  //   if (!listing || !currentUser) return alert("Missing data");

  //   console.log("Submitting booking for:", listing._id);
  //   if (!viewingDateTime) {
  //     setMessage("Please select a date and time.");
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     setBookingStatus(null); // Clear previous message
  //     const res = await fetch("/api/bookings/create", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //       body: JSON.stringify({
  //         viewingDateTime,
  //         tenantRef: currentUser._id,
  //         landlordRef: listing.userRef,
  //         listingRef: listing._id,
  //         status: "pending",

  //       }

  //       ),
  //     });
  //     console.log("date & time : ", viewingDateTime)


  //     const data = await res.json();

  //     if (!res.ok) throw new Error(data.message || "Booking failed");
  //     setBookingStatus("✅ Booking request sent successfully!");
  //     setBookingDateTime(""); // Clear input after success
  //     alert("booking done")
  //   }


  //   catch (err) {
  //     console.error(err);
  //     setBookingStatus("❌ Failed to send booking request", `❌ ${err.message}`);
  //   }
  //   finally {
  //     setLoading(false);
  //   }
  // };

  const handleSave = async (id) => {
    const method = saved ? 'DELETE' : 'POST';
    const res = await fetch(`/api/user/save/${listing._id}`, {
      method,
      credentials: 'include'
    });
    if (res.ok) {
      setSaved(!saved);
    }
  };



  return (


    <main>


      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          {/* Top heading */}
          <div className=" w-[75rem] mt-20 relative left-[12vw] ">

            <div className='overflow-hidden w-[50%]'>

              <h1 className='font-bold text-5xl text-slate-700 '>{listing.name}</h1>
            </div>


            <div className='flex gap-4 '>



              <p className='bg-[#354f69] w-[5rem] max-w-[200px] text-white text-center text-xs fonst-extralight p-2 mt-5 rounded-full'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>



              <p className='flex items-center mt-6 gap-1 text-slate-500  text-sm font-light'>
                <LucideMapPin className='text-[#354f69] text-sm ' />
                {listing.address}, {listing.city}, {listing.state}
              </p>


            </div>





            <div className='float-right relative top-[-6.5vh] w-[40%] '>
              <p className='text-4xl text-slate-700 relative -top-24   font-semibold'> Price:
                {' '}
                {listing.offer

                  ? listing.discountedPrice.toLocaleString('en-PK', {
                    style: 'currency',
                    currency: 'PKR'
                  })
                  : listing.regularPrice.toLocaleString('en-PK', {
                    style: 'currency',
                    currency: 'PKR'
                  })}
                {listing.type === 'rent'}
              </p>


              <div className='flex flex-row gap-4  relative float-end  '>
                <div
                  className={`rounded-full bg-[#fffffe] w-[2.4rem] hover:scale-90 border-[0.1px] border-slate-500 transition-all h-[2.4rem] relative top-[-8vh] hover:bg-[#354f69] text-center hover:text-white hover:border-white cursor-pointer`}
                  onClick={async () => {
                    if (!currentUser) return; // Optionally prompt login
                    setLiked((prev) => !prev);
                    // Send notification to landlord
                    try {
                      -
                        await fetch("/api/notification/like", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          credentials: "include",
                          body: JSON.stringify({
                            landlordId: landlord._id,
                            listingId: listing._id,
                            likerUsername: currentUser.username,
                          }),
                        });
                    } catch (err) {
                      console.error("Failed to notify landlord", err);
                    }
                  }}
                >
                  {liked ? (
                    <FiHeart className="relative top-[0.7rem] left-[0.7rem] text-red-500 fill-red-500" />
                  ) : (
                    <FiHeart className="relative top-[0.7rem] left-[0.7rem] text-slate-500" />
                  )}
                </div>

                {currentUser?.role === "tenant" && (
                  <button onClick={() => handleSave(listing._id)}                   
                  className="rounded-full bg-[#fffffe] w-[2.4rem] hover:scale-90  border-[0.1px] border-slate-500 transition-all h-[2.4rem] relative top-[-8vh] hover:bg-[#354f69]  text-center hover:text-white hover:border-white">





                    {saved ? (
                      <FaBookmark className='relative top-[0.7rem hover:text-white cursor-pointer left-[0.7rem] text-slate-500 ' />) : (<FaRegBookmark />
                    )}
                  </button>

                )}



              </div>


            </div>


          </div>
          {/* listed images  */}
          <div className=' flex flex-row gap-5 items-center mt-24 left-[10vw] relative' >

            <div className='bg-[#fffffe] rounded-lg w-[64vw]  h-[69vh]'>
              <button
                onClick={() => setShowAll(true)}
                className=" bg-[#fffffe] opacity-75 px-4 py-2 rounded-md shadow text-sm font-medium float-right top-[5vh] left-[-2vw]  relative  z-20 transition-all hover:scale-105 "
              >
                See all Photos
              </button>
              <img
                src={listing.imageUrls[selectedImageIndex]}
                alt="Main preview"
                className=" w-[62vw] h-[65vh] top-[-2.5vh] left-[1vw] rounded-xl   relative  object-cover"
                style={{

                }}
              />

              <button
                onClick={nextImage}
                className=" bg-[#fffffe] opacity-75 hover:scale-95 transition-all relative top-[-64vh] left-16 rounded-full p-2 shadow-md z-10"
              >
                <FaChevronRight />
              </button>
              <button
                onClick={prevImage}
                className=" bg-[#fffffe] opacity-75 hover:scale-95 transition-all relative top-[-64vh] right-2 rounded-full p-2 shadow-md z-10"
              >
                <FaChevronLeft />
              </button>



            </div>

            <div className='bg-[#fffffe] rounded-lg w-[15vw] h-[69vh] flex flex-col   overflow-hidden '>
              <div>
                {listing.imageUrls.slice(1, 5).map((url, index) => (

                  < div className='mx-3 relative mt-3'>

                    <img src={url} key={index} alt="" onClick={() => setSelectedImageIndex(index)}
                      className={`cursor-pointer rounded-md object-cover h-[15vh]  w-full overflow-hidden ${selectedImageIndex === index
                        ? 'border-[#354f69]'
                        : 'border-transparent'
                        }`} />
                  </div>
                ))}
              </div>

            </div>
          </div>
          {showAll && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 z-50 flex flex-col p-8">
              <button
                onClick={() => setShowAll(false)}
                className="self-end text-white text-3xl mb-4"
              >
                <FaTimes />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto">
                {listing.imageUrls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Image ${i}`}
                    className="rounded-lg object-cover w-full h-[300px]"
                  />
                ))}
              </div>
            </div>
          )}
          {/* property Overview */}
          <div className='h-[30vh] w-[80vw] bg-[#fffffe] rounded-xl relative mt-16 left-[10vw]'>
            <h1 className='text-2xl relative top-[3vh] ml-10 font-semibold text-slate-700'>Property Overview</h1>
            <ul className='flex flex-wrap items-center  sm:gap-6 relative top-[6vh] left-[4vw]'>

              <div className='flex flex-col mr-7 ml-7  items-center'>
                <div className="flex items-center justify-center w-12 h-12 rounded-full border border-slate-400 mr-2">
                  <LucideBedDouble size={37} className="text-[#354f69]" />
                </div>
                <li className='text-[21px] text-slate-500 relative flex items-center'>
                  {listing.bedrooms > 1
                    ? `Bedrooms. ${listing.bedrooms} `
                    : `Bedroom  ${listing.bedrooms} `}
                </li>
              </div>
              <hr className=''
                style={{
                  width: '1px',
                  height: '4rem',
                  background: 'lightgray',
                  border: 'none',
                  margin: '0 3px',
                  display: 'inline-block',
                  transform: 'rotate(12deg)'
                }} />
              <div className='flex flex-col mr-7 ml-7  items-center '>

                <div className="flex items-center justify-center w-12 h-12 rounded-full border border-slate-400 mr-2">
                  <LucideShowerHead size={37} className="text-[#354f69]" />
                </div>
                <li className=' gap-1 whitespace-nowrap text-[21px] text-slate-500'>
                  {listing.bathrooms > 1
                    ? `${listing.bathrooms} baths `
                    : `${listing.bathrooms} bath `}
                </li>

              </div>
              <hr className=''
                style={{
                  width: '1px',
                  height: '4rem',
                  background: 'lightgray',
                  border: 'none',
                  margin: '0 3px',
                  display: 'inline-block',
                  transform: 'rotate(12deg)'
                }} />
              <div className='flex mr-7 ml-7  flex-col items-center '>

                <div className="flex items-center justify-center w-12 h-12 rounded-full border border-slate-400 mr-2">
                  <LucideCar size={37} className="text-[#354f69]" />
                </div>
                <li className='text-[21px] text-slate-500 gap-1 whitespace-nowrap '>
                  {listing.parking ? 'Parking spot' : 'No Parking'}
                </li>

              </div>
              <hr className='text-slate-400'
                style={{
                  width: '1px',
                  height: '4rem',
                  background: 'lightgray',
                  border: 'none',
                  margin: '0 3px',
                  display: 'inline-block',
                  transform: 'rotate(12deg)'
                }} />
              <div className='flex mr-7 ml-7  items-center  flex-col'>

                <div className="flex items-center justify-center w-12 h-12 rounded-full border border-slate-400 mr-2">
                  <LucideArmchair size={37} className="text-[#354f69]" />
                </div>
                <li className='text-[21px] text-slate-500 gap-1 whitespace-nowrap '>
                  {listing.furnished ? 'Furnished' : 'Unfurnished'}
                </li>

              </div>
              <hr className=''
                style={{
                  width: '1px',
                  height: '4rem',
                  background: 'lightgray',
                  border: 'none',
                  margin: '0 3px',
                  display: 'inline-block',
                  transform: 'rotate(12deg)'
                }} />
              <div className='flex items-center mr-7 ml-7 flex-col'>

                <div className="flex items-center justify-center w-12 h-12 rounded-full border border-slate-400 mr-2">
                  <FaFire size={37} className="text-[#354f69]" />
                </div>
                <li className=' text-[21px] text-slate-500  gap-1 whitespace-nowrap '>
                  {listing.gas ? 'Gas Supply' : 'No Gas Supply'}
                </li>

              </div>
              <hr className=''
                style={{
                  width: '1px',
                  height: '4rem',
                  background: 'lightgray',
                  border: 'none',
                  margin: '0 3px',
                  display: 'inline-block',
                  transform: 'rotate(12deg)'
                }} />
              <div className='flex items-center mr-7 ml-7 flex-col'>

                <div className="flex items-center justify-center w-12 h-12 rounded-full border border-slate-400 mr-2">
                  <LucidePlug size={37} className="text-[#354f69]" />
                </div>
                <li className=' text-[21px] text-slate-500  gap-1 whitespace-nowrap '>
                  {listing.electricidy ? 'Electricity' : 'No Electricity'}
                </li>

              </div>
            </ul>
          </div>
          {/* OVERVIEW DESCRIPTION */}
          <div className=' flex flex-row text-[#354f69] '>


            <div className='h-[26vh] w-[53vw] mt-14 rounded-xl relative left-[10vw] bg-[#fffffe]   ' >
              <h1 className='text-2xl relative top-[3vh] ml-10 font-semibold'>Overview</h1>
              <p className='text-lg w-[50vw] mt-8 ml-10'>
                {listing.description}
              </p>
            </div>


          </div>
          {/* LANDLORD */}

          <div className='flex flex-col float-end top-[-26vh] left-[-9vw] relative' >

            <div className='text-[#354f69]' style={{
              backgroundImage: `url(${sideBarBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              width: '23vw',
              height: '56vh',

            }}>

              <div className='bg-[#fffffe] h-[50vh] rounded-lg  w-[21vw] relative mt-4 ml-4'>
                <h1 className='text-center relative text-2xl font-semibold pt-3 '>LandLord Details</h1>
                {landlord ? (
                  <>
                    <img
                      src={landlord.avatar || '/default-avatar.png'}
                      alt="Landlord"
                      className="w-28 h-28 rounded-full object-cover mt-4 mb-2 border border-slate-300 items-center mx-auto"
                    />



                    <Link to={`/user/${listing.userId}`}>

                      <p className="text-lg font-semibold text-[#354f69] text-center ">{landlord.firstName} {landlord.lastName}</p>

                    </Link>


                    <p className="text-center text-slate-500 text-sm">
                      {landlord.role}
                    </p>
                    <hr className='border-slate-300 w-[14vw] mt-4 text-center mx-auto ' />



                    <div className='flex flex-col text-sm mt-4 ml-7'>
                      <p>Location: </p>
                      <p>Email: </p>
                    </div>



                    <div className='flex flex-col text-sm relative top-[-5vh] ml-28'>
                      <p className="text-sm text-slate-500">{landlord.state}, {landlord.city}, {landlord.country}</p>
                      <p className="text-sm text-slate-500">{landlord.email}</p>
                    </div>
                    {/* Add more landlord details if needed */}
                  </>
                ) : (
                  <p className="text-center text-slate-400 mt-8">Loading landlord info...</p>
                )}

                <hr className='border-slate-300 w-[14vw]  text-center mx-auto top-[-2vh] relative ' />

                {/* {currentUser?.role !== 'landlord' && ( */}
                <div className="flex justify-center">
                  <button
                    className='bg-[#354f69] text-white rounded-lg  w-[18vw] p-2 mt-2 hover:bg-transparent hover:text-[#354f69] hover:scale-105 transition-all hover:border-[0.1rem] hover:border-[#354f69]'
                    onClick={handleContact}
                  >
                    Contact Landlord
                  </button>
                </div>

                {/* )} */}












              </div>
              {/* <div className=" rounded-xl p-4  bg-white w-[21vw] max-w-md mx-auto mt-3 ">
                <h2 className="text-xl font-semibold mb-4 text-center">Request a Booking</h2>

                <label className="block text-sm font-medium mb-1">
                  Choose Viewing Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={viewingDateTime}
                  onChange={(e) => setViewingDateTime(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg mb-4"
                />

                <button
                  onClick={handleBooking}
                  disabled={loading}
                  className='bg-[#354f69] text-white rounded-lg  w-[18vw] p-2 mt-4 relative ml-2 hover:bg-transparent hover:text-[#354f69] hover:scale-105 transition-all hover:border-[0.1rem] hover:border-[#354f69]'
                >
                  {loading ? "Sending..." : "Request Booking"}
                </button>

                {message && (
                  <div className="mt-4 text-sm text-center text-red-600">
                    {message}
                  </div>
                )}
              </div> */}

            </div>
          </div>





          {/*   MAP AND LOCATION */}


          <h1 className='text-2xl font-semibold text-[#354f69] mt-5 ml-52'>
            The Location:
          </h1>
          <MapComponent
            center={[listing.latitude, listing.longitude]}
            address={listing.address}
            className='-mt-3 '
          />


          {/* PROPERTY VIDEO */}

          {/* <h1 className='text-[#354f69] text-2xl font-semibold  left-[14vw] top-[10vh] relative  '>Property Video</h1>
          <div className='bg-white w-[79vw] h-[30vh] top-[13vh] relative left-[10vw]  rounded-lg '>
            {listing.videoUrls}
          </div> */}

          {/* <div className="mt-6">
              <h2 className="text-xl font-semibold z-10">Property Videos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {listing.videoUrl.map((url, index) => (
                  <video
                    key={index}
                    src={url}
                    controls
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                ))}
              </div>
            </div> */}
          {listing.videoUrls && Array.isArray(listing.videoUrls) && listing.videoUrls.length > 0 && (
            <div className="mt-24 ml-32  ">
              <h2 className="text-xl font-semibold z-10 ">Property Videos</h2>
              <div className=" gap-4">
                {listing.videoUrls.map((url, index) => (
                  <video
                    key={index}
                    src={url}
                    controls muted autoPlay loop
                    className="w-[76vw] overflow-hidden object-cover mt-9 ml-14 h-[50vh] relative  rounded-lg shadow-md"
                  />
                ))}
              </div>
            </div>
          )}


        </div>
      )}
      <div className="flex justify-center items-center mt-14" >


      </div>

    </main>
  );
}