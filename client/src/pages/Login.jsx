import React, { useState } from 'react';
import { GiBasketballBall } from "react-icons/gi";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const Login = () => {
  const [mode, setMode] = useState(false);
  const navigate = useNavigate();

  const handleMode = () => {
    setMode(!mode);
  };

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("https://socials-mpdh.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      console.log("Login API Response:", data); // 
  
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", formData.username);
        localStorage.setItem("userId", data.userId); // 
        localStorage.setItem("profilePicture", data.profilePicture);
  
        toast.success("Login successful!");
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error); // 
      toast.error("Internal server error");
    }
  };
  

  return (
    <>
      <div className="flex justify-center mt-10 font-bold text-3xl">
        <button
          onClick={handleMode}
          className={`cursor-pointer mr-10 ${mode ? 'text-orange-500' : 'text-black'}`}
        >
          <GiBasketballBall />
        </button>
        <h1 className="mainlogo">Socials.</h1>
      </div>

      <div className="grid-cols-2 flex justify-around mt-10  mb-[30px]">
        <div>
          <GiBasketballBall className="text-7xl text-orange-500" />
          <img src="/images/first.png" alt="Login" className="h-[500px] mt-[60px]" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className={`flex flex-col mt-5 border border-black w-[600px] text-center items-center justify-center rounded-4xl ${mode ? 'bg-[#121212] text-white' : 'bg-white text-black '}`}>
            <p className="text-xl font-bold">Log into Socials</p>
            <p className="text-sm text-red-500 font-bold">Use drake as password and username</p>

            <input
              type="text"
              placeholder="Enter your username"
              className="border-blue-400 border w-[500px] mt-2 mb-2 text-center py-1 rounded-xl"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />

            <input
              type="password"
              placeholder="Enter your password"
              className="border-blue-400 border w-[500px] mt-2 mb-2 text-center py-1 rounded-xl"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />

            <button
              className="border-white text-white bg-blue-500 cursor-pointer font-semibold border w-[500px] mt-2 mb-2 text-center py-1 rounded-xl"
              type="submit"
            >
              Log in
            </button>

            <Link to="/signup">
              <button className="border-white text-white bg-black cursor-pointer font-semibold border w-[500px] mt-2 mb-2 text-center py-1 rounded-xl">
                Create new account
              </button>
            </Link>

            <p className="text-sm font-semibold">socials</p>
          </div>
        </form>
      </div>

      <ToastContainer />
    </>
  );
};

export default Login;
