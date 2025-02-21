import React from 'react'
import { useSelector } from 'react-redux'
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from 'react-router';
import { MdOutlineError } from "react-icons/md";
const Notfound = () => {
  const darkMode = useSelector((state) => state.theme.darkMode)
  return (
    <div className={`h-[570px] flex text-center items-center flex-col ${darkMode ? `bg-[#121212]` : `bg-white`} `}>
      <h2 className="text-2xl font-extrabold mt-[40px] text-red-500 flex"><MdOutlineError className={` mr-[10px] text-3xl`} />404 Not Found</h2>
      <p className={`mt-[20px] text-sm ${darkMode ? `text-white` : `text-black`}`}>Page error or page might be down</p>

      <Link to={'/'}><button className={`border flex mt-[20px] px-2 py-2 rounded-2xl cursor-pointer text-sm ${darkMode ? `text-white` : `text-black`}`}><IoMdArrowRoundBack className={`mt-[4px] mr-[5px] `}/> Go to Homepage </button></Link>

    </div>
  )
}

export default Notfound
