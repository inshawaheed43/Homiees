// import React from "react";
// import { useSelector } from "react-redux";
// import { Outlet, Navigate } from "react-router-dom";




// export default function Privateroute() {
//   const { currentUser } = useSelector((state) => state.user);



//   return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
// }



import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function Privateroute() {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    // User not logged in → send to sign-in
    return <Navigate to="/sign-in" />;
  }

  if (currentUser.role === "admin") {
    // Admin logged in → redirect to Admin Dashboard
    return <Navigate to="/admin-dashboard" />;
  }

  // Tenant or Landlord → allow access to the protected route
  return <Outlet />;
}
