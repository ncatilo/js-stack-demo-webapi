// const app = require('http').createServer()
import http from 'http'
const app = http.createServer()
const io = require('socket.io')(app)
const port = 3000

import SocketIOService from './services/SocketIOService'

SocketIOService(io)

app.listen(port, () => {

    console.log(`Started on port ${port}`)
});