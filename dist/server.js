"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app = require('http').createServer();
var io = require('socket.io')(app);
var port = 3000;
var SocketIOService_1 = __importDefault(require("./services/SocketIOService"));
SocketIOService_1.default(io);
app.listen(port, function () {
    console.log("Started on port " + port);
});
//# sourceMappingURL=server.js.map