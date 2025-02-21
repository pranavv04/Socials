const express = require('express');
const app = express();
const db = require('./mongodb/db');
const cors = require('cors')
app.use(express.json());

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173/',
        credentials:true
    }
});


app.use(cors())

io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("sendMessage", (data) => {
        io.to(data.receiverId).emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
    });
});

// Import Routes
const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

const postRoutes = require('./routes/postRoutes');
app.use('/post', postRoutes);

const messageRoutes = require('./routes/messageRoutes');
app.use('/message', messageRoutes);

// Start Server
const PORT = 4000;
server.listen(PORT, () => console.log('Your server is running...'));
