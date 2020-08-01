import express from 'express'
import * as _http from 'http'
import socketIO from 'socket.io'
import path from 'path'

const app = express()
const http = _http.createServer(app)
const io = socketIO(http)
const port = 3000

app.use(express.static(path.resolve('./public')));

app.get('/', (request, response) => {

    const file = path.resolve('./public/index.html')

    response.sendFile(file);
});

import SocketIOService from './services/SocketIOService'

SocketIOService(io)

http.listen(port, () => {

    console.log(`Started on port ${port}`)
});