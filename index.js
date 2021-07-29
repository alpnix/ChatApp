const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages")
const { joinUser, getCurrentUser, leaveUser, getRoomUsers } = require("./utils/users")


const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000;

// use static files
app.use(express.static("public"));
app.use("/css", express.static(__dirname+"/public/css"));
app.use("/js", express.static(__dirname+"/public/js"));
app.use("/img", express.static(__dirname+"/public/img"));

// set views
app.set("views", "./views");


// initializing sessions 



// middleware functions
app.get("/", (req, res) => {
    res.sendFile(__dirname+"/views/login.html");
})

app.get("/chat", (req,res) => {
    res.sendFile(__dirname+"/views/index.html");
})

io.on("connection", socket => {

    socket.on("joinRoom", ({username,room}) => {

        const userList = getRoomUsers(room);
        for (let theUser of userList) {
            if (theUser.username === username && theUser.room === room) {
                socket.emit("mulitpleUsers", `there is already a user called ${username}`)
                console.log(`there is already a user called ${username}`)
                leaveUser(socket.id);
                return;
            }
        }

        const user = joinUser(socket.id, username, room);
        
        console.log(userList);

        socket.join(user.room);
        // send welcome 
        socket.emit("warning","You have entered the chat")

        // send the user list
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room)
        })
        
        // broadcast new user
        var username = user.username
        if (username.length < 15) {
            socket.broadcast.to(user.room).emit("warning",`${username} has joined the chat`)
        } else {
            socket.broadcast.to(user.room).emit("warning",`${username.slice(0,15)}.. has joined the chat`)
        }

        // getting messages of client
        socket.on("chatMessage", (data) => {
            socket.emit("your-msg", formatMessage("You",data))
            const user = getCurrentUser(socket.id);

            socket.broadcast.to(user.room).emit("broadcast", formatMessage(user.username,data));
        });

    })

    //  when client is disconnected
    socket.on("disconnect", () => {
        const user = leaveUser(socket.id);

        if (user) {
            io.to(user.room).emit("warning",`${user.username} has left the chat`);
        
            // send the user list
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room)
            })        
        }
    }) 
})

// listen on port 3000 
server.listen(process.env.PORT || PORT, () => {
    console.log(`server is running on port number ${PORT}`);
})