const http = require('http').createServer()
const io = require('socket.io')(http)
const port = 3000

// require('../_aux/io')(io);
import SocketIOService from './SocketIOService'

SocketIOService(io)

http.listen(port, () => {

    console.log(`Started on port ${port}`)
});