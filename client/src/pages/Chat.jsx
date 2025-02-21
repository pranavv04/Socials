import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { SendHorizonal } from "lucide-react"; // Icon for send button

const Chat = () => {
  const [enteredUserId, setEnteredUserId] = useState(""); // User enters this manually
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const darkMode = useSelector((state) => state.theme.darkMode);
  const messagesEndRef = useRef(null);

  // Get logged-in user's ID from JWT
  const token = localStorage.getItem("token");
  const loggedInUser = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const loggedInUserId = loggedInUser?._id || loggedInUser?.id || loggedInUser?.userId;

  useEffect(() => {
    if (!enteredUserId) return; // Only fetch messages if user ID is entered

    const fetchMessages = async () => {
      try {
        console.log(`Fetching messages between ${loggedInUserId} and ${enteredUserId}`);
        const response = await axios.get(
          `https://socials-mpdh.onrender.com/message/chat/${loggedInUserId}/${enteredUserId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load messages");
      }
    };

    fetchMessages();
  }, [enteredUserId, loggedInUserId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !enteredUserId) {
      toast.error("Please enter a user ID and message.");
      return;
    }

    const requestData = {
      sender: loggedInUserId, // Ensure this is correctly extracted
      receiver: enteredUserId, // Ensure spelling is correct
      content: newMessage,
    };

    console.log("Request Payload:", requestData);

    try {
      console.log(`Sending message from ${loggedInUserId} to ${enteredUserId}`);

      const response = await axios.post(
        "https://socials-mpdh.onrender.com/message/send",
        requestData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Response Data:", response.data);

      setMessages([...messages, response.data.data]); // Update UI
      setNewMessage(""); // Clear input
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };

  return (
    <div
      className={`flex flex-col w-full max-w-lg mx-auto mt-5 border rounded-xl shadow-md ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-semibold">Chat</h2>
        <input
          type="text"
          value={enteredUserId}
          onChange={(e) => setEnteredUserId(e.target.value)}
          className="p-2 text-sm border rounded focus:outline-none"
          placeholder="Enter User ID..."
        />
      </div>

      {/* Messages Container */}
      <div className="h-[450px] overflow-y-auto p-4 space-y-3">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.sender === loggedInUserId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-xl text-sm ${
                  msg.sender === loggedInUserId
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-300 text-black rounded-bl-none"
                }`}
              >
                <p>{msg.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages yet</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="flex items-center p-3 border-t">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-3 border rounded-l-lg focus:outline-none"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-5 py-3 rounded-r-lg hover:bg-blue-600 transition"
        >
          <SendHorizonal size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
