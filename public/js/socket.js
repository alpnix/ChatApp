const chatForm = document.getElementById("chatForm");
var mainChat = document.querySelector(".main-chat");
var sendBtn = document.querySelector(".chat-bottom form button");
var lastMessage = document.querySelector(".room .last-msg");
var personName = document.querySelector(".person-name");
var groupName = document.querySelectorAll(".group-name");
var alertMsg = document.querySelector("#alert");

const socket = io();

// updating the last message 

function updateLastMessage(msg) {
    var lastString = msg.username + ": " + msg.text;
    if (lastString.length > 60) {
        lastString = lastString.slice(0,60) + "...";
    }
    lastMessage.innerHTML = lastString;
}

// get username and room from url

const  { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

// arrange the template for query

for (let group of groupName) {
    if (room) {
        group.innerHTML = "Chat Room " + room;
    }
}
if (username) {
    if (username.length > 15) {
        personName.innerHTML = username.slice(0,15) + "..";
    }
    else {
        personName.innerHTML = username;
    }
}

// join chatroom
socket.emit("joinRoom", { username, room })

socket.on("warning", data => {
    let el = sendWarningMessage(data);
    mainChat.appendChild(el);

    let lstMsg = `☢ ${data} ☢`
    lastMessage.innerHTML = lstMsg;
    // scroll down 
    mainChat.scrollTop = mainChat.scrollHeight;
})

// sending messages to everyone in the room
socket.on("broadcast", data => {
    let el = sendOtherMessage(data);
    mainChat.appendChild(el);

    updateLastMessage(data);
    // scroll down 
    mainChat.scrollTop = mainChat.scrollHeight;
})

// send your own message 
socket.on("your-msg", data => {
    let el = sendYourMessage(data);
    mainChat.appendChild(el);

    updateLastMessage(data);
    // scroll down 
    mainChat.scrollTop = mainChat.scrollHeight;
})

socket.on("roomUsers", data => {
    printUsers(data.users);
})

socket.on("mulitpleUsers", data => {
    console.log(data);
    console.log(window.location.href);
    window.location.assign("/?error=true");
});

// sending message

chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let data = e.target.elements.msg.value

    if (!data) {
        return;
    }

    const msg = e.target.elements.msg.value;

    socket.emit("chatMessage",msg)

    e.target.elements.msg.value = "";
    sendBtn.classList.replace("fa-paper-plane","fa-microphone")
    e.target.elements.msg.focus();
})

function sendYourMessage(msg) {
    let el = document.createElement("div");
    el.classList.add("your-msg");
    el.classList.add("message");
    el.classList.add("msg");
    el.classList.add("alert-primary");

    el.innerHTML = `<div class="subTitle">
    <div class="sender">${msg.username}</div>
    <div class="time">${msg.time}</div>
</div>
<div class="msg-content">${msg.text}</div>`

    return el;
}

function sendWarningMessage(msg) {
    let el = document.createElement("div");
    el.classList.add("warning-msg");
    el.classList.add("message");
    el.classList.add("msg");
    el.classList.add("alert-warning");

    el.innerHTML = msg;

    return el;
}

function sendOtherMessage(msg) {
    let el = document.createElement("div");

    el.classList.add("others-msg");
    el.classList.add("message");
    el.classList.add("msg");
    el.classList.add("alert-secondary");

    el.innerHTML = `<div class="subTitle">
    <div class="sender">${msg.username}</div>
    <div class="time">${msg.time}</div>
</div>
<div class="msg-content">${msg.text}</div>
`
    return el;
}


const ul = document.querySelector(".user-list ul");

// print user list 
function printUsers(list) {
    ul.innerHTML = "";
    for (user of list) {
        let li = document.createElement("li");
        let username = user.username
        if (username.length > 40) {
            username = username.slice(0,40) + "..";
        }

        li.innerHTML = username;
        ul.appendChild(li);
    }
}


// focusing on input 

mainChat.addEventListener("click", e => {
    chatForm.msg.focus();
})