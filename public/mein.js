const socket = io();

const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('sendBtn');
const allMessages = document.getElementById('allMessages');
const meinContainer = document.getElementById('cont');
const nameCont = document.getElementById('nameCont');
const nameSubmit = document.getElementById('nameSubmit');
const takenUserName = document.getElementById('userName');
const errMsg = document.getElementById('errMsg');

// notification sound
const notifySound = new Audio('./img/notification sound.wav');

meinContainer.classList.add('hideMeinContainer');

let userName = '';

// Check if username is already saved in local storage
if (localStorage.getItem('userName')) {
    userName = localStorage.getItem('userName');
    autoLoginUser(userName);
}

function verifyUser() {
    const enteredName = takenUserName.value.trim();
    if (enteredName === '') {
        errMsg.innerHTML = 'Please enter your name';
        errMsg.style.display = 'block';
    } else {
        errMsg.style.display = 'none';
        userName = enteredName;
        localStorage.setItem('userName', userName); // Save username to local storage
        socket.emit('userName', userName);

        meinContainer.classList.remove('hideMeinContainer');
        nameCont.classList.add('hideNameContainer');
    }
}

// Automatically log in the user if a username is found in local storage
function autoLoginUser(userName) {
    socket.emit('userName', userName);
    meinContainer.classList.remove('hideMeinContainer');
    nameCont.classList.add('hideNameContainer');
}

nameSubmit.addEventListener('click', verifyUser);

takenUserName.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        verifyUser();
    }
});


// Handle new messages
socket.on('newMsg', (message, userName) => {
    const p = document.createElement('p');
    const creatSpan = document.createElement('span');
    creatSpan.innerHTML = userName + '<br>'; 
    p.innerHTML = `&#9656; ${message}`;
    p.insertBefore(creatSpan, p.firstChild); 
    allMessages.appendChild(p);
    notifySound.play();
});


// Notify when a user joins the room
const h_5 = document.createElement('h6');

socket.on('Name', (userName) => {
    h_5.innerHTML = `${userName} has joined the room`;
    allMessages.appendChild(h_5);
    notifySound.play();
});

// Notify when a user leaves the chat
socket.on('user_left', (userName) => {
    h_5.innerHTML = `${userName} left the room`;
    allMessages.appendChild(h_5);
});


// Send message on button click
function sendMsg() {
    const message = messageInput.value;
    // Ensure message is not empty
    if (message.trim() !== '') {
        socket.emit('userMsg', message, userName);
        messageInput.value = '';
    }
}

sendBtn.addEventListener('click', sendMsg);

// Send message on Enter key press
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMsg();
    }
});
