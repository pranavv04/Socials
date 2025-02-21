import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate , useParams } from 'react-router'
import {toast ,ToastContainer } from 'react-toastify'
const CreatePost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const darkMode = useSelector((mode)=> mode.theme.darkMode)
     const[formData , setFormData] = useState({
        user : id,
        content: '',
        image: '',
     })
    

     const handleInputChange = (e)=>{
         const{name , value } = e.target;

         setFormData({
            ...formData,
            [name] : value,
         })
     }
     const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch('https://socials-mpdh.onrender.com/post/createpost', { // ✅ Add await
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                toast.success("Post uploaded");
    
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                toast.error("Failed to upload post: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            toast.error("Internal server error: " + error.message);
        }
    };
    



  return (
    <div className={`items-center text-center h-[560px] flex flex-col ${darkMode ? `bg-[#121212] text-white` : `bg-white text-black`}`}> 
    <p className="text-2xl font-bold underline mb-[20px] mt-[20px]">Add details and Post your Life</p>
      <form action="" className='flex flex-col' onSubmit={handleSubmit}>
          <input type="text" className="text-sm w-[400px] border p-2 rounded-md m-[10px]" placeholder='Enter your content' onChange={handleInputChange} value={formData.content} name='content'/>
          <input type="text" placeholder='Enter image url' className="text-sm w-[400px] border p-2 rounded-md m-[10px]" onChange={handleInputChange} value={formData.image }  name='image'/>
         <button type='submit' className={`mt-[20px] border px-2 py-1 text-sm rounded-xl cursor-pointer ${darkMode ? `bg-white text-black` : `bg-black text-white`} font-semibold`}>Post</button>
      </form>
    </div>
  )
}

export default CreatePost
