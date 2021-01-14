const socket = io();
document.getElementById("btn-Start").style.visibility="hidden"

let puntaje = document.getElementById("puntaje");
let users = document.getElementById("users");
let btnCreate = document.getElementById("btn-create");
let btnJoin = document.getElementById("btn-join");
let inputNumber = document.getElementById('inputNumber')
let containerCreate = document.getElementById("create");
let inputJoin = document.createElement("input");
let textRoom = document.getElementById("text-room");
let btnStart = document.createElement('button')
btnStart.className="btnStyle"
inputJoin.id = "input-join";
inputJoin.className = "input";
inputJoin.placeholder = "Ingrese codigo de sala";
let user;
let status = 0;
let randomNumber=0
let picas,fijas
// esta funcion crea el id de la sala
function create_UUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxx".replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 55);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}


//funcion de unirse a sala
btnJoin.addEventListener("click", () => {
  if (status === 1) {

    let inputJoinValue = inputJoin.value;
      

    socket.emit("joinRoom", inputJoinValue);

    user = prompt("ingrese nombre de usuario");
    socket.emit("user", user);

    getNumberGame()

    inputJoin.style.visibility="hidden"
    btnJoin.style.visibility="hidden"
  }
  if (status === 0) {
    containerCreate.replaceChild(inputJoin, btnCreate);
    status = 1;
  }
});


socket.on("limitPlayers",(data )=>{
  if (data.limit<2) {
    inputNumber.disabled = true
    
  }else if(data.limit>1){
    document.getElementById("btn-Start").style.visibility="visible"
    inputNumber.disabled = false

  }
})

// funcion de crear sala
btnCreate.addEventListener("click", () => {
  let roomID = create_UUID();
   randomNumber = rangeNumber("2");

  socket.emit("createRoom", roomID);
 

  user = prompt("ingrese nombre de usuario");
  socket.emit("user", user);
  socket.on("room:code", (roomId) => {
    textRoom.innerText = "El Codigo de su sala es :" + roomId + "\n";

    document.getElementById("btn-create").style.visibility = "hidden";
    document.getElementById("btn-join").style.visibility = "hidden";
  });
  getNumberGame()
});

//funcion para enviar puntajes
function sendRecord(Record) {
  console.log("record",Record)
  socket.emit("play:record", {
    user,
    picas: Record.picas,
    fijas: Record.fijas,
  });
}

socket.on("join:user", (user) => {
  users.innerHTML += `<p> <strong>${user} se ha unido  </strong></p> <br>`;
});


 function getNumberGame() {
  socket.on("number:game", (number) => {
    randomNumber=  number
   });
 }


socket.on("send:record", (data) => {
  users.innerHTML=""
  users.innerHTML. += `<p> <strong>${data.user} </strong>  picas: ${data.picas}  fijas: ${data.fijas}</p> <br>`;
});
