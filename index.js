const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
let cookieParser = require('cookie-parser')
let path = require('path')

app.use(express.static('public'))
app.use(cookieParser())

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.cookie( 'roomId', req.params.room )
    res.sendFile(path.join(__dirname, 'public/index.html'))
})

server.listen(5000, () => {
    console.log("Server Running on Port 5000")
})