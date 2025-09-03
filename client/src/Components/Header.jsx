import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { LucideLogIn, LucideUserPlus2, LucideUserPlus } from 'lucide-react';
import homieesLogo from '../assets/houses/house-logo.png';
import { FaUserPlus } from "react-icons/fa";
import { MdLogin } from "react-icons/md";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  // const headerRef = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
    alert("Please enter something to search!");
    return;
  }
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  // GSAP animation runs on mount
  // useEffect(() => {
  //   gsap.fromTo(
  //     headerRef.current,
  //     { y: -50, opacity: 0 }, 
  //     { y: 1, opacity: 2, duration: 1, ease: "power2.out" }
  //   );
  // }, []);

  return (
    <header className="bg-white rounded-full  w-[90vw] relative top-[2vh] items-center z-50 left-[4vw] h-[15vh] ">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">

        <Link to="/">
          <img src={homieesLogo} alt="Homiees Logo" className="max-w-32  sm:max-w-28 relative top-[1vh] left-[-5vw] " />
        </Link>

        <ul className="flex gap-4 relative right-36 text-[#273B4F] top-[3vh] left-[-14vw]  " id="nav-bar-btns">
          <Link to={"/"}>
            <li className="hidden sm:inline text-lg  hover:scale-110 transition-all ">
              Home
            </li>
          </Link>

          <Link to={"/about"}>
            <li className="hidden sm:inline text-lg hover:text-[#000000]  ">
              About
            </li>
          </Link>


          {currentUser ? (
            <div
              onClick={() =>
                currentUser.role === "admin"
                  ? navigate("/admin-dashboard")
                  : navigate("/profile")
              }
              className="cursor-pointer"
            >
              {currentUser.role === "admin" ? (
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[#273B4F] text-white text-sm font-bold">
                  AD
                </div>
              ) : (
                <img
                  src={currentUser.avatar || "/default-avatar.png"}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
            </div>
          ) : (
            <Link to="/sign-in" className="flex items-center justify-center">
              <LucideLogIn className="text-3xl text-[#273B4F] hover:scale-105 transition-all" title="Login" />
            </Link>
          )}

          <Link to='/sign-up'>
            <li>
              <LucideUserPlus className="hover:scale-110 transition-all text-2xl text-[#273B4F] relative top-1" />
            </li>
          </Link>
        </ul>

        <form onSubmit={handleSubmit} className=" px-8 py-5 rounded-full flex items-center shadow-cyan-800-500 shadow-lg hover:scale-95 transition-all bg-white relative -mr-16 left-[1vw] top-[2vh]">
          <input
            type="text"
            name=""
            id="search-icon"
            placeholder="Search What You Need"
            className="bg-transparent focus:outline-none sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-[#354f69]" />
          </button>
        </form>


        
     
          <Link
            to="/admin-signin"
            className="relative  rounded-lg hover:bg-transparent py-3 px-5  bg-[#354f69] border-[0.1rem] top-[2vh] duration-300 flex items-center gap-2 text-white  hover:text-[#354f69] hover:scale-95 transition-all hover:border-[0.1rem] hover:border-[#354f69]"
          >
            Login as Admin
          </Link>
    

      </div>
    </header>
  );
}
