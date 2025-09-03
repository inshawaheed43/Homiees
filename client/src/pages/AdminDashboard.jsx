import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {  FaComments, FaBan, FaQuestionCircle } from "react-icons/fa";
import { LucideHome,LucideUserLock, LucideUser, LucideBlocks, LucideHelpCircle, LucideMessageCircle } from "lucide-react";
const features = [
  {
    title: "View All Users",
    icon: <LucideUser className=" text-blue-600" />,
    path: "/admin-dashboard/users",
  },
  {
    title: "View All Listings",
    icon: <LucideHome className=" text-green-600" />,
    path: "/admin-dashboard/listings",
  },
  {
    title: "Chatrooms & Disputes",
    icon: <LucideMessageCircle className=" text-purple-600" />,
    path: "/admin-dashboard/chats",
  },
  {
    title: "View Banned Users",
    icon: <LucideUserLock className=" text-red-600" />,
    path: "/admin-dashboard/banned-users",
  },
  {
  title: "Help Requests",
  icon: <LucideHelpCircle className="  text-orange-600" />,
  path: "/admin-dashboard/help-requests",
},

];

export default function AdminDashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (currentUser?.role === "admin") {
      setIsAdmin(true);
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  if (!isAdmin) return null;

  return (



    <div className="min-h-screen p-6 bg-[#F5EDE8]">
      <h1 className="text-4xl  text-[#354f69] mb-8 mt-10 text-center">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            onClick={() => navigate(feature.path)}
            className="bg-white rounded-lg hover:scale-105  shadow-md p-6 items-center cursor-pointer hover:shadow-lg transition duration-300 h-[40v]"
          >
            <div className=" flex flex-col gap-4  items-center text-center ">
              {feature.icon}
              <span className="text-xl font-medium text-[#354f69]">
                {feature.title}
               
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
