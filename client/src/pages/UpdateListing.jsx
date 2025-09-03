import { useEffect, useState } from "react";
import axios from 'axios'
import { useSelector } from 'react-redux'

import { useNavigate, useParams, } from 'react-router-dom';


export default function CreateListing() {
    const navigate = useNavigate()
    const params = useParams();
    const { currentUser } = useSelector(state => state.user)
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setImageError] = useState(null);
    const [submitError, setSubmitError] = useState(false);
    const [loading, setLoading] = useState(false)
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
        city: '',
        state: '',
        country: '',
        electricity: false,
        gas: false,
        bedrooms: '1',
        bathrooms: '1',
        booked:'false',
        regularPrice: '50',
        discountedPrice: '0',
    });

    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId;
            const res = await fetch(`/api/listing/get/${listingId}`);
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            setFormData({
  ...data,
  booked: Boolean(data.booked),
});
        };

        fetchListing();
    }, []);




    const MAX_IMAGES = 6;











    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const totalImages = files.length + imageUrls.length;

        if (totalImages > MAX_IMAGES) {
            setImageError(`You can only upload a maximum of ${MAX_IMAGES} images.`);
            return;
        }

        console.log('Selected files:', files);
        setSelectedFiles(files);
        setImageError(null);
    };
    const handleUploadClick = async () => {
        setIsUploading(true);
        setImageError(null);

        const uploadPromises = selectedFiles.map(async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'insha_first_time_at_cloudinary');

            try {
                const res = await axios.post(
                    'https://api.cloudinary.com/v1_1/dvhgcryak/image/upload',
                    formData
                );

                if (res.status === 200) {
                    return res.data.secure_url;
                } else {
                    throw new Error('Upload failed');
                }
            } catch (err) {
                console.error('Upload error:', err);
                setImageError('Failed to upload one or more images.');
                return null;
            }
        });

        const results = await Promise.all(uploadPromises);
        const validUrls = results.filter(Boolean);
        setImageUrls((prev) => [...prev, ...validUrls]);
        setSelectedFiles([]);
        setIsUploading(false);
        setFormData((prevFormData) => {
            const updatedFormData = {
                ...prevFormData,
                imageUrls: [...prevFormData.imageUrls, ...validUrls],
            }
            console.log('Updated formData', updatedFormData);
            return updatedFormData;
        }

        )
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

            if (formData.imageUrls.length < 0)
                return setSubmitError('Show your Property! Upload Some Pics')
            if (+formData.regularPrice < +formData.discountedPrice)
                return setSubmitError('Discount price must be lower than regular price');

            setLoading(true)
            setSubmitError(false)
            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method: "POST",
            
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({

                    ...formData,
                    userRef: currentUser._id
                })
            })
            const data = await res.json()
            setLoading(false)

            if (data.success === false) {
                setSubmitError(data.message)
            }
            navigate(`/listing/${data._id}`)
        } catch (submitError) {
            setSubmitError(submitError.message)
            setLoading(false)

        }

    }



















    return (

        <main className="p-3 max-w-4xl mx-auto">

            <h1 className="text-3xl font-semibold text-center my-7">
                Edit Your Property
            </h1>
            <form onSubmit={handleSubmit} action="" className="flex flex-col sm:flex-row gap-4 ">
                <div className="flex flex-col gap-4 flex-1">
                    <input
                        type="text"
                        placeholder="Name"
                        className="focus:border p-3 rounded-lg "
                        id="name"
                        maxLength="62"
                        minLength="10"
                        required
                        onChange={handleChange}
                        value={formData.name}
                    />

                    <textarea
                        type="text"
                        placeholder="Description"
                        className="focus:border p-3 rounded-lg  "
                        id="description"
                        required
                        onChange={handleChange}
                        value={formData.description}
                    />

                    <input
                        type="text"
                        placeholder="Address"
                        className="focus:border p-3 rounded-lg "
                        id="address"
                        required
                        onChange={handleChange}
                        value={formData.address}
                    />
                    <input
  type="text"
  placeholder="City"
  className="focus:border p-3 rounded-lg"
  id="city"
  required
  onChange={handleChange}
  value={formData.city}
/>

<input
  type="text"
  placeholder="State / Province"
  className="focus:border p-3 rounded-lg"
  id="state"
  required
  onChange={handleChange}
  value={formData.state}
/>

<input
  type="text"
  placeholder="Country"
  className="focus:border p-3 rounded-lg"
  id="country"
  required
  onChange={handleChange}
  value={formData.country}
/>

                    <div className="flex gap-6 flex-wrap">
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

            <div className="flex items-center gap-3 mt-3">
<label className="flex items-center gap-2 mt-4">
  <input
    type="checkbox"
    id="booked"
    checked={formData.booked}
    onChange={(e) =>
      setFormData({ ...formData, booked: e.target.checked })
    }
  />
  Mark as Booked
</label>

            </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="offer" className="w-5" onChange={handleChange}
                                checked={formData.offer} />
                            <span>Have any Offer</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
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
                            <p>Beds</p>
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
                            <p>Baths</p>
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
                                <span className="text-xs">($/month)</span>
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
                                    <span className="text-xs">($/month)</span>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-4">
                    <p className="font-semibold">
                        Display Your Property:
                        <span className="font-normal text-gray-700 ml-2">
                            The first image will be the Cover (Max 6){" "}
                        </span>
                    </p>
                    <div className="flex gap-4">
                        <input
                            className="p-3 border border-gray-300 rounded w-full"
                            type="file"
                            id="images"
                            onChange={handleFileChange}
                            accept="image/*"
                            multiple
                        />
                        <button
                            type='button'
                            className='p-3 text-green-700 border border-green-700 rounded uppercase hover:bg-green-600 hover:text-white hover:border-none disabled:opacity-80 cursor-pointer '
                            onClick={handleUploadClick}
                            disabled={isUploading || selectedFiles.length === 0}

                        >
                            Upload
                        </button>
                    </div>

                    {isUploading && <p>Uploading image(s)...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            flexDirection: 'column',
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
                    <button disabled={loading || isUploading} className="p-3 bg-slate-700 text-white rounded-lg hover: opacity-95 disabled:opacity-80"

                    >
                        {loading ? 'Creating...' : "Update Listing"

                        }
                    </button>
                    {submitError && <p className="text-red-700 text-sm">{submitError}</p>}
                </div>

            </form>

        </main >
    );
}


