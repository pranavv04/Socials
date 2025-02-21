import React from 'react';
import { FaLinkedin } from "react-icons/fa";

import { FaGithub } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
const Footer = () => {
  const mails = "pranavdhangar11@gmail.com"
  return (
    <div className='bg-black text-white flex justify-around items-center text-sm w-full py-6'>
      <p>Designed and Developed by Pranav</p>
      <div className='flex items-center'>
        <p className='mr-5'>Connect with me:</p>
        <a href="https://www.linkedin.com/in/pranav-dhangar-26b67a220/" target='__blank'><FaLinkedin className='text-2xl mr-2 cursor-pointer hover:text-blue-500' /></a>
        <a href="https://github.com/pranavv04" target='__blank'><FaGithub className='text-2xl mr-2 cursor-pointer' /></a>
        <a href="https://x.com/_pranavv04_" target='__blank'>  <FaXTwitter   className='text-2xl mr-2 cursor-pointer hover:text-gray-300' /></a>
        <a href={`mailto: ${mails}`}>  <CiMail className='text-2xl mr-2 cursor-pointer hover:text-red-400' /></a>
        
      </div>
    </div>
  );
};

export default Footer;