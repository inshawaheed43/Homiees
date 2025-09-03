import React from 'react'
import { useState } from 'react';
import { Heart, LucideMapPin, LucideFlame, LucideShowerHead, LucideBedDouble, LucideBookmarkCheck, LucideBookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Use solid heart icons
import { useEffect } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

const ListingItem1 = ({ listing }) => {
  const [activeImage, setActiveImage] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  // const [isSaved, setIsSaved] = useState(false);


  // useEffect(() => {
  //   if (currentUser?.savedListings?.includes(listing._id)) {
  //     setIsSaved(true);
  //   }
  // }, [currentUser, listing._id]);

  // const handleToggleSave = async () => {
  //   if (!currentUser) {
  //     alert("Please sign in to save listings.");
  //     return;
  //   }
  //   try {
  //     const endpoint = isSaved
  //       ? `/api/user/unsave-listing/${listing._id}`
  //       : `/api/user/save/${listing._id}`;
  //     const method = isSaved ? "PUT" : "POST";

  //     console.log("🔗 Hitting endpoint:", endpoint);
  //     console.log("🧪 Listing ID:", listing._id);

  //     const res = await fetch(endpoint, {
  //       method,
  //       headers: {
  //         "Content-Type": "application/json", // even though there's no body
  //       },
  //       credentials: "include",
  //     });


  //     const data = await res.json();

  //     if (res.ok) {
  //       setIsSaved((prev) => !prev);
  //       console.log(`✅ Listing ${isSaved ? "unsaved" : "saved"} successfully.`);
  //     } else {
  //       console.error("❌ Failed to save/unsave listing:", data.message || data);
  //     }
  //   } catch (err) {
  //     console.error("🔥 Save/Unsave failed:", err);
  //   }
  // };



  return (
    <div className="w-[22vw] rounded-lg overflow-hidden h-[68vh] hover:scale-95 cursor-pointer transition-all  hover:shadow-lg bg-white relative">
    


        {/* Image Container */}
        <div className="relative">
          <img
            src={listing.imageUrls[activeImage]}
            alt="Property"
            className="relative w-[20vw] h-[35vh] top-4 left-4 right-2 rounded-lg"
          />
          {/* Heart Icon */}
    {/* {(currentUser?.role === 'landlord' || currentUser?.role === 'tenant') && (
  <button
    className="absolute z-20 top-5 right-5 bg-white/70 hover:bg-slate-600 rounded-full p-2"
    onClick={handleToggleSave}
  >
    {isSaved ? (
      <FaBookmark className="w-4 h-4 text-red-500" />
    ) : (
      <FaRegBookmark className="w-4 h-4 text-slate-500" />
    )}
  </button>
)} */}



          {/* Tabs for image switching */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-2">
            {listing.imageUrls.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`w-5 h-[0.3rem] rounded-full ${activeImage === index ? 'bg-yellow-200' : 'bg-white'
                  }`}
              />

            ))}

          </div>
        </div>
  <Link to={`/listing/${listing._id}`} >
        {/* Property Info */}
        <div className="p-4 text-wrap  text-slate-600">

{/* PROPERTY NAME */}
          <h3 className="text-2xl mt-5 font-semibold">
            {listing.name.length > 20
              ? `${listing.name.slice(0, 20)}...`
              : listing.name}
          </h3>

              {/* ADDRESS */}

        
          <div className='flex-wrap flex flex-row mt-3'>
            <LucideMapPin></LucideMapPin>
            <p className="text-sm text-gray-500">{listing.address.length > 20
              ? `${listing.address.slice(0, 20)}...`
              : listing.address}</p>
          </div>

{/* PROPERTY FEATURES */}

          <div className="mt-5 flex flex-wrap gap-5 items-center ml-4 text-sm text-gray-600">
            <div className='flex flex-col items-center'>
              <LucideFlame />
              <span>{listing.gas ? 'Gas Supply' : 'No Supply'}</span>
            </div>

            <hr className=''
              style={{
                width: '1px',
                height: '2rem',
                background: 'gray',
                border: 'none',
                margin: '0 3px',
                display: 'inline-block',
                transform: 'rotate(12deg)'
              }} />

            <div className='flex flex-col items-center'>
              <LucideBedDouble />
              <span>{listing.bedrooms} Beds</span>
            </div>
            <hr className=''
              style={{
                width: '1px',
                height: '2rem',
                background: 'gray',
                border: 'none',
                margin: '0 3px',
                display: 'inline-block',
                transform: 'rotate(12deg)'
              }} />

            <div className='flex flex-col items-center'>
              <LucideShowerHead />
              <span>{listing.bathrooms} Beds</span>
            </div>


          </div>



{/* PRICE */}
          <div className='mt-4 ml-4 mr-32 border-[0.1rem] rounded-lg p-2 w-auto text-center border-slate-300 shadow-md'>

            <span className="font-bold text-slate-500">{listing.regularPrice} Pkr</span>
          </div>


{/* PROPERTY BOOKED */}
          {listing.booked && (
            <span className=" text-slate-400  top-[-5.5vh] relative float-end gap-2 text-sm border-slate-400 border-[0.1px] px-2 py-1 left-[-1vw] rounded-md w-24 flex flex-row">
              Booked <LucideBookmarkCheck> </LucideBookmarkCheck>
            </span>
          )}
        </div>
      </Link>
    </div>
  )
}
export default ListingItem1;

