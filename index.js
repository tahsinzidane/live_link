const http = require('http');
const express = require('express');
const port = 3000;
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for the 'userName' event from the client
    socket.on('userName', (userName) => {
        // console.log('A new user has joined:', userName);
        io.emit('Name', userName);
    });

    // Listen for 'userMsg' events from clients
    socket.on('userMsg', (message, userName) => {
        // console.log('A new user message:', message, 'from:', userName);
        io.emit('newMsg', message, userName);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

app.use(express.static(path.resolve('./public')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve('./public/index.html')); // Ensure path is resolved correctly
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
