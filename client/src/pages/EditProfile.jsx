import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProfile = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [link, setLink] = useState('');
    const [bio, setBio] = useState('');
    const [username, setUsername] = useState('');
    const [profilePic, setProfilePic] = useState('');

    const navigate = useNavigate();

    const darkMode = useSelector((state) => state.theme.darkMode)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token"); // Get token from local storage
    
                const response = await fetch(`https://socials-mpdh.onrender.com/user/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // Include token
                    }
                });
    
                if (response.ok) {
                    const user = await response.json();
                    setName(user.name || '');
                    setEmail(user.email || '');
                    setBio(user.bio || '');
                    setLink(user.link || '');
                    setUsername(user.username || '');
                    setProfilePic(user.profilePicture || '');
                } else {
                    toast.error("Failed to load user data");
                }
            } catch (error) {
                toast.error("Internal server error");
            }
        };
    
        fetchUser();
    }, [id]);
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !username) {
            toast.error('Name, email, and username are required!');
            return;
        }

        const updatedUserData = {
            name,
            bio,
            link,
            profilePicture: profilePic, // Ensure this matches backend
            username,
            email
        };

        console.log('Sending data', updatedUserData);

        try {
            const response = await fetch(`https://socials-mpdh.onrender.com/user/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedUserData)
            });

            if (response.ok) {
                toast.success('Profile Updated');


                setTimeout(()=>{
                    navigate('/')
                },2000)
            } else {
                const errorMessage = await response.text();
                toast.error(`Profile update failed: ${errorMessage}`);
            }
        } catch (error) {
            toast.error('Internal server error');
        }
    };

    return (
        <div className={`h-[570px] flex flex-col items-center text-sm ${darkMode ? `bg-[#121212] text-white` : `bg-white text-black` } `}>
            <p className="font-extrabold">Edit your profile</p>
            <form className="flex flex-col items-center w-full max-w-md space-y-3 mt-[40px]" onSubmit={handleSubmit}>
                <input type="text" placeholder="Update name" value={name} onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded-md w-80 mb-2" />
                <input type="text" placeholder="Update email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded-md w-80 mb-2" />
                <input type="text" placeholder="Update link" value={link} onChange={(e) => setLink(e.target.value)}
                    className="border p-2 rounded-md w-80 mb-2" />
                <input type="text" placeholder="Update bio" value={bio} onChange={(e) => setBio(e.target.value)}
                    className="border p-2 rounded-md w-80 mb-2" />
                <input type="text" placeholder="Update username" value={username} onChange={(e) => setUsername(e.target.value)}
                    className="border p-2 rounded-md w-80 mb-2" />
                <input type="text" placeholder="Profile picture link" value={profilePic} onChange={(e) => setProfilePic(e.target.value)}
                    className="border p-2 rounded-md w-80 mb-2" />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md w-80">
                    Submit
                </button>
            </form>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default EditProfile;
