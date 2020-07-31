const http = require('http').createServer()
const io = require('socket.io')(http)
const port = 3000

// require('../_aux/io')(io);
import fn from './io'

fn(io)

http.listen(port, () => {

    console.log(`Started on port ${port}`)
});