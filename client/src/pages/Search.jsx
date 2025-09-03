import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ListingItem from '../Components/ListingItem.jsx';
import searchFilterBg from '../assets/houses/search-filter-bg.png'

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    electricity: false,
    gas: false,
    sort: 'created_at',
    order: 'desc',
    minPrice: 0,
    maxPrice: 43000,
    location: '',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const listingsPerPage = 8;
  console.log(listings);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageFromUrl = Number(params.get('page')) || 1;
    setCurrentPage(pageFromUrl); // ✅ Move this to the top

    const urlParams = new URLSearchParams(location.search);
    urlParams.set('page', pageFromUrl);
    urlParams.set('limit', listingsPerPage);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const electricityFromUrl = urlParams.get('electricity');
    const gasFromUrl = urlParams.get('gas');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');
    const minPriceFromUrl = urlParams.get('minPrice');
    const maxPriceFromUrl = urlParams.get('maxPrice');
    const locationFromUrl = urlParams.get('location')

    setSidebardata({
      searchTerm: searchTermFromUrl || '',
      type: typeFromUrl || 'all',
      location: locationFromUrl || 'all',
      parking: parkingFromUrl === 'true',
      furnished: furnishedFromUrl === 'true',
      offer: offerFromUrl === 'true',
      electricity: electricityFromUrl === 'true',
      gas: gasFromUrl === 'true',
      sort: sortFromUrl || 'created_at',
      order: orderFromUrl || 'desc',
      minPrice: parseInt(minPriceFromUrl) || 0,
      maxPrice: parseInt(maxPriceFromUrl) || 43000,
    });

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      setShowMore(data.length > 8);
      setListings(data.listings || []); // backend should return { listings, total }
      console.log("TOTAL LISTINGS COUNT FROM BACKEND: ", data.total);

    if (typeof data.total === "number" && data.total > 0) {
    const calculatedPages = Math.ceil(data.total / listingsPerPage);
    setTotalPages(calculatedPages);
  } else {
    setTotalPages(1); // fallback to 1
  } setLoading(false);
    };

    fetchListings();
  }, [location.search, currentPage]);

  const handleChange = (e) => {
    const { id, value, checked, type } = e.target;
    if (['all', 'rent', 'sale'].includes(id)) {
      setSidebardata({ ...sidebardata, type: id });
    } else if (id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: value });
    } else if (['parking', 'furnished', 'offer', 'electricity', 'gas'].includes(id)) {
      setSidebardata({ ...sidebardata, [id]: checked });
    } else if (id === 'sort_order') {
      const [sort, order] = value.split('_');
      setSidebardata({ ...sidebardata, sort, order });
    } else if (id === 'minPrice' || id === 'maxPrice') {
      setSidebardata({ ...sidebardata, [id]: Number(value) });
    }
    else if (id === 'location') {
      setSidebardata({ ...sidebardata, location: value });
    }

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(sidebardata);
    urlParams.set("page", 1);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleReset = () => {
    navigate('/search');
  };

  return (
    <div className='flex flex-col md:flex-row'>


      <div style={{
        backgroundImage: `url(${searchFilterBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        top: '12vh',
        borderRadius: '10px',
        left: '7vw',
        height: '105vh'
      }}>

        <div className='p-7 md:w-[25vw] rounded-lg bg-white mt-24 ml-10 border shadow border-[#354f69] relative top-[-10vh] left-[-1vw]'
        >
          <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
            <p className='text-sm text-gray-400  ml-3'>I'm looking into: </p>
            <select
              className='border-b p-2 text-gray-500 outline-none text-lg relative top-[-2vh]'
              value={sidebardata.type}
              onChange={handleChange}
              id='type'
            >
              <option value='rent'>Rent</option>
              <option value='sale'>Buy</option>
            </select>
            <p className='text-sm text-gray-400  ml-3'> Keyword</p>
            <input
              type='text'
              id='searchTerm'
              placeholder='Rent, Sale...'
              className='border-b p-2 text-black  outline-none text-lg relative top-[-2vh] placeholder:text-gray-500'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />

            <input
              type='text'
              id='location'
              placeholder='Location (e.g. Washington DC)'
              className='border-b p-2 text-[#354f69] placeholder-gray-400  outline-none'
              value={sidebardata.location}
              onChange={handleChange}
            />


            <div className='flex flex-row gap-2'>

              <section className='flex flex-col'>

                <p className='text-sm text-gray-400  ml-2'>Bed</p>
                <select className='w-[10vw] border-b p-2 text-lg' >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                </select>
              </section>
              <section className='flex flex-col' >

                <p className='text-sm text-gray-400 ml-2'>Bath</p>
                <select className='w-[10vw] border-b p-2 text-lg' >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                </select>

              </section>

            </div>

            <h4 className='text-md  font-bold'> Amenities: </h4>
            <div className='grid grid-cols-2 gap-2 text-md text-gray-500  '>
              {['parking', 'furnished', 'offer', 'electricity', 'gas'].map((amenity) => (
                <label key={amenity} className='flex items-center gap-1 capitalize'>
                  <input
                    type='checkbox'
                    id={amenity}
                    checked={sidebardata[amenity]}
                    onChange={handleChange}
                  />
                  {amenity.replace(/^(.)/, (c) => c.toUpperCase())} Supply
                </label>
              ))}
            </div>

            <div>
              <label className='text-md font-bold'>Price Range:</label>
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='minPrice'
                  className='border p-2 w-full mt-2 focus:outline-none placeholder:text-gray-400'
                  placeholder='0'
                  value={sidebardata.minPrice}
                  onChange={handleChange}
                />
                <span>-</span>
                <input
                  type='number'
                  id='maxPrice'
                  className='border p-2 w-full focus:outline-none placeholder:text-gray-400'
                  placeholder='43000'
                  value={sidebardata.maxPrice}
                  onChange={handleChange}
                />
                <span className='text-xs text-gray-400'>PKR</span>
              </div>
            </div>

            <div>
              <label className='text-sm font-bold'>Sort By</label>
              <select
                id='sort_order'
                onChange={handleChange}
                defaultValue='created_at_desc'
                className='border-b p-2 w-full'
              >
                <option value='regularPrice_desc'>Price high to low</option>
                <option value='regularPrice_asc'>Price low to high</option>
                <option value='createdAt_desc'>Latest</option>
                <option value='createdAt_asc'>Oldest</option>
              </select>
            </div>

            <button className='bg-[#354f69] text-white p-3 rounded-lg hover:bg-[#557ea7] transition-all'>
              SEARCH
            </button>
            <button type='button' onClick={handleReset} className='text-sm text-[#354f69] hover:underline hover:text-[#557ea7] transition-all '>
              ⟳ Reset Filter
            </button>
          </form>
        </div>

      </div>






      <div className='flex-1 px-4'>
        <h1 className='text-sm  font-extralight text-[#354f69] mt-24 ml-36'>
          Showing {Array.isArray(listings) && listings.length > 0 ? `1-${listings.length}` : '0'} of {Array.isArray(listings) ? listings.length : 0} results
        </h1>

        <div className='grid gap-6'>
          {!loading && Array.isArray(listings) && listings.length === 0 && (
            <p className='text-xl text-[#354f69]  text-center'>No listing found!</p>
          )}
          {loading && (
            <p className='text-xl text-[#354f69] -700 text-center w-full'>
              Loading...
            </p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} layout='list' />

            ))}


          {typeof totalPages === "number" && totalPages > 0 && (
            <div className="flex gap-6 items-center justify-center mt-8">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const params = new URLSearchParams(location.search);
                    params.set('page', idx + 1);
                    navigate(`/search?${params.toString()}`);
                  }}

                  className={`w-10 h-10 rounded ${currentPage === idx + 1 ? "bg-black text-white" : "bg-transparent text-black"}`}
                >
                  {idx + 1}
                </button>
              ))}
              {currentPage < totalPages && (
                <button
                  onClick={() => {
                    const params = new URLSearchParams(location.search);
                    params.set('page', currentPage + 1);
                    navigate(`/search?${params.toString()}`);
                  }}
                  className="text-black text-xl"
                >
                  →
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
