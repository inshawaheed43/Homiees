import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../Components/OAuth";

export default function SignUp() {



  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();








  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    if (error) setError(null);
  };


  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password || !formData.role) {
      setError("Please fill in all fields");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Enter a valid email address");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    try {
      setLoading(true);
      console.log(formData);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      } if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
      }
      alert('Signup successful! A verification email has been sent. Please verify to continue.');
      navigate(`/verify-email/${data.token}`); // ✅ Pass token to route

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  console.log(formData);
  return (
    <div id="signup-main" className="object-bottom " >

      <div className="bg-[#354f69] rounded-lg relative top-14 font-raleway p-3 max-w-lg mx-auto  ">
        <h1
          className="text-center   text-xl my-7 text-[#EFF4FD]"
          id="signup-header"
        >
          Sign up
        </h1>
        <p className='text-[#EFF4FD] relative top-[1vh] left-[0.2vw]  text-center' >Hey, Enter your details to get started!</p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 mt-[5vh]"
        >



          <select

            name="role"
            id="role"
            placeholder='Select Role'
            onChange={handleChange}
            value={formData.role}

            className="block shadow-sm text-sm focus:ring-1  focus:border-blue-200 border-[1px] border-[#EFF4FD] bg-transparent p-4 rounded-lg focus:outline-none text-[#EFF4FD] w-[24rem] relative left-[3.3vw] mt-[] focus:ring-teal-100"
          >
            <option value="" className="text-black" >Select Role</option>
            <option value="landlord" className="text-black">Landlord</option>
            <option value="tenant" className="text-black">Tenant</option>
          </select>

          <input
            type="text"
            placeholder="Username"
            className="border-[1px] border-[#EFF4FD] bg-transparent p-4 rounded-lg focus:outline-none placeholder-[#EFF4FD] w-[24rem] relative left-[3.3vw] text-white "
            id="username"
            onChange={handleChange}
          />

          <input
            type="email"
            placeholder="Email"
            className="border-[1px] border-[#EFF4FD] bg-transparent p-4 rounded-lg focus:outline-none placeholder-[#EFF4FD] w-[24rem] relative left-[3.3vw]  text-white"
            id="email"
            onChange={handleChange}
          />

          <input
            type="password"
            placeholder="Password"
            className="border-[1px] border-[#EFF4FD] bg-transparent p-4 rounded-lg focus:outline-none placeholder-[#EFF4FD] w-[24rem] relative left-[3.3vw] text-white  "
            id="password"
            onChange={handleChange}
          />





          <span className=" text-sm text-[#EFF4FD] relative left-12 top-3 "
          >Already have an account?
            <Link to='/sign-in' className='underline'>

              <span > Log In!</span>
            </Link>

          </span>



          <button
            disabled={loading}
            className="bg-[#EFF4FD] text-[#354f69] p-4 text-lg rounded-lg hover:opacity-85 disabled:opacity-50 relative top-[3vh] w-[24rem] left-[3.3vw] "
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>

          <p className='ml-40 mt-9 text-[#EFF4FD] text-xl  '>-Or Sign Up With-</p>




          <OAuth />
        </form>

        {/* <div className="flex gap-2 mt-5">
          <p>Have an account? </p>
          <Link to={"/sign-in"}>
            <span className="text-blue-500" id="sign-selector">Sign In</span>
          </Link>
        </div> */}
        {error && error.trim() !== "" && <p className=" rounded-full p-3 self-center text-center bg-red-600 w-[15rem] text-[#EFF4FD] ml-[6vw] mr-16 mt-[3vh] ">{error}</p>}
      </div>






    </div>
  );
}
