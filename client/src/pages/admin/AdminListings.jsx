import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
export default function AdminListings() {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);

  const fetchListings = async () => {
    try {
      const res = await fetch("/api/admin/listings", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      console.log("📥 Listings fetched:", data);

      if (Array.isArray(data)) {
        setListings(data);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (err) {
      console.error("❌ Fetch Listings Error:", err);
      setError("Failed to fetch listings. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/listing/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Delete request failed");

      setListings((prev) => prev.filter((listing) => listing._id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err);
      setError("Failed to delete listing.");
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-4xl mt-4 mb-10 text-center">All Listings</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {listings.length === 0 ? (
        <p className="text-gray-600">No listings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white">
            <thead >
              <tr className="bg-[#273b4f] text-center text-2xl text-white ">
                <th className="px-3 py-6 ">Title</th>
                <th className="px-3 py-6">Image</th>
                <th className="px-3 py-6">Location</th>
                <th className="px-3 py-6">Owner</th>
                <th className="px-3 py-6">Action</th>
              </tr>
            </thead>
            <tbody className="items-center text-center text-wrap">
              {listings.map((listing) => (


                <tr key={listing._id} className="border-t  text-slate-600">

                  <Link to={`/listing/${listing._id}`} className="p-3 hover:underline">

                    <td className="py-6 text-lg ">{listing.name}</td>


                  </Link>

                  <td className="p-3 text-center ">
                    {listing.imageUrls && listing.imageUrls[0] ? (
                      <img
                        src={listing.imageUrls[0]}
                        alt={listing.title}
                        className="w-40 h-40 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="p-3">{listing.address}</td>
                  <td className="p-3">{listing.userRef?.username || "Unknown"}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(listing._id)}
                      className="text-red-800 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
