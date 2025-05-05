import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
export default function Header() {
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-crimson-400">Homiees</span>
          </h1>
        </Link>

        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            name=""
            id=""
            placeholder="Search..."
            className="bg-transparent focus:outline-none"
          />
          <FaSearch className="text-green-600 w-24 sm:w-64" />
        </form>

        <ul className="flex gap-4 ">
          <Link to={"/"}>
            <li className="hidden sm:inline hover:underline">
              <a href="#" className="text-green-400">
                Home
              </a>
            </li>
          </Link>

          <Link to={"/about"}>
            <li className="hidden sm:inline hover:underline">
              <a href="#" className="text-green-400">
                About
              </a>
            </li>
          </Link>
          <Link to={"/sign-in"}>
            <li className=" hover:underline">
              {" "}
              <a href="#" className="text-green-500">
                Sign In
              </a>{" "}
            </li>
          </Link>
        </ul>
      </div>
    </header>
  );
}
