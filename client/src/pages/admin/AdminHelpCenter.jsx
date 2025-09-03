import React, { useEffect, useState } from "react";

export default function AdminHelpCenter() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);

  const fetchHelpRequests = async () => {
  try {
    const res = await fetch("/api/admin/help-requests", {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    console.log("🔍 API Response Data:", data); // Add this line!
   if (data.success === false || !Array.isArray(data)) {
      throw new Error(data.message || "Invalid data format");
    }
    setRequests(data);
  } catch (err) {
console.error("❌ Failed to fetch help requests:", err);
    setError("Failed to fetch help requests.");
    setRequests([]);  }
};
  const handleResolve = async (id) => {
    try {
      const res = await fetch(`/api/admin/help-requests/${id}/resolve`, {
        method: "PUT",
        credentials: "include",
      });
      const data = await res.json();
         console.log('Fetched Help Requests:', data); 
      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: "resolved" } : req
        )
      );
    } catch (err) {
      console.error("Error resolving request:", err);
    }
  };

  useEffect(() => {
    fetchHelpRequests();
  }, []);
  const handleDelete = async (id) => {
  try {
    const res = await fetch(`/api/admin/help-requests/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    if (data.success !== false) {
      setRequests((prev) => prev.filter((req) => req._id !== id));
    }
  } catch (err) {
    console.error("Error deleting request:", err);
  }
};

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Help Requests</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto">
        <table className="w-full bg-white border rounded shadow-md">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">User</th>
              <th className="p-3">Email</th>
                            <th className="p-3">Role</th>

              <th className="p-3">Issue</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id} className="border-t">
                <td className="p-3">{req.userId?.username || "Unknown"}</td>
                <td className="p-3">{req.userId?.email || "N/A"}</td>
        <td className="p-3">{req.userId?.role || "N/A"}</td>

                <td className="p-3 text-wrap">{req.message}</td>
                <td className="p-3 capitalize">{req.status}</td>
                <td className="p-3">
                  {req.status !== "resolved" && (
                    <button
                      onClick={() => handleResolve(req._id)}
                      className="text-green-600 hover:underline"
                    >
                      Mark as Resolved
                    </button>
                  )}
                
        
                  <button
                    onClick={() => handleDelete(req._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
