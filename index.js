// console.log('hello world')
const http = require('http');
const express = require('express');
const port = 3000;
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server); // Use 'io' instead of 'oi'

// Handle Socket.io connections
io.on('connection', (socket) => {
    socket.on('userMsg', message => {
        // console.log('a new user message', message)
        io.emit('newMsg', message);
    })

    // Optionally, you can handle disconnections
    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
});

app.use(express.static(path.resolve('./public')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve('./public/index.html')); // Ensure path is resolved correctly
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
