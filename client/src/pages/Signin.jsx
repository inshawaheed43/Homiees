import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInFailure,
  signInSuccess, clearError
} from "../redux/user/userslice";
import OAuth from "../Components/OAuth";



export default function SignIn() {
  // const [formData, setFormData] = useState({ email: '', password: '', });
  // const { loading, error } = useSelector((state) => state.user);
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  // const role = useSelector((state) => state.user.currentUser?.role);






  // const handleChange = (e) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.id]: e.target.value,
  //   });
  //   if (error) {
  //     dispatch(clearError());
  //   }
  // };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!formData.email || !formData.password) {
  //     setError("Please fill in both email and password");
  //     return;
  //   }
  //   try {

  //     dispatch(signInStart());

  //     const res = await fetch("/api/auth/signin", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //       body: JSON.stringify(formData),
  //     });
  //     const data = await res.json();
  //     console.log(data);
  //     if (data.success === false) {
  //       dispatch(signInFailure(data.message));
  //       return;
  //     }
  //     dispatch(signInSuccess(data));
  //     if (!data.firstName || !data.lastName || !data.address || !data.city || !data.country) {
  //       // User has not completed personal details yet
  //       navigate("/sign-up-2", { state: { userId: data._id } });
  //     } else {
  //       // User profile is already complete
  //       navigate("/profile");
  //     }




  //   } catch (error) {
  //     dispatch(signInFailure(error.message));
  //   }
  // };


   const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in both email and password");
      return;
    }

    try {
      setLoading(true);
      dispatch(signInStart());

      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include", // ✅ to send cookies
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        setLoading(false);
        setError(data.message);
        return;
      }

      // if (!data.isVerified) {
      //   setError("Please verify your email before signing in.");
      //   setLoading(false);
      //   return;
      // }

     dispatch(signInSuccess(data.user));
localStorage.setItem("currentUser", JSON.stringify(data.user));
      setLoading(false);
      navigate("/sign-up-2"); // ✅ Continue to personal info
    } catch (err) {
      dispatch(signInFailure(err.message));
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  };

  console.log(formData);
  return (




    <div id="main" className="bg-[#354f69] rounded-lg relative top-14 font-raleway p-3 max-w-lg mx-auto ">
      <div id="page1">
        <h1
          className="text-center   text-xl my-7 text-[#EFF4FD]"
          id="signup-header"
        >
          Sign In
        </h1>
        <p className='text-[#EFF4FD] relative top-[1vh] left-[8vw] w-[16vw] text-center' >Hey, Enter your details to login to your account!</p>


        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-[5vh]">

          <input
            type="email"
            placeholder="Email"
            className="border-[1px] border-[#EFF4FD] bg-transparent p-4 rounded-lg focus:outline-none placeholder-[#EFF4FD] w-[24rem] relative left-[3.3vw] mt-[] text-white"
            id="email"
            onChange={handleChange}


          />



          <input
            type="password"
            placeholder="Password"
            className="border-[1px] border-[#EFF4FD] bg-transparent p-4 rounded-lg focus:outline-none placeholder-[#EFF4FD] w-[24rem] relative left-[3.3vw] text-white "
            id="password"
            onChange={handleChange}
          />


          <span className=" text-sm text-[#EFF4FD] relative left-12 top-3 "
          >Don't have an account yet?
            <Link to='/sign-up' className='underline'>

              <span > Register Now!</span>
            </Link>

          </span>



          <button
            disabled={loading}
            className="bg-[#EFF4FD] text-[#354f69] p-4 text-lg rounded-lg hover:opacity-85 disabled:opacity-50 relative top-[3vh] w-[24rem] left-[3.3vw] "
          >
            {loading ? "Loading..." : "Sign In"}
          </button>

          <p className='ml-40 mt-9 text-[#EFF4FD] text-xl  '>-Or Sign In With-</p>




          <OAuth />

        </form>

        <div className="flex gap-2 mt-5">

        </div>
        {error && error.trim() !== "" && <p className=" rounded-full p-3 self-center text-center bg-red-600 w-40 text-[#EFF4FD] ml-[10.5vw]">{error}</p>}
      </div>


    </div>
  );
}
