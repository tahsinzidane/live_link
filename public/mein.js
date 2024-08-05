const socket = io();

const messageInpu = document.getElementById('message');
const sendBtn = document.getElementById('sendBtn');
const allMessages = document.getElementById('allMessages');

socket.on('newMsg', (message) => {
    // console.log(message);
    const p = document.createElement('p');
    p.innerHTML = message;
    allMessages.appendChild(p);
})

sendBtn.addEventListener('click', (e) => {
    const message = messageInpu.value;
    console.log(message);

    socket.emit('userMsg', message);
})
