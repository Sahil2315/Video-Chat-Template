const express = require('express')
const path = require('path')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')


app.use(express.static(__dirname))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

io.on('connection', socket => {
    socket.on('user-connected', userID => {
        socket.broadcast.emit('newuser', userID)
        socket.on('disconnect', () => {
            socket.broadcast.emit('user-disconnected', userID)
        })
    })
})

server.listen(5000, () => {
    console.log("Server Running on Port 5000")
})