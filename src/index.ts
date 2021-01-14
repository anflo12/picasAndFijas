import express from "express";
import path from "path";
import SocketIO from "socket.io";
import http from "http";
import store from "store";
const app = express();

app.use(express.static(path.join(__dirname, "public")));
let countNumber:number =0
let server = http.createServer(app);
let numberRandom: number = 0;
let io = SocketIO(server);
let port: number = 4000;
server.listen(port, () => {
  console.log("server on port ", port);
});

function generateNumber(rangeMax, rangeMin): number {
  return Math.floor(Math.random() * (rangeMax - rangeMin + 1) + rangeMin);
}

// sockets functions
io.on("connection", (socket) => {
  let roomname: string;

  
    
  

  
  console.log("new connection");
  socket.on("play:record", (data: SocketIO.Socket) => {
    io.sockets.to(roomname).emit("send:record", data);
  });

  // createRoom funtcion
  socket.on("createRoom", (room: string) => {
    roomname = room;
    let tempnumber: number = generateNumber(1, 10);
    store.set("number", tempnumber);
    countNumber++

    socket.join(room);
    socket.on("user", (user: string) => {
      console.log("user",user)
      io.sockets.to(roomname).emit("join:user", user);
    });

    io.sockets.to(roomname).emit("room:code", roomname);
    io.sockets.to(roomname).emit("number:game", tempnumber);
    io.sockets.to(room).emit("limitPlayers", {limit:countNumber})


  });

  // joinUser  funtcion
  socket.on("joinRoom", (room: string) => {
   
      
   socket.join(room);
   countNumber++

   socket.on("user", (user: string) => {
     console.log("user",user)
     console.log("count",countNumber)

     io.sockets.to(room).emit("join:user", user);
     io.sockets.to(room).emit("limitPlayers", {limit:countNumber})

   });
   numberRandom = store.get("number");
   io.sockets.to(room).emit("number:game", numberRandom);
   
  
  

    
  });
});
