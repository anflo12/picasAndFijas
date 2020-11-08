import express from "express";
import path from "path";
import SocketIO from "socket.io";
import http from "http";
const app = express();

app.use(express.static(path.join(__dirname, "public")));

let server = http.createServer(app);

let io = SocketIO(server);
let port: number = 4000;
server.listen(port, () => {
  console.log("server on port ", port);
});

io.on("connection", (socket) => {
  let roomname: string;

  console.log("new connection");
  socket.on("play:record", (data: SocketIO.Socket) => {
    io.sockets.to(roomname).emit("send:record", data);
  });

  socket.on("createRoom", (room: string) => {
    roomname = room;
    console.log("room", roomname);
    socket.join(room);

    io.sockets.to(roomname).emit("room:code", roomname);

    socket.on("user", (user: string) => {
      io.sockets.to(roomname).emit("join:user", user);
    });

    socket.on("game", (number: any) => {
      io.sockets.to(roomname).emit("number:game", number);
    });
  });
});
