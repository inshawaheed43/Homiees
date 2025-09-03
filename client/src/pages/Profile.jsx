import React, { use, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { LucideBuilding, LucideHelpCircle, LucidePen, LucideTrash2, LucideBuilding2, LucideDoorOpen, LucideBookmarkCheck } from "lucide-react";
import strokeImg from "../assets/houses/storke-img.png";
import { FiMessageSquare } from "react-icons/fi";

import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUSerStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userslice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function Profile() {
  const [imageURL, setImageUrl] = useState();
  const fileRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser, error } = useSelector((state) => state.user);
  const { userId } = useParams();
  const [showListingError, setShowListingError] = useState(false);
  const [savedListings, setSavedListings] = useState([]);
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    password: "",
    avatar: currentUser?.avatar || "",
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    state: currentUser?.state || "",
    city: currentUser?.city || "",
    country: currentUser?.country || "",
    address: currentUser?.address || "",
  });
  const [unsaveSuccess, setUnsaveSuccess] = useState("");
  const [userDetails, setUserDetails] = useState({});
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const user = useSelector((state) => state.user.currentUser);
  const [listings, setListings] = useState([]);

  console.log("User in Profile Page:", user);

  const userState = useSelector((state) => state.user || { currentUser: null });
  const [activeTab, setActiveTab] = useState("account");
  const markNotificationAsRead = async (id) => {
    try {
      await fetch(`/api/notification/${id}/read`, {
        method: "PUT",
        credentials: "include",
      });

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };
  //   useEffect(() => {
  //   fetch('/api/user/saved', { credentials: 'include' })
  //     .then(res => res.json())
  //     .then(data => setListings(data));
  // }, []);
  const renderTabContent = () => {
    useEffect(() => {
      if (activeTab === 'notifications') {
        const fetchNotifications = async () => {
          try {
            const res = await fetch("/api/notification", {
              credentials: "include",
            });
            const data = await res.json();
            setNotifications(data);
          } catch (err) {
            console.error("Failed to fetch notifications", err);
          }
        };

        fetchNotifications();
      }
    }, [activeTab]);
    switch (activeTab) {
      case "account":
        return (
          <div className="flex flex-col gap-4 overflow-hidden relative text-[#354f69]">
            <h2 className="text-3xl font-bold mb-4 self-center">
              Account Settings
            </h2>
            <p className="self-center relative -top-6">
              Manage your account details, including username, email, and
              password.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-1 h-[47vh]"
            >
              <input
                type="text"
                id="firstName"
                placeholder="First Name"
                value={formData.firstName ?? currentUser.firstName}
                onChange={handleChange}
                className="border-[#354f69] border-[1px] p-3 rounded-lg w-[20vw] mt-1 relative left-[2.5vw]  "
              />
              <input
                type="text"
                id="lastName"
                placeholder="Last Name"
                defaultValue={formData.lastName}
                onChange={handleChange}
                className="border-[#354f69] border-[1px] p-3 rounded-lg w-[20vw]  mt-1 left-[2.5vw] relative "
              />
              <input
                type="text"
                placeholder="Username"
                id="username"
                defaultValue={formData.username ?? currentUser.username}
                className="border-[#354f69] border-[1px] p-3 rounded-lg w-[20vw] mt-1 left-[2.5vw] relative"
                onChange={handleChange}
              />
              <input
                type="email"
                placeholder="Email"
                defaultValue={formData.email ?? currentUser.email}
                className="border-[#354f69] border-[1px] p-3 rounded-lg  left-[2.5vw] relative  mt-1 w-[20vw]"
                onChange={handleChange}
              />
              <input
                type="password"
                placeholder="Password"
                defaultValue={formData.password ?? ""}
                className="border-[#354f69] border-[1px] p-3 rounded-lg w-[20vw] mt-1 left-[2.5vw] relative"
                onChange={handleChange}
              />
              <div className="flex flex-col top-[-34.3vh] left-[23vw]  gap-1 relative ">
                <input
                  type="text"
                  id="city"
                  placeholder="City"
                  value={formData.city || currentUser.city}
                  onChange={handleChange}
                  className="border-[#354f69] border-[1px] p-3 rounded-lg w-[20vw] mt-1 "
                />
                <input
                  type="text"
                  id="state"
                  placeholder="State"
                  value={formData.state ?? currentUser.state}
                  onChange={handleChange}
                  className="border-[#354f69] border-[1px] p-3 rounded-lg w-[20vw] mt-1 "
                />
                <input
                  type="text"
                  id="address"
                  placeholder="Street Address"
                  value={formData.address ?? currentUser.address}
                  onChange={handleChange}
                  className="border-[#354f69] border-[1px] p-3 rounded-lg w-[20vw] mt-1 "
                />
                <input
                  type="text"
                  id="country"
                  placeholder="Country"
                  value={formData.country || currentUser.country}
                  onChange={handleChange}
                  className="border-[#354f69] border-[1px] p-3 rounded-lg w-[20vw] mt-1 "
                />
              </div>

              <button
                disabled={loading}
                className=" w-[30vw] relative top-[-30vh]  self-center mt-12 bg-[#354f69] text-white rounded-lg p-3  hover:opacity-95 disabled:opacity-80 hover:scale-105 transition-all"
              >
                {loading ? "Loading..." : "Update"}
              </button>
            </form>
          </div>
        );
      case "listings":
        if (!currentUser) return null;
        if (currentUser.role === "landlord") {
          return (

            <div>

              <h2 className="text-xl font-semibold mb-4">Created Listings</h2>
              <>
                {userListings.length === 0 ? (
                  <div className="text-gray-600">
                    You haven't created any listings yet.
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {userListings.map((listing) => (
                      <div
                        key={listing._id}
                        className="p-3 flex border-b-[0.1px] border-slate-300 justify-between items-center gap-4"
                      >


                        <Link to={`/listing/${listing._id}`}>
                          <img
                            src={listing.imageUrls[0]}
                            alt="listing cover"
                            className="h-16 max-w-20 rounded-md object-contain"
                          />
                        </Link>
                        <Link
                          className="text-slate-700  font-semibold hover:underline truncate flex-1  relative -top-3"
                          to={`/listing/${listing._id}`}
                        >
                          <p>{listing.name}</p>
                        </Link>
                        {listing.booked && (
                          <span className=" text-slate-400 relative left-[-24.3vw] text-sm border-slate-400 border-[0.1px] px-2 py-1 top-5 rounded-md w-24 flex flex-row">
                            Booked <LucideBookmarkCheck> </LucideBookmarkCheck>
                          </span>
                        )}




                        <div className="flex flex-col item-center">
                          <button
                            onClick={() => handleListingDelete(listing._id)}
                            className="text-slate-700 border-[1px] border-slate-700 rounded-md px-3 py-1 hover:text-red-400 hover:border-red-400 hover:scale-95 transition-all text-sm gap-2 flex flex-row"
                          >
                            Delete<LucideTrash2></LucideTrash2>
                          </button>
                          <Link to={`/update-listing/${listing._id}`}>
                            <button className="text-slate-700 border-[1px] border-slate-700 rounded-md px-3 py-1 flex flex-row gap-2 text-sm hover:text-green-600 hover:border-green-600 hover:scale-95 mt-2 ml-5 transition-all">Edit <LucidePen></LucidePen></button>
                          </Link>
                        </div>

                      </div>
                    ))}

                  </div>
                )}
              </>

            </div>
          );
        }
        else if (currentUser.role === "tenant") {
          return (
            <div>

              <h2 className="text-xl font-semibold mb-4">My Saved Properties</h2>

{/* 
              {savedListings.length === 0 ? (

                <p>No listings saved yet.</p>
              ) : (




<ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {Array.isArray(savedListings) && savedListings.length > 0 ? (
    savedListings.map((listing) => (
      <li key={listing._id} className="border p-4 rounded shadow flex items-center gap-4">
        <img
          src={listing.imageUrls?.[0] || "/default-listing.jpg"}
          alt={listing.name || "Listing"}
          className="w-24 h-20 object-cover rounded"
        />
        <div className="flex-1">
          <h3 className="text-lg font-bold">{listing.name}</h3>
          <p>
            {listing.discountedPrice != null
              ? `$${listing.discountedPrice.toLocaleString()}`
              : listing.regularPrice != null
              ? `$${listing.regularPrice.toLocaleString()}`
              : "Price not available"}
          </p>
        </div>
      </li>
    ))
  ) : (
    <p className="text-gray-500">No saved listings found.</p>
  )}
</ul>




)} */}


 <div>
      <h1>My Saved Listings</h1>
      {listings.length === 0 && <p>No saved listings yet</p>}
      {listings.map(listing => (
        <div key={listing._id}>{listing.name}</div>
      ))}
    </div>

            </div>
          );
        }
      case "notifications":

        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            {notifications.length === 0 ? (
              <p className="text-gray-500">No new notifications</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {notifications.map((note, index) => (
                  <li
                    key={note._id || `notification-${index}`}
                    onClick={() => markNotificationAsRead(note._id)}
                    className={`p-4 rounded-md text-sm  cursor-pointer ${note.isRead 
                      }`}
                  >
                    <span className="block">
                      {note.type === "message" ? (
                        <Link to={`/chatroom/${note.chatId}`} className="text-blue-600 underline">
                          📩 {note.message}
                        </Link>
                      ) : (
                        <span>{note.message}</span>
                      )}

                    </span>


                    <span className="text-xs text-gray-500">
                      {new Date(note.createdAt).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      default:
        return null;
    }
  };
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) return;
    setLoading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "insha_first_time_at_cloudinary");
    data.append("cloud_name", "dvhgcryak");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dvhgcryak/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const uploadedImageURL = await res.json();
    setImageUrl(uploadedImageURL.url);
    setFormData((prev) => ({ ...prev, avatar: uploadedImageURL.url }));
    console.log(uploadedImageURL.url);
    setLoading(false);
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      const bodyData = {
        ...formData,
        avatar: imageURL || currentUser.avatar,
      };
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(bodyData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data.user));
      setUpdateSuccess(true);
      console.log("Submitting update with:", formData);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUSerStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };
  const handleShowListings = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listing/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingError(true);
    }
  };
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  //  const handleUnsaveListing = async (listingId) => {
  //   try {
  //     const res = await fetch(`/api/user/unsave/${listingId}`, {
  //       method: "DELETE",
  //       credentials: "include",
  //     });

  //     if (!res.ok) throw new Error("Failed to unsave listing");

  //     // Update local state after successful unsave
  //     setSavedListings(prev =>
  //       prev.filter(item => item.listingId._id !== listingId)
  //     );
  //     console.error("Listing unsaved successfully", error);
  //   } catch (err) {
  //     console.error(err.message);
  //   }
  // };




  // useEffect(() => {
  //   const fetchUserDetails = async () => {
  //     try {
  //       const res = await fetch(`/api/user/${currentUser._id}`, {
  //         headers: {
  //           Authorization: `Bearer ${currentUser.token}`,
  //         },
  //       });
  //       const data = await res.json();
  //       setUserDetails(data);
  //       setFormData((prev) => ({
  //         ...prev,
  //         firstName: data.firstName || "",
  //         lastName: data.lastName || "",
  //         city: data.city || "",
  //         state: data.state || "",
  //         country: data.country || "",
  //         address: data.address || "",
  //       }));
  //     } catch (err) {
  //       console.error("Failed to load user details:", err);
  //     }
  //   };
  //   fetchUserDetails();
  // }, [currentUser._id, currentUser.token]);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await fetch(`/api/user/${currentUser._id}`, {
          method: "GET",
          credentials: "include", // ✅ Important for cookie-based JWT
        });

        const data = await res.json();

        setUserDetails(data);
        setFormData((prev) => ({
          ...prev,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          city: data.city || "",
          state: data.state || "",
          country: data.country || "",
          address: data.address || "",
        }));
      } catch (err) {
        console.error("Failed to load user details:", err);
      }
    };

    fetchUserDetails();
  }, [currentUser._id]);


  // useEffect(() => {
  //   const fetchSaved = async () => {
  //       try {
  //     const res = await fetch("/api/user/saved", {
  //       credentials: "include",
  //     });

  //     if (!res.ok) {
  //       throw new Error("Failed to fetch saved listings");
  //     }

  //     const data = await res.json();
  //     setSavedListings(data); // assuming data is an array of listings
  //   } catch (err) {
  //     console.error("Fetch error:", err);
  //   }
  // };

  //   fetchSaved();
  // }, []);



  const handleFetchSavedListings = async () => {
    try {
      const res = await fetch(`/api/user/saved`, {
        method: "GET",
        credentials: "include", // important for cookies
      });
      const data = await res.json();
      setSavedListings(data); // Assume you have this state
      setActiveTab("listings");
    } catch (error) {
      console.error("Failed to fetch saved listings", error);
    }
  };

  return (
    <div>




      {currentUser.role === "landlord" && (

        <h1 className="text-4xl text-slate-700 items-center font-bold relative mt-10 left-[42vw]">
          LandLord DashBoard      </h1>

      )}
      {currentUser.role === "tenant" && (

        <h1 className="text-4xl text-slate-700 items-center font-bold mt-10 relative left-[42vw]">
          {" "}
          Tenant Dasboard{" "}
        </h1>

      )}
      <img
        src={strokeImg}
        alt=""
        className="w-[13vw] relative left-[50vw] -top-3"
      />
      <p className="text-green-600 relative left-[32vw] ml-48">
        {updateSuccess ? "User is Updated Successfully!" : ""}
      </p>
      <p className="text-red-700">
        {showListingError ? "Error showing listings" : ""}
      </p>
      <div className="flex flex-row w-auto h-auto">


        {/* USER CARD */}
        <div className=" relative  bg-[#354f69] w-[23vw] rounded-lg h-[65vh] top-[7.3vh] left-[11vw] ">
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
              onChange={handleFileUpload}
              className=" self-center mt-2 text-white "
            />

            {loading ? (
              "Uploading...Your Image"
            ) : (
              <img
                src={imageURL || user?.avatar || ""}
                alt="profile-pic"
                className="mt-6 rounded-full h-32 w-32 text-white object-cover cursor-pointer self-center items-center ml-32"
                id="profile-pic-avatar"
                onClick={() => fileRef.current.click()}
              />
            )}
            <div className="flex flex-col items-center">
              <p className="mt-3 underline text-white text-md ">
                {formData.firstName || currentUser.firstName}{" "}
                {formData.lastName || currentUser.lastName}{" "}
              </p>
              <p className="text-sm underline text-white">
                {formData.role || currentUser.role}
              </p>

              <hr className="border[-0.1rem] border-white w-[19vw] mt-6" />

              <div className="relative left-[-7vw] flex text-white mt-6 gap-3 flex-col ">
                <p>Location: </p>
                <p>Email: </p>
              </div>
              <div className="relative left-[3vw] top-[-10.8vh]  flex text-white mt-6 gap-3 flex-col ">
                <p className="">
                  {formData.city ?? currentUser.city},{" "}
                  {formData.country ?? currentUser.country}
                </p>
                <p className="">{formData.email ?? currentUser.email}</p>
              </div>
            </div>

            {currentUser.role === "landlord" && (
              <>
                <Link
                  to={"/create-listing"}
                  className="bg-[#EFF4FD] py-3 text-[#354f69] rounded-lg relative top-[-8vh] text-center gap-3 px-9 hover:opacity-90 w-52 h-12 left-[2vw] hover:scale-105 transition-all flex flex-row "
                >
                  Add Property <LucideBuilding2 />
                </Link>{" "}
              </>
            )}
            <div
              className=" flex flex-row gap-1 relative top-[-4vh] left-[2vw]"
              id="credentials"
            >
              <p
                onClick={handleDeleteUser}
                className="hover:bg-red-600 hover:border-none hover:scale-105 transition-all border-[1px] border-white p-2 px-4 rounded-md text-white cursor-pointer z-20 text-sm self-center flex flex-row gap-1 items-center "
              >
                Delete Account <LucideTrash2 />
              </p>
              <p
                onClick={handleSignOut}
                className=" hover:bg-green-600 hover:border-none hover:scale-105 transition-all border-[1px] border-white p-2 px-4 rounded-md text-white cursor-pointer z-20 text-sm self-center flex flex-row gap-1 items-center"
              >
                Sign Out <LucideDoorOpen />
              </p>

            </div>
            <div className="flex flex-row gap-1 items-center">

              <Link
                to="/chats"
                className="text-[#354f69]  bg-white flex border-[0.1rem] border-white py-2  text-center px-4 flex-row gap-2 items-center justify-center rounded-md hover:scale-105 transition-all ml-8 hover:opacity-90"
              >
                Chatroom
                <FiMessageSquare size={20} />
              </Link>


              {currentUser?.role !== "admin" && (
                <Link to="/help-center" className="text-[#354f69]  bg-white  flex border-[0.1rem] border-white py-2  text-center px-4 flex-row gap-2 items-center justify-center rounded-md hover:scale-105 transition-all mr-4 hover:opacity-90">
                  Help <LucideHelpCircle />
                </Link>
              )}
            </div>
          </form>
        </div>


        {/* ALL SETTINGS AND DATA */}


        <div className="w-[50vw] top-5 mx-auto mt-10 h-[550px] p-4 bg-[#354f69] text-white rounded-md relative  ">
          {/* Account Settings Tab */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button
              onClick={() => setActiveTab("account")}
              className={`px-5 py-2 rounded-md  ${activeTab === "account" ? "text-white underline" : " text-white"
                }`}
            >
              Account Settings
            </button>
            {/* Created Listings Page */}

            {currentUser.role === "landlord" && (
              <button
                onClick={() => {
                  setActiveTab("listings");
                  handleShowListings();
                }}
                className={`px-5 py-2 rounded-md   ${activeTab === "listings"
                  ? "text-white underline"
                  : " text-white"
                  }`}
              >
                Created Listings
              </button>

            )}

            {currentUser.role === "tenant" && (
              <button
                onClick={() => {
                  setActiveTab("listings");
                  handleFetchSavedListings();
                }}
                className={`px-5 py-2 rounded-md   ${activeTab === "listings"
                  ? "text-white underline"
                  : " text-white"
                  }`}
              >
                My Saved Listings
              </button>
            )}

            {/* Notifictaions Details Page */}
            <button
              onClick={() => setActiveTab("notifications")}
              className={`px-5 py-2 rounded-md  ${activeTab === "notifications"
                ? "text-white underline"
                : " text-white"
                }`}
            >
              Notifications
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="ml-1 bg-red-500 text-white rounded-full text-xs px-2 py-[1px]">
                  {notifications.filter(n => !n.isRead).length}
                </span>
              )}
            </button>

          </div>
          <div className="bg-white rounded-md shadow-md p-6 overflow-y-auto h-[460px] text-gray-800">
            {renderTabContent()}
          </div>
        </div>
      </div>


<div className="w-96 h-36"></div>

    </div>
  );
}
