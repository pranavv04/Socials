import React, { useEffect, useState } from "react";
import { FaRegHeart, FaHeart, FaRegComment } from "react-icons/fa";
import { PiShareFatBold } from "react-icons/pi";
import { FiBookmark } from "react-icons/fi";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwtDecode from "jwt-decode";
import {Link} from 'react-router-dom'
const Home = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch("https://socials-mpdh.onrender.com/post");
        if (response.ok) {
          const data = await response.json();
          // Sorting posts by createdAt in descending order (latest first)
          const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setPosts(sortedPosts);
        } else {
          toast.error("Error fetching posts.");
        }
      } catch (error) {
        toast.error("Internal server error.");
      }
    };
    fetchPost();
  }, []);
  

  const handleLike = async (postId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in to like posts.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken._id || decodedToken.id || decodedToken.userId;

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: post.likes.includes(userId)
                  ? post.likes.filter((id) => id !== userId) // Unlike
                  : [...post.likes, userId], // Like
              }
            : post
        )
      );

      await fetch(`https://socials-mpdh.onrender.com/post/like/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });
    } catch (error) {
      toast.error("Error liking post.");
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to comment.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken._id || decodedToken.id || decodedToken.userId;

      const response = await fetch(
        `https://socials-mpdh.onrender.com/post/comment/${selectedPost._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId, text: commentText }),
        }
      );

      if (response.ok) {
        const updatedPost = await response.json();

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === selectedPost._id ? updatedPost : post
          )
        );

        setCommentText(""); // Clear input field
        toast.success("Comment added!");
      } else {
        toast.error("Failed to add comment.");
      }
    } catch (error) {
      toast.error("Error adding comment.");
    }
  };

  return (
    <div
      className={`flex flex-col-reverse items-center justify-center ${
        darkMode ? "bg-[#121212] text-white" : "bg-white text-black"
      }`}
    >
      <div className="w-[600px] rounded-2xl mt-[20px]">
        {posts.length > 0 ? (
          posts.map((post) => {
            const token = localStorage.getItem("token");
            const decodedToken = token ? jwtDecode(token) : null;
            const userId =
              decodedToken?._id || decodedToken?.id || decodedToken?.userId;
            const isLiked = post.likes.includes(userId);

            return (
              <div
                key={post._id}
                className="border border-gray-600 rounded-2xl mt-[20px] mb-[50px] p-[20px]"
              >
                {/* User Info */}
                <div className="flex flex-row items-center">
                  <img
                    src={
                      post.user?.profilePicture ||
                      "https://via.placeholder.com/40"
                    }
                    alt="Profile"
                    className="h-[40px] w-[40px] rounded-full  object-cover aspect-square "
                  />
                  <Link
                    to={`/profile/${post.user?._id}`}
                    className="text-sm ml-3 hover:underline"
                  >
                    {post.user?.username || "Anonymous"}
                  </Link>
                </div>

                {/* Post Content */}
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="h-[400px]  w-full rounded-2xl mt-[10px]  object-cover aspect-square "
                  />
                )}
                <p className="text-sm mt-[10px] w-full text-left">
                  {post.content}
                </p>

                {/* Post Actions */}
                <div className="flex justify-between mt-2">
                  <div className="flex items-center space-x-3">
                    <button
                      className="cursor-pointer m-[10px]"
                      onClick={() => handleLike(post._id)}
                    >
                      {isLiked ? (
                        <FaHeart className="text-xl text-red-500" />
                      ) : (
                        <FaRegHeart className="text-xl hover:text-red-500" />
                      )}
                    </button>
                    <p className="text-sm">{post.likes.length} likes</p>

                    <button
                      className="cursor-pointer m-[10px]"
                      onClick={() => setSelectedPost(post)}
                    >
                      <FaRegComment className="text-xl hover:text-gray-500" />
                    </button>
                    <p className="text-sm">{post.comments.length} cmts</p>

                    <button className="cursor-pointer m-[10px]">
                      <PiShareFatBold className="text-xl hover:text-blue-500" />
                    </button>
                  </div>
                  <div>
                    <button className="cursor-pointer m-[10px]">
                      <FiBookmark className="text-xl hover:text-blue-500" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-[70vh] flex items-center justify-center">
            <p className="text-gray-500 text-3xl font-extrabold">
              No posts available
            </p>
          </div>
        )}
      </div>

      {/* Comment Popup */}
      {selectedPost && (
        <div
          className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center ${
            darkMode ? `text-white` `bg-black` : `text-black` `bg-white`
          } text-sm`}
        >
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg w-96">
            <h2 className="text-lg font-bold">Comments</h2>
            <div className="h-40 overflow-y-auto">
              {selectedPost.comments.map((comment, index) => (
                <p key={index} className="text-sm p-2">
                  {comment.text}
                </p>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-2 border rounded mt-2"
            />
            <button
              className={`bg-blue-500  p-2 text-white text-sm rounded mt-2 w-full`}
              onClick={handleAddComment}
            >
              Add Comment
            </button>
            <button
              className="text-red-500 mt-2"
              onClick={() => setSelectedPost(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Home;
