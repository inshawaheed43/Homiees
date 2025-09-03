import React, { useEffect, useState } from "react";

export default function AdminBannedUsers() {
  const [bannedUsers, setBannedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBannedUsers = async () => {
      try {
        const res = await fetch("/api/admin/banned-users", {
          credentials: "include",
        });
        const data = await res.json();
        setBannedUsers(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching banned users:", err);
        setLoading(false);
      }
    };

    fetchBannedUsers();
  }, []);

  if (loading) return <div className="p-4">Loading banned users...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Banned Users</h2>
      {bannedUsers.length === 0 ? (
        <p>No banned users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Username</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {bannedUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="border p-2">{user.username}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
