// import express from 'express'
// import * as _http from 'http'

const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const port = 3000

app.get('/', (request: any, response: any) => {
    
    response.send('hello')
})

import SocketIOService from './services/SocketIOService'

SocketIOService(io)

http.listen(port, () => {

    console.log(`Started on port ${port}`)
});