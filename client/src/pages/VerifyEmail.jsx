import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      alert("Verification token missing.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email/${token}`);
        const data = await res.json();

        if (data.success) {
          alert("✅ Email verified successfully!");
          // Optionally store token for future use (not necessary here)
          // localStorage.setItem("token", token);
          navigate("/sign-in");
        } else {
          alert("❌ Invalid or expired verification link.");
          navigate("/sign-up"); // Optional: back to sign-up
        }
      } catch (err) {
        console.error("Verification Error:", err);
        alert("Something went wrong. Please try again later.");
      }
    };

    verify();
  }, [navigate]);

  return <p className="text-center mt-10">Verifying your email...</p>;
};

export default VerifyEmail;
