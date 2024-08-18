const http = require('http');
const express = require('express');
const port = 3000;
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    // Listen for the 'userName' event from the client
    socket.on('userName', (userName) => {
        socket.userName = userName; 
        io.emit('Name', userName);
    });

    // Listen for 'userMsg' events from clients
    socket.on('userMsg', (message) => {
        io.emit('newMsg', message, socket.userName);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        if (socket.userName) {
            io.emit('user_left', socket.userName);
        }
    });
});

app.use(express.static(path.resolve('./public')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve('./public/index.html'));
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
