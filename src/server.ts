const app = require('http').createServer()
const io = require('socket.io')(app)
const port = 3000

// require('../_aux/io')(io);
import SocketIOService from './services/SocketIOService'

SocketIOService(io)

app.listen(port, () => {

    console.log(`Started on port ${port}`)
});