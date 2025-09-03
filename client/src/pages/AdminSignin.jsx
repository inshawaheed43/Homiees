import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signInSuccess, signOutUserSuccess } from "../redux/user/userslice";
import { useDispatch } from "react-redux";

export default function AdminSignin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };



  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    localStorage.clear(); 
    dispatch(signOutUserSuccess());
    const { email, password } = formData;
    console.log("Trying to login admin with:", email, password); // ✅ DEBUG

    try {
      const res = await fetch("/api/auth/admin-signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await res.json();

      if (res.ok && data.role === "admin") {
        dispatch(signInSuccess(data));
        navigate("/admin-dashboard");
      } else {
        setError("Invalid admin credentials or role");
      }
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Please try again.");
    }
  };


  return (
    <div className="min-h-screen flex justify-center items-center ">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <input
          type="email"
          id="email"
          placeholder="Admin Email"
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          id="password"
          className="w-full p-2 mb-4 border rounded"
          required
          placeholder="Password"
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-2 text-gray-600"
        >
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </button>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
}
