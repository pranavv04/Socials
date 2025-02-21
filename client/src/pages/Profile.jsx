import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import jwtDecode from "jwt-decode";

const Profile = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const darkMode = useSelector((state) => state.theme.darkMode);

  const token = localStorage.getItem("token");
  const loggedInUser = token ? jwtDecode(token) : null;
  const loggedInUserId = loggedInUser?._id || loggedInUser?.id || loggedInUser?.userId;
  const isMyProfile = loggedInUserId === id;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) {
          toast.error("User not authenticated");
          return;
        }

        const response = await fetch(`http://localhost:4000/user/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          toast.error("Error fetching user");
          return;
        }

        const data = await response.json();
        setUserData(data);

        // Check if the logged-in user follows this profile
        setIsFollowing(data.followers?.includes(loggedInUserId));
      } catch (error) {
        toast.error("Internal server error");
      }
    };

    if (id) fetchUser();
  }, [id, loggedInUserId, token]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:4000/post/");
        if (!response.ok) {
          toast.error("Error fetching posts.");
          return;
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        toast.error("Internal server error");
      }
    };
    fetchPosts();
  }, []);

  const userPosts = posts.filter((post) => post.user?._id?.toString() === id);

  const handleFollow = async () => {
    console.log("Profile User ID (id from useParams()):", id);
    console.log("Logged-in User ID (from JWT):", loggedInUserId);
  
    if (!loggedInUserId || !id) {
      toast.error("Invalid user IDs");
      return;
    }
  
    try {
      const url = isFollowing
        ? `http://localhost:4000/user/unfollow/${id}`
        : `http://localhost:4000/user/follow/${id}`;
  
      console.log("Making API request to:", url);
  
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentUserId: loggedInUserId }),
      });
  
      const data = await response.json();
      console.log("Follow API Response:", data);
  
      if (response.ok) {
        setIsFollowing(!isFollowing);
        setUserData((prev) => ({
          ...prev,
          followers: isFollowing
            ? prev.followers.filter((fid) => fid !== loggedInUserId)
            : [...prev.followers, loggedInUserId],
        }));
        toast.success(isFollowing ? "Unfollowed" : "Followed");
      } else {
        toast.error(data.error || "Failed to update follow status");
      }
    } catch (error) {
      console.error("Network/Server Error:", error);
      toast.error("Internal server error");
    }
  };
  
  
  if (!userData) {
    return <div className="h-screen flex justify-center items-center text-2xl">Loading...</div>;
  }

  return (
    <div className={`flex justify-center flex-col items-center ${darkMode ? "bg-[#121212] text-white" : "bg-white text-black"}`}>
      <div className="grid grid-cols-2 mt-5 justify-around w-[1000px] border py-6 rounded-4xl">
        <div className="rounded-4xl flex flex-col items-center">
          <img src={userData.profilePicture || "/images/default-avatar.png"} alt="Profile" className="h-[150px] w-[150px] rounded-full border border-black object-cover" />
          <p className="text-sm m-2">{userData.name || "Unknown User"}</p>
          <p className="text-sm m-2">{userData.bio || "No bio available"}</p>
          {userData.link && <a href={userData.link} target="__blank" className="text-sm text-blue-500 underline m-2">{userData.link}</a>}
        </div>

        <div>
          <p className="text-sm font-semibold">{userData.username}</p>
          <div className="flex justify-center space-x-4">
            <p className="text-sm">{userPosts.length} posts</p>
            <p className="text-sm">{userData.followers?.length} followers</p>
            <p className="text-sm">{userData.following?.length} following</p>
          </div>

          <div className="mt-[30px]">
            {isMyProfile ? (
              <>
                <Link to={`/editProfile/${id}`}><button className="m-[10px] bg-blue-500 text-sm rounded-md px-2 py-1">Edit Profile</button></Link>
                <Link to={`/createPost/${id}`}><button className="m-[10px] border px-2 py-1 text-sm rounded-md cursor-pointer ">Add Post</button></Link>
              </>
            ) : (
              <button className={`m-[10px] border px-2 py-1 text-sm rounded-md cursor-pointer ${isFollowing ? "bg-red-500 text-white" : "bg-green-500 text-white"}`} onClick={handleFollow}>
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="m-5">
        <p className="font-bold underline">Posts</p>
      </div>

      {userPosts.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {userPosts.map((post) => (
            <div key={post._id} className="w-[400px] rounded-2xl mt-4 m-4 border border-gray-600 p-4">
              <img src={post.image || "/images/default-post.jpg"} alt="Post" className="h-[200px] w-full rounded-2xl object-cover" />
              <p className="text-sm mt-4">{post.content || "No description available"}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[70vh] flex items-center justify-center">
          <p className="text-gray-500 text-3xl font-extrabold">No posts available</p>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Profile;