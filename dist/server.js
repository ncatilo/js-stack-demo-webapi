"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http = require('http').createServer();
var io = require('socket.io')(http);
var port = 3000;
// require('../_aux/io')(io);
var io_1 = __importDefault(require("./io"));
io_1.default(io);
http.listen(port, function () {
    console.log("Started on port " + port);
});
//# sourceMappingURL=server.js.map