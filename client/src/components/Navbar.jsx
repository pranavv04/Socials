import React, { useState, useEffect, createContext } from "react";
import { GiBasketballBall } from "react-icons/gi";
import { BsChat } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/theme/themeSlice";
import { MdDarkMode } from "react-icons/md";
import { IoMdSunny } from "react-icons/io";
import { NavLink } from "react-router-dom";

import "../App.css";

export const userContext = createContext();

const Navbar = () => {
  const [user, setUser] = useState(null);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();

  useEffect(() => {
    // Get user details from local storage
    const storedUsername = localStorage.getItem("username");
    const storedProfile = localStorage.getItem("profilePicture") || "/default-avatar.png";
    const storedUserId = localStorage.getItem("userId");

    if (storedUsername && storedUserId) {
      setUser({
        username: storedUsername,
        profilePicture: storedProfile,
        userId: storedUserId,
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("profilePicture");
    localStorage.removeItem("userId");
    setUser(null); // Reset user state
    window.location.reload();
  };

  return (
    <div
      className={`flex items-center justify-between px-6 py-3 shadow-md ${
        darkMode ? "text-white bg-[#121212]" : "text-black bg-white"
      }`}
    >
      {/* Left Side: Logo */}
      <div className="flex items-center text-3xl">
        <button onClick={() => dispatch(toggleTheme())} className="cursor-pointer">
          <GiBasketballBall className={darkMode ? "text-orange-500" : "text-black"} />
        </button>
        <p className="mainlogo text-md font-bold ml-[10px] cursor-pointer hover:text-orange-500 transition duration-150">
          Socials
        </p>
      </div>

      {/* Middle: "For You" */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-sm font-semibold ${isActive ? (darkMode ? "text-white" : "text-black") : "text-gray-500"}`
          }
        >
          For You
        </NavLink>
      </div>

      {/* Right Side */}
      <div className="flex items-center">
        {user ? (
          <>
            <p className="text-sm mr-[10px] font-semibold">{user.username}</p>
            <NavLink to={user.userId ? `/profile/${user.userId}` : "/login"}>
              <img
                src={user.profilePicture}
                alt="Profile"
                className={`h-[50px] w-[50px] rounded-full border ${
                  darkMode ? "border-white" : "border-black"
                }  object-cover aspect-square `}
              />
            </NavLink>
           <NavLink to={`/chat/${user.userId}`}> <button className="mr-[20px] ml-[20px] text-xl cursor-pointer font-bold hover:text-red-400">
              <BsChat />
            </button></NavLink>
            <button onClick={() => dispatch(toggleTheme())} className="text-xl cursor-pointer">
              {darkMode ? <IoMdSunny /> : <MdDarkMode />}
            </button>
            <button
              className="bg-red-500 px-2 py-1 rounded ml-4 text-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={() => dispatch(toggleTheme())} className="text-xl cursor-pointer">
              {darkMode ? <IoMdSunny /> : <MdDarkMode />}
            </button>
            <NavLink to="/login" className="bg-blue-500 px-2 py-1 rounded text-sm">
              Login
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
