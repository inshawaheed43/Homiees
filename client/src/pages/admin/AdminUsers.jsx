import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AdminUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users", {
        credentials: "include",
      });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = async (userId, action) => {
    let endpoint = "";
    if (action === "verify") endpoint = "verify";
    if (action === "ban") endpoint = "ban";
    if (action === "unban") endpoint = "unban";

    try {
      await fetch(`/api/admin/users/${userId}/${endpoint}`, {
        method: "PUT",
        credentials: "include",
      });
      fetchUsers(); // Refresh list after action
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl mt-5 mb-4 text-center text-[#354f69]">All Users</h2>
      {loading ? (
        <p className="text-3xl mt-5 mb-4 text-center text-[#354f69]">Loading...</p>
      ) : (
        <table className="w-full ">
          <thead>
            <tr className="bg-[#354f69] text-[#F5EDE8] ">
              <th className="p-2">Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Verified</th>
              <th>Banned</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center border-t border-[0.1px] border-[#354f69]  ">
                <td>
                  <button
                    className="text-blue-600 hover:underline"
                   onClick={() => navigate(`/user/${user._id}?role=admin`)}

                  >
                    {user.username}
                  </button>
                </td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className="mt-4">{user.isManuallyVerified ? "✅" : "❌"}</td>
                <td className="mt-4">{user.isBanned ? "🚫" : "✅"}</td>
                <td className="space-x-2">
                  {!user.isManuallyVerified && (
                    <button
                      className="text-green-600"
                      onClick={() => handleAction(user._id, "verify")}
                    >
                      Verify
                    </button>
                  )}
                  {!user.isBanned ? (
                    <button
                      className="text-red-600"
                      onClick={() => handleAction(user._id, "ban")}
                    >
                      Ban
                    </button>
                  ) : (
                    <button
                      className="text-yellow-600"
                      onClick={() => handleAction(user._id, "unban")}
                    >
                      Unban
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
