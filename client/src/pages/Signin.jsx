import React, { useState } from 'react'
import SigninImage from '/images/newone.png'
import { GiBasketballBall } from "react-icons/gi";
import '../App.css'
import {toast , ToastContainer} from 'react-toastify'
import { Link, useNavigate } from 'react-router';

const Signin = () => {
    const [mode , setMode] = useState(false);
    const navigate = useNavigate();

    const[formData , setFormData] = useState({
      name:'',
      email:'',
      username:'',
      password:''
    })


    const handleMode = ()=>{
        setMode(!mode)
    }


    const handleInputChange = (e)=>{
      const{name , value} = e.target;
      setFormData({
        ...formData,
        [name] : value
      })
    };

    const handleSubmit = async(e)=>{
      e.preventDefault();

      try {
        const response = await fetch(`https://socials-mpdh.onrender.com/auth/signin` , {
          method:'POST',
          headers : {'Content-Type' : "application/json"},
          body:JSON.stringify(formData),
        });

        const data = await response.json();
        if(response.ok){
          localStorage.setItem("token" , data.token);
          localStorage.setItem("username" , formData.username);
          localStorage.setItem("userId" , data.userId);
          localStorage.setItem("profilePicture" ,data.profilePicture);

          toast.success("Signup Successfull")

          setTimeout(() => {
            navigate('/')
          }, 2000);
        }
        else{
          toast.error("Signup failed")
        }
      } catch (error) {
        toast.error("Internal server error")
      }
    }
  return (
   <>
  
      <div className="flex justify-center mt-[10px] font-bold text-3xl ">
      <button onClick={handleMode} className={`cursor-pointer mr-[10px] ${mode ? `text-orange-500` : `text-black`}`}><GiBasketballBall  /></button>
      <h1 className='mainlogo'> Socials.</h1>
      </div>
      
  
      <div className="grid-cols-2 flex justify-around mt-[10px]  mb-[30px]">
        
        <div>
          <GiBasketballBall className="text-7xl text-orange-500" />
          <img src={SigninImage} alt=""  className="h-[500px] mt-[60px]"/>
          
        </div>
        <div className={`flex flex-col mt-[20px] border border-black w-[600px] text-center items-center justify-center rounded-4xl ${mode ? `bg-[#121212]` : `bg-white` } ${mode ? `text-white` : 'text-black'}`}>
          
          <p className="text-xl font-bold ">Sign into Socials</p>
          <form action="" onSubmit={handleSubmit}>


          <input type="text" placeholder='Enter your name' className="border-blue-400 border w-[500px] mt-[10px] mb-[10px] text-center py-[4px] rounded-xl placeholder:text-gray-500" name='name' value={formData.name} onChange={handleInputChange}/>


          <input type="email" placeholder='Enter your email' className="border-blue-400 border w-[500px] mt-[10px] mb-[10px] text-center py-[4px] rounded-xl placeholder:text-gray-500" name='email' value={formData.email} onChange={handleInputChange}/>
        
          <input type="text" name="username" id="" placeholder='Enter your username' className="border-blue-400 border w-[500px] mt-[10px] mb-[10px] text-center py-[4px] rounded-xl placeholder:text-gray-500" value={formData.username} onChange={handleInputChange} />


          <input type="password" className="border-blue-400 border w-[500px] mt-[10px] mb-[10px] text-center py-[4px] rounded-xl placeholder:text-gray-500" placeholder='Enter your password' name='password'value={formData.password} onChange={handleInputChange} />


          <button className="border-white text-white bg-blue-500 cursor-pointer font-semibold border w-[500px] mt-[10px] mb-[10px] text-center py-[4px] rounded-xl " type='submit'>Sign up</button>


          <Link to={'/login'}><button className="border-white text-white bg-black cursor-pointer font-semibold border w-[500px] mt-[10px] mb-[10px] text-center py-[4px] rounded-xl">Already Have Account ?</button></Link>
          <p className="text-sm font-semibold">socials</p>


          </form>
          
        </div>

      </div>
      <ToastContainer/>
    
      </>
  )
}

export default Signin
