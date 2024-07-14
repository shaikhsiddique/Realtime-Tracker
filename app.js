const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');
const { Socket } = require('dgram');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set('view engine','ejs');
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('send-location', (data) => {
        io.emit('receive-location', { id: socket.id, ...data });
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
        // Perform any cleanup or additional actions on disconnect if needed
    });
});


app.get('/',(req,res)=>{
    res.render('index.ejs');
})

server.listen(process.env.PORT);