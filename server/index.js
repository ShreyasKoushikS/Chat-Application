const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});
const PORT = process.env.PORT || 4000;

// Store rooms and messages
const rooms = new Map();
const roomMessages = new Map();
const roomPasswords = new Map();

io.on('connection', (socket) => {
    let currentUser = '';
    let currentRoom = '';

    socket.on('login', (username) => {
        currentUser = username;
        console.log(`${username} logged in`);
    });

    socket.on('getRoomList', () => {
        const roomList = Array.from(rooms.keys()).map(roomName => ({
            name: roomName,
            userCount: rooms.get(roomName)?.size || 0,
            isProtected: roomPasswords.has(roomName)
        }));
        socket.emit('roomList', roomList);
    });

    socket.on('createRoom', async (data) => {
        const { roomName, password } = data;
        
        if (rooms.has(roomName)) {
            socket.emit('error', 'Room already exists');
            return;
        }

        rooms.set(roomName, new Set());
        roomMessages.set(roomName, []);

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            roomPasswords.set(roomName, hashedPassword);
        }

        io.emit('roomList', Array.from(rooms.keys()).map(room => ({
            name: room,
            userCount: rooms.get(room).size,
            isProtected: roomPasswords.has(room)
        })));
    });

    socket.on('joinRoom', async (data) => {
        const { room, username, password } = data;
        
        if (!rooms.has(room)) {
            socket.emit('error', 'Room does not exist');
            return;
        }

        if (roomPasswords.has(room)) {
            if (!password) {
                socket.emit('passwordRequired');
                return;
            }

            const isPasswordValid = await bcrypt.compare(password, roomPasswords.get(room));
            if (!isPasswordValid) {
                socket.emit('error', 'Incorrect password');
                return;
            }
        }

        // Leave current room if any
        if (currentRoom) {
            socket.leave(currentRoom);
            rooms.get(currentRoom).delete(username);
        }

        currentRoom = room;
        currentUser = username;
        
        socket.join(room);
        rooms.get(room).add(username);
        
        const messages = roomMessages.get(room);
        socket.emit('previousMessages', messages);
        
        const joinMessage = {
            type: 'system',
            content: `${username} joined the room`,
            timestamp: new Date().toISOString()
        };
        roomMessages.get(room).push(joinMessage);
        io.to(room).emit('systemMessage', joinMessage.content);
        
        io.emit('roomList', Array.from(rooms.keys()).map(room => ({
            name: room,
            userCount: rooms.get(room).size,
            isProtected: roomPasswords.has(room)
        })));

        socket.emit('joinSuccess', room);
    });

    socket.on('chatMessage', (data) => {
        try {
            const messageData = {
                type: 'message',
                username: currentUser,
                content: data.message,
                timestamp: new Date().toISOString()
            };

            if (currentRoom && rooms.has(currentRoom)) {
                roomMessages.get(currentRoom).push(messageData);
                io.to(currentRoom).emit('message', {
                    username: currentUser,
                    message: data.message,
                    timestamp: messageData.timestamp
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', 'Failed to send message');
        }
    });

    socket.on('disconnect', () => {
        if (currentRoom && currentUser) {
            if (rooms.has(currentRoom)) {
                rooms.get(currentRoom).delete(currentUser);
                
                const leaveMessage = {
                    type: 'system',
                    content: `${currentUser} left the room`,
                    timestamp: new Date().toISOString()
                };
                
                roomMessages.get(currentRoom).push(leaveMessage);
                io.to(currentRoom).emit('systemMessage', leaveMessage.content);
                
                io.emit('roomList', Array.from(rooms.keys()).map(room => ({
                    name: room,
                    userCount: rooms.get(room).size,
                    isProtected: roomPasswords.has(room)
                })));
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});