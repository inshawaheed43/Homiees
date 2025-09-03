import React from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userslice";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

export default function OAuth() {
  const dispatch = useDispatch();
  const navi = useNavigate();

  // 🖼️ Upload image to Cloudinary
  const uploadToCloudinary = async (imageUrl) => {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const formData = new FormData();
      formData.append("file", blob);
      formData.append("upload_preset", "insha_first_time_at_cloudinary");

      const cloudinaryRes = await fetch(
        "https://api.cloudinary.com/v1_1/dvhgcryak/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await cloudinaryRes.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw new Error("Failed to upload image to Cloudinary");
    }
  };

  // 🔐 Handle Google Login
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const avatarUrl = await uploadToCloudinary(result.user.photoURL);

      // 🔁 Send user to backend
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          avatar: avatarUrl,
        }),
      });

      const data = await res.json();
      console.log("OAuth login response:", data);

      // ✅ Save user in Redux
      dispatch(signInSuccess(data));
navi("/");
      // if (data.role === "admin") {
      //   navi("/admin-dashboard");
      // } else {
      //   alert("Can't access to Homiees!");
      //   navi("/");
      // }
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      console.log("Couldn't Signin With Google", error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="text-[#EFF4FD] p-3 rounded-full hover:opacity-85 bg-transparent border-[1px] w-48 flex flex-row relative mt-3 left-[9.6vw]"
      id="google-btn"
    >
      <span className="relative left-[2.3vw] text-lg font-semibold">
        Google
      </span>
      <FaGoogle className="text-xl top-[0.5vh] relative left-[2.5vw]" />
    </button>
  );
}
