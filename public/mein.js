const socket = io();

const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('sendBtn');
const allMessages = document.getElementById('allMessages');
const meinContainer = document.getElementById('cont');
const nameCont = document.getElementById('nameCont');
const nameSubmit = document.getElementById('nameSubmit');
const takenUserName = document.getElementById('userName');
const errMsg = document.getElementById('errMsg');
const list = document.getElementsByClassName('list');

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
        localStorage.setItem('userName', userName);
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

    // Create the three dots span
    const threeDots = document.createElement('span');
    threeDots.innerHTML = `
                             | <i class="ri-at-line"></i> <br>` ;
    threeDots.style.cursor = 'pointer';

    creatSpan.innerHTML = `${userName} `;
    creatSpan.appendChild(threeDots);

    p.innerHTML = `&#9656; ${message}`;
    p.insertBefore(creatSpan, p.firstChild);
    allMessages.appendChild(p);
    notifySound.play();

    // Event listener for three dots
    threeDots.addEventListener('click', () => {
        socket.emit('requestUserList');
    });
});

// Variable to hold the tag list
let tagList = null;  

// Function to get the first element with the class 'list'
function getTagList() {
    const lists = document.getElementsByClassName('list');
    return lists.length > 0 ? lists[0] : null;
}

// Receive list of users to tag
socket.on('userList', (users) => {
    // Get the existing tag list element or create a new one
    tagList = getTagList();

    if (!tagList) {
        tagList = document.createElement('div');
        tagList.classList.add('list');  
        tagList.style.position = 'absolute';
        tagList.style.right = '10px';
        tagList.style.top = '50px';
        tagList.classList.add('user-list');
        document.body.appendChild(tagList);
    } else {
        tagList.innerHTML = '';  
    }

    users.forEach(user => {
        const userItem = document.createElement('div');
        userItem.textContent = `@${user}`;
        userItem.style.cursor = 'pointer';
        userItem.classList.add('userItem');

        userItem.addEventListener('click', () => {
            messageInput.value += ` @${user}`;
            tagList.remove();  
            tagList = null;  
        });

        tagList.appendChild(userItem);
    });

    tagList.style.display = 'block';  
});


// Notify when a user joins the room
socket.on('Name', (userName) => {
    const h_5 = document.createElement('h6');
    h_5.innerHTML = `${userName} has joined the room`;
    allMessages.appendChild(h_5);
    notifySound.play();
});

// Notify when a user leaves the chat
socket.on('user_left', (userName) => {
    const h_5 = document.createElement('h6');
    h_5.innerHTML = `${userName} left the room`;
    allMessages.appendChild(h_5);
});

// Send message on button click
function sendMsg() {
    const message = messageInput.value;
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
