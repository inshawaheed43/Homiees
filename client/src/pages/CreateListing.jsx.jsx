import { useEffect, useState } from "react";
import axios from 'axios'
import { useSelector } from 'react-redux'

import { useNavigate } from 'react-router-dom';
import MapComponent from "../Components/Map";
import { TileLayer } from "react-leaflet";
import DraggableMarker from "../Components/DraggableMarker";


export default function CreateListing() {
  const navigate = useNavigate()
  const { currentUser } = useSelector(state => state.user)
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setImageError] = useState(null);
  const [submitError, setSubmitError] = useState(false);
  const [loading, setLoading] = useState(false)
  const [videoUrls, setVideoUrls] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    videoUrls: [],
    description: '',
    address: '',
    type: 'rent',
    parking: false,
    furnished: false,
    offer: false,
    electricity: false,
    gas: false,
    city: '',
    state: '',
    country: '',
    bedrooms: '1',
    bathrooms: '1',
    latitude: 32.1617,   // Gujranwala default
    longitude: 74.1883,
    regularPrice: '50',
    discountedPrice: '0',
  });
  console.log(formData)
  const MAX_IMAGES = 6;










  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith("image/"));
    const videoFiles = files.filter(file => file.type.startsWith("video/"));

    const totalImages = imageFiles.length + imageUrls.length;
    if (totalImages > MAX_IMAGES) {
      setImageError(`You can only upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    setSelectedFiles(imageFiles);
    setVideoFiles(videoFiles);
    setImageError(null);
  };
  const handleUploadClick = async () => {
    setIsUploading(true);
    setImageError(null);

    const uploadImagePromises = selectedFiles.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'insha_first_time_at_cloudinary');
      formData.append("cloud_name", "dvhgcryak");

      try {
        const res = await axios.post(
          'https://api.cloudinary.com/v1_1/dvhgcryak/image/upload',
          formData
        );
        return res.data.secure_url;
      } catch (err) {
        console.error('Image upload error:', err);
        return null;
      }
    });

    const uploadVideoPromises = videoFiles.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'insha_first_time_at_cloudinary');
      formData.append("cloud_name", "dvhgcryak");

      try {
        const res = await axios.post(
          'https://api.cloudinary.com/v1_1/dvhgcryak/video/upload',
          formData
        );
        return res.data.secure_url;
      } catch (err) {
        console.error('Video upload error:', err);
        return null;
      }
    });

    const imageResults = await Promise.all(uploadImagePromises);
    const validImages = imageResults.filter(Boolean);

    const videoResults = await Promise.all(uploadVideoPromises);
    const validVideos = videoResults.filter(Boolean);

    setImageUrls(prev => [...prev, ...validImages]);
    setVideoUrls(prev => [...prev, ...validVideos]);

    setFormData(prev => ({
      ...prev,
      imageUrls: [...prev.imageUrls, ...validImages],
      videoUrls: [...prev.videoUrls, ...validVideos],
    }));

    setSelectedFiles([]);
    setVideoFiles([]);
    setIsUploading(false);
  };
  const handleRemoveImage = (indexToRemove) => {
    const updatedUrls = imageUrls.filter((_, index) => index !== indexToRemove);
    setImageUrls(updatedUrls);
  };
  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id
      })

    }
    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setFormData({
        //...formData is to save prev info
        ...formData,
        [e.target.id]: e.target.checked
      })
    }
    if (e.target.id === 'electricity' || e.target.id === 'gas') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked
      })
    }

    if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value
      })
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      if (formData.imageUrls.lenght < 1) {

        return setSubmitError('Show your Property! Upload Some Pics')
      }
      if (formData.videoUrls.length < 1) {
        return setSubmitError('Show your Property! Upload Video')
      }
      if (+formData.regularPrice < +formData.discountedPrice)
        return setSubmitError('Discount price must be lower than regular price');

      setLoading(true)
      setSubmitError(false)
      console.log("🚀 SENDING TO BACKEND:", formData);
      const res = await fetch('/api/listing/create', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({

          ...formData,
          userRef: currentUser._id,
          landlordRef: currentUser._id,
          

        })
      })
      const data = await res.json()
      setLoading(false)

      if (data.success === false) {
        setSubmitError(data.message)

      }

      navigate(`/listing/${data._id}`);

    } catch (submitError) {
      setSubmitError(submitError.message)
      console.log(submitError)
      setLoading(false)

    }
  }
  const reverseGeocode = async (lat, lon) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
      const data = await res.json();
      console.log("📍 Reverse geocode result:", data);
      return {
        address: data.address.road || '',
        city: data.address.city || data.address.town || data.address.village || '',
        state: data.address.state || '',
        country: data.address.country || '',
      };
    } catch (error) {
      console.error("⚠️ Reverse geocoding failed:", error);
      return null;
    }
  };




















  return (

    <main className=" overflow-x-hidden p-3 left-[12vw] relative mt-10  mx-auto">

      <h1 className="text-3xl font-semibold text-center my-7">
        Add Your Property
      </h1>
      <form onSubmit={handleSubmit} action="" className="flex flex-col gap-4 ">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="focus:border p-3 w-[25vw] rounded-lg "
            id="name"
            // maxLength="62"
            // minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />

          <textarea
            type="text"
            placeholder="Description"
            className="focus:border p-3 w-[25vw] rounded-lg  "
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />

          <input
            type="text"
            placeholder="Address"
            className="focus:border p-3 w-[25vw] rounded-lg "
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <input
            type="text"
            placeholder="City"
            className="focus:border p-3 w-[25vw] rounded-lg"
            id="city"
            required
            onChange={handleChange}
            value={formData.city}
          />

          <input
            type="text"
            placeholder="State / Province"
            className="focus:border p-3 w-[25vw] rounded-lg"
            id="state"
            required
            onChange={handleChange}
            value={formData.state}
          />

          <input
            type="text"
            placeholder="Country"
            className="focus:border p-3 w-[25vw] rounded-lg"
            id="country"
            required
            onChange={handleChange}
            value={formData.country}
          />

        


{/* CHECKBOX */}

          <div className="flex gap-6 w-[25vw] left-[-30vw] flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5"
                onChange={handleChange}
                checked={formData.type === 'sale'} />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5"
                onChange={handleChange}

                checked={formData.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5"

                onChange={handleChange}
                checked={formData.parking} />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" onChange={handleChange}
                checked={formData.furnished} />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="gas" className="w-5" onChange={handleChange}
                checked={formData.gas} />
              <span>Gas Supply</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="electricity" className="w-5" onChange={handleChange}
                checked={formData.electricity} />
              <span>Electricity</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" onChange={handleChange}
                checked={formData.offer} />
              <span>Have any Offer</span>
            </div>


          </div>
          <div className="flex flex-wrap w-[20vw] gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Bedroom/s</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Bath/s</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">(PKR/month)</span>
              </div>
            </div>

            {formData.offer && (

              <div>
                <input
                  type="number"
                  id="discountedPrice"
                  min="0"
                  max="10000000"
                  required
                  className="p-3 border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountedPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  <span className="text-xs">(PKR/month)</span>
                </div>
              </div>
            )}

          </div>

<div className="relative top-[-90vh] left-[29vw]" > 


            <h2 className="text-lg font-semibold relative top-[2vw]">📍 Set Exact Property Location</h2>
          <div className="w-[100vw] overflow-hidden h-[70vh] relative left-[-10vw] rounded-lg   ">
            <MapComponent
              center={[formData.latitude, formData.longitude]}
              zoom={20}
              scrollWheelZoom={true}
              style={{ height: '96%', width: '97%' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <DraggableMarker
                position={[formData.latitude, formData.longitude]}
                onDragEnd={async (lat, lon) => {
                  console.log("📍 Dragged to:", lat, lon);

                  // 1. Set new lat/lon
                  setFormData(prev => ({
                    ...prev,
                    latitude: lat,
                    longitude: lon,
                  }));

                  // 2. Fetch address details
                  const reverse = await reverseGeocode(lat, lon);

                  if (reverse) {
                    setFormData(prev => ({
                      ...prev,
                      address: reverse.address,
                      city: reverse.city,
                      state: reverse.state,
                      country: reverse.country,
                    }));
                  }
                }}
              />

            </MapComponent>
          </div>
</div>








        </div>



        <div className="flex flex-col flex-1 relative top-[-70vh] w-[50vw] left-[9vw] gap-4">
          <p className="font-semibold">
            Display Your Property:
            <span className="font-normal text-gray-700 ml-2">
              The first image will be the Cover (Max 6){" "}
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-300 rounded-lg w-full"
              type="file"
              id="images"
              onChange={handleFileChange}
              accept="image/*, video/*"
              multiple
            />
            <button
              type='button'
              className='p-3  border-[#354f69] border rounded-lg  hover:bg-[#354f69] text-[#354f69]  transition-all hover:text-white hover:border-none disabled:opacity-80 cursor-pointer '
              onClick={handleUploadClick}
              disabled={isUploading || (selectedFiles.length === 0 && videoFiles.length === 0)}


            >
              Upload
            </button>
          </div>

          {isUploading && <p>Uploading image(s)/Video(s)...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'row',
              marginTop: '20px',
              justifyContent: 'space-between',
            }}
          >
            {imageUrls.map((url, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <img
                  className="w-40 h-40 object-cover rounded-lg"
                  src={url}
                  alt={`uploaded-${index}`}
                  style={{ width: '150px', height: '150px', objectFit: 'cover', margin: '10px' }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="ml-20 px-3 py-1 bg-slate-700 text-white rounded-full hover:bg-red-500 hover:shadow-md  "
                >
                  Remove
                </button>

              </div>
            ))}
          </div>
          <div className="mt-4">
            <h2 className="font-semibold mb-2">Uploaded Videos: <span className="text-xs text-gray-500 "> (Upload video in landscape mode)</span></h2>
            {videoUrls.map((url, index) => (
              <div key={index} className="mb-4">
                <video controls className="w-full max-w-md rounded">
                  <source src={url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>










          <button disabled={loading || isUploading} className="p-3 bg-slate-700 text-white rounded-lg hover: opacity-95 disabled:opacity-80"

          >
            {loading ? 'Creating...' : "Create Listing"

            }
          </button>
          {submitError && <p className="text-red-700 text-sm">{submitError}</p>}
        </div>

      </form>

    </main >
  );
}


