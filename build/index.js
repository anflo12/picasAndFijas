"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
const store_1 = __importDefault(require("store"));
const app = express_1.default();
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
let server = http_1.default.createServer(app);
let numberRandom = 0;
let io = socket_io_1.default(server);
let port = 4000;
server.listen(port, () => {
    console.log("server on port ", port);
});
function generateNumber(rangeMax, rangeMin) {
    return Math.floor(Math.random() * (rangeMax - rangeMin + 1) + rangeMin);
}
// sockets functions
io.on("connection", (socket) => {
    let roomname;
    console.log("new connection");
    socket.on("play:record", (data) => {
        io.sockets.to(roomname).emit("send:record", data);
    });
    // createRoom funtcion
    socket.on("createRoom", (room) => {
        roomname = room;
        let tempnumber = generateNumber(1, 10);
        store_1.default.set("number", tempnumber);
        socket.join(room);
        socket.on("user", (user) => {
            console.log("user", user);
            io.sockets.to(roomname).emit("join:user", user);
        });
        io.sockets.to(roomname).emit("room:code", roomname);
        io.sockets.to(roomname).emit("number:game", tempnumber);
    });
    // joinUser  funtcion
    socket.on("joinRoom", (room) => {
        socket.join(room);
        socket.on("user", (user) => {
            console.log("user", user);
            io.sockets.to(room).emit("join:user", user);
        });
        numberRandom = store_1.default.get("number");
        io.sockets.to(room).emit("number:game", numberRandom);
    });
});
