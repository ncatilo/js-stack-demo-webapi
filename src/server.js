const express = require('express')
const _http = require('http')
const socketIO = require('socket.io')
const path = require('path')
const SocketIOService = require('./services/SocketIOService')

const app = express()
const http = _http.createServer(app)
const io = socketIO(http)
const port = 3000

app.use(express.static(path.resolve('./public')));

app.get('/', (request, response) => {

    const file = path.resolve('./public/index.html')

    response.sendFile(file);
});

SocketIOService(io)

http.listen(port, () => {

    console.log(`Started on port ${port}`)
});