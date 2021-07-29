// switching between plane and microphone icons
var sendBtn = document.querySelector(".chat-bottom form button");
const msgArea = document.querySelector(".chat-bottom form input");
var mainChat = document.querySelector(".main-chat");

msgArea.addEventListener("input", (e) => {
    if (!msgArea.value) {
        sendBtn.classList.replace("fa-paper-plane","fa-microphone")
    }
    else {
        sendBtn.classList.replace("fa-microphone","fa-paper-plane")
    }
})


// when microphone is clicked focus on input
const mic = document.querySelector(".mic");

mic.addEventListener("click", (e) => {
    msgArea.focus();
})


// exiting the room
var exitBtns = document.querySelectorAll(".quit");

for (const exitBtn of exitBtns) {
    exitBtn.addEventListener("click", () => {
        window.location = "/";
    })
}

// checking an image
var checkImage = function(url) {
    var s = document.createElement("img");
    s.src = url;

    s.onerror = function() {
        var alert = document.querySelector("#alert");
        alert.style.display = "block";
    }

    s.onload = function() {
        mainChat.style.backgroundImage = `url('${url}')`;
    }
}

// getting the pp of the room

var roomImg = document.querySelector(".room img");
var contactProfile = document.querySelector(".chat-top img");

contactProfile.src = roomImg.src;

// change background image of chat
var changeBtn = document.querySelector(".change-bg")
var bgModal = document.querySelector(".modal");
var bgUrl = document.querySelector("#bg-url")
var imagesBtn = document.querySelector(".images-btn");
var secondaryBtn = document.querySelector(".modal-footer .btn-secondary");

secondaryBtn.addEventListener("click", function(e) {
    bgUrl.value = "";
})

imagesBtn.addEventListener("click", e => {
    setTimeout(() => {
        bgUrl.focus()
    },50);
})

changeBtn.addEventListener("click", function(e) {
    var urlValue = bgUrl.value;
    bgModal.style.display = "none";
    bgUrl.value = "";
    checkImage(urlValue);
})

const bgForm = document.querySelector("#bg-form");

bgForm.addEventListener("submit", e => {
    e.preventDefault();
    changeBtn.click();
})