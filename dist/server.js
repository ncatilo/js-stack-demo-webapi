"use strict";
// import express from 'express'
// import * as _http from 'http'
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = 3000;
app.get('/', function (request, response) {
    response.send('hello');
});
var SocketIOService_1 = __importDefault(require("./services/SocketIOService"));
SocketIOService_1.default(io);
http.listen(port, function () {
    console.log("Started on port " + port);
});
//# sourceMappingURL=server.js.map