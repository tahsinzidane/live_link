const socket = io();

const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('sendBtn');
const allMessages = document.getElementById('allMessages');

// Handle new messages
socket.on('newMsg', (message, userName) => {
    console.log(message, userName);
    const p = document.createElement('p');
    p.innerHTML = `${userName}: ${message}`;
    allMessages.appendChild(p);
});

// Collect the user's name and emit it to the server
const userName = prompt('Enter your name to join...');
socket.emit('userName', userName);

socket.on('Name', (userName) => {
    console.log('A new user has joined:', userName);
    const h_5 = document.createElement('h6');
    h_5.innerHTML = `${userName} has joined the room`;
    allMessages.appendChild(h_5);
});

// Send message on button click
sendBtn.addEventListener('click', () => {
    const message = messageInput.value;
    console.log(message);
    socket.emit('userMsg', message, userName);
});
