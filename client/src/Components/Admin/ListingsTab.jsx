// client/src/components/Admin/ListingsTab.jsx

import React, { useEffect, useState } from "react";

export default function ListingsTab() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchListings = async () => {
    try {
      const res = await fetch("/api/admin/listings", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setListings(data);
      } else {
        setError(data.message || "Failed to fetch listings");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const deleteListing = async (listingId) => {
    const confirmDelete = window.confirm("Delete this listing?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/admin/listings/${listingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setListings((prev) => prev.filter((l) => l._id !== listingId));
      } else {
        alert("Failed to delete listing");
      }
    } catch (err) {
      alert("Error occurred while deleting listing.");
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  if (loading) return <p>Loading listings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">City</th>
            <th className="p-2 border">Owner</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((l) => (
            <tr key={l._id}>
              <td className="p-2 border">{l.title}</td>
              <td className="p-2 border">{l.city}</td>
              <td className="p-2 border">{l.owner?.username || "N/A"}</td>
              <td className="p-2 border">
                <button
                  onClick={() => deleteListing(l._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
