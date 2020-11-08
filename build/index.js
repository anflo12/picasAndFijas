"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
const app = express_1.default();
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
let server = http_1.default.createServer(app);
let io = socket_io_1.default(server);
let port = 4000;
server.listen(port, () => {
    console.log("server on port ", port);
});
io.on("connection", (socket) => {
    let roomname;
    console.log("new connection");
    socket.on("play:record", (data) => {
        io.sockets.to(roomname).emit("send:record", data);
    });
    socket.on("createRoom", (room) => {
        roomname = room;
        console.log("room", roomname);
        socket.join(room);
        io.sockets.to(roomname).emit("room:code", roomname);
        socket.on("user", (user) => {
            io.sockets.to(roomname).emit("join:user", user);
        });
        socket.on("game", (number) => {
            io.sockets.to(roomname).emit("number:game", number);
        });
    });
});
