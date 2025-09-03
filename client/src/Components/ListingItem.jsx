import { LucideBookmarkCheck } from 'lucide-react';
import { Link } from 'react-router-dom';




export default function ListingItem({ listing }) {

  return (
    <div
    >
      <Link to={`/listing/${listing._id}`} className='group'>
        <div className='flex flex-row w-[50vw] top-10 rounded-xl  bg-white relative left-[12vw]  '>

          <img src={
            listing.imageUrls && listing.imageUrls.length > 0
              ? listing.imageUrls[0]
              : 'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
          }
            alt="listing cover"
            className="h-[320px] my-4  w-[17vw] rounded-lg mx-6 object-cover " />


          <div>
            <p className="  mt-4 text-3xl font-semibold text-[#354f69] -700 group-hover:text-[#446586] transition-colors duration-300 ">{listing.name}</p>
            <div className="flex items-center gap-1 mt-5">
              <p className="text-sm text-slate-600 truncate -top-3 relative flex flex-wrap" >{listing.address}</p>
            </div>
            <hr className='w-[27vw] border-[-0.1rem]  mt-2  border-black ' />


            <div className="flex gap-9 mt-4 text-[#354f69] -700">
              <div className="font-bold text-sm flex items-center">
                <span className="mr-1">{listing.bedrooms}</span>
                {listing.bedrooms > 1 ? 'Beds' : 'Bed'}
              </div>
              <hr className=''
                style={{
                  width: '1px',
                  height: '2rem',
                  background: '#000',
                  border: 'none',
                  margin: '0 3px',
                  display: 'inline-block',
                  transform: 'rotate(12deg)'
                }} />
              <div className="font-bold text-sm flex items-center">
                <span className="mr-1">{listing.bathrooms}</span>
                {listing.bathrooms > 1 ? 'Baths' : 'Bath'}
              </div>
              <hr className='w-[-0.2rem]'
                style={{
                  width: '1px',
                  height: '2rem',
                  /* adjust as needed */
                  background: '#000',   /* color */
                  border: 'none',
                  margin: '0 3px',      /* horizontal spacing */
                  display: 'inline-block',
                  transform: 'rotate(12deg)'
                }} />
              <div className="font-bold text-sm flex items-center">
                <span className="mr-1">{listing.electricity ? 'Electricity' : 'No Electricity'}</span>

              </div>

              <hr className='w-[-0.2rem]'
                style={{
                  width: '1px',
                  height: '2rem',
                  /* adjust as needed */
                  background: '#000',   /* color */
                  border: 'none',
                  margin: '0 3px',      /* horizontal spacing */
                  display: 'inline-block',
                  transform: 'rotate(12deg)'
                }} />  <div className="font-bold text-sm flex items-center">
                <span className="mr-1">{listing.bathrooms}</span>
                {listing.bathrooms > 1 ? 'Baths' : 'Bath'}
              </div>

            </div>
            <hr className='w-[27vw] border-[-0.1rem]  mt-4  border-black ' />



            <p className="text-[#354f69] -700 mt-4 font-semibold text-3xl ">
              $
              {listing.offer
                ? listing.discountedPrice.toLocaleString('en-PK', {
                  style: 'currency',
                  currency: 'PKR'
                })
                : listing.regularPrice.toLocaleString('en-PK', {
                  style: 'currency',
                  currency: 'PKR'
                })}
              {listing.type === 'rent' && <span className="text-sm "> / month</span>}
            </p>
            {listing.booked && (
              <span className=" text-slate-400 relative  text-sm border-slate-400 border-[0.1px] px-2 py-1 top-1 rounded-md w-24 flex flex-row">
                Booked <LucideBookmarkCheck> </LucideBookmarkCheck>
              </span>
            )}

          </div>

        </div>





      </Link>

    </div>






















    //  <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-xl w-full sm:w-[350px] relative  flex flex-row ">
    //     <Link to={`/listing/${listing._id}`}>
    //       <div className="relative">
    //         <img
    //           src={
    //             listing.imageUrls && listing.imageUrls.length > 0
    //               ? listing.imageUrls[0]
    //               : 'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
    //           }
    //           alt="listing cover"
    //           className="h-[220px] w-full object-cover hover:scale-105 transition-transform duration-300"
    //         />
    //         <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-md">
    //           FOR SELL
    //         </span>
    //       </div>
    //       <div className="p-4 flex flex-col gap-2 w-full">
    //         <p className="truncate text-lg font-semibold text-[#354f69] -800">{listing.name}</p>

    //         <div className="flex items-center gap-1">
    //           <MdLocationOn className="h-4 w-4 text-green-700" />
    //           <p className="text-sm text-gray-600 truncate">{listing.address}</p>
    //         </div>

    //         <div className="grid grid-cols-4 gap-2 text-center text-gray-600 text-sm">
    //           <div>
    //             <p className="font-bold">{listing.squareFeet || '---'}</p>
    //             <p className="text-xs">sqft</p>
    //           </div>
    //           <div>
    //             <p className="font-bold">{listing.bedrooms}</p>
    //             <p className="text-xs">{listing.bedrooms > 1 ? 'Beds' : 'Bed'}</p>
    //           </div>
    //           <div>
    //             <p className="font-bold">{listing.bathrooms}</p>
    //             <p className="text-xs">{listing.bathrooms > 1 ? 'Baths' : 'Bath'}</p>
    //           </div>
    //           <div>
    //             <p className="font-bold">{listing.kitchens || '01'}</p>
    //             <p className="text-xs">Kitchen</p>
    //           </div>
    //         </div>

    //         <p className="text-slate-700 mt-2 font-bold text-xl">
    //           $
    //           {listing.offer
    //             ? listing.discountedPrice.toLocaleString('en-US')
    //             : listing.regularPrice.toLocaleString('en-US')}
    //           {listing.type === 'rent' && (
    //             <span className="text-sm font-normal"> / month</span>
    //           )}
    //         </p>

    //         <div className="flex justify-between items-center mt-2 text-gray-600">
    //           <div className="flex gap-2">
    //             <button>
    //               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
    //               </svg>
    //             </button>
    //             <button>
    //               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    //               </svg>
    //             </button>
    //             <button>
    //               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
    //               </svg>
    //             </button>
    //           </div>
    //           <button className="bg-black text-white p-2 rounded-full">
    //             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7M5 5h9v14H5z" />
    //             </svg>
    //           </button>
    //         </div>
    //       </div>
    //     </Link>
    //   </div>
  )
}