import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const UserProfile = () => {
  const { userId } = useParams(); // ID of the profile being viewed
  const { currentUser } = useSelector((state) => state.user); // Logged-in user
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`/api/user/profile/${userId}`, {
          withCredentials: true,
        });
        setUserData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) return <p className="text-center p-4">Loading profile...</p>;
  if (!userData) return <p className="text-center p-4">User not found.</p>;

  const isSelf = currentUser._id === userData._id;
  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 bg-white rounded-xl shadow-lg space-y-4">
      <div className="flex items-center gap-4">
        <img
          src={userData.profilePicture || '/default-profile.png'}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h2 className="text-2xl font-semibold">{userData.username}</h2>
          <p className="text-sm text-gray-600 capitalize">{userData.role}</p>
        </div>
      </div>

      {(isAdmin || isSelf) && (
        <>
          <div>
            <h3 className="font-medium">Email:</h3>
            <p>{userData.email}</p>
          </div>
          <div>
            <h3 className="font-medium">Phone:</h3>
            <p>{userData.phoneNumber || 'N/A'}</p>
          </div>
          <div>
            <h3 className="font-medium">Address:</h3>
            <p>
              {userData.streetAddress || ''}, {userData.city}, {userData.state},{' '}
              {userData.country}
            </p>
          </div>
          <div>
            <h3 className="font-medium">Verified:</h3>
            <p>{userData.isVerified ? 'Yes' : 'No'}</p>
            <p>{userData.isManuallyVerified ? 'Manually Verified ✅' : 'Pending Manual'}</p>
          </div>
        </>
      )}

      {!(isAdmin || isSelf) && (
        <>
          <div>
            <h3 className="font-medium">Location:</h3>
            <p>
              {userData.city}, {userData.country}
            </p>
          </div>
          <p className="text-sm text-gray-400">Some info is hidden for privacy 🔐</p>
        </>
      )}
    </div>
  );
};

export default UserProfile;
