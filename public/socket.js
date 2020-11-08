const socket = io("http://localhost:4000");

let puntaje = document.getElementById("puntaje");
let users = document.getElementById("users");

let btnCreate = document.getElementById("btn-create");
let btnJoin = document.getElementById("btn-join");
let containerCreate = document.getElementById("create");
let inputJoin = document.createElement("input");
let textRoom = document.getElementById("text-room");
inputJoin.id = "input-join";
inputJoin.className = "input";
inputJoin.placeholder = "Ingrese codigo de sala";
let user;
let status = 0;
let randomNumber
function create_UUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxx".replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 55);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

btnJoin.addEventListener("click", () => {
  if (status === 1) {
    let inputJoinValue = inputJoin.value;

    socket.emit("createRoom", inputJoinValue);

    user = prompt("ingrese nombre de usuario");
    socket.emit("user", user);

  }
  if (status === 0) {
    containerCreate.replaceChild(inputJoin, btnCreate);
    status = 1;
  }
});

btnCreate.addEventListener("click", () => {
  let roomID = create_UUID();
   randomNumber = rangeNumber("2");

  socket.emit("createRoom", roomID);
  socket.emit("game", randomNumber);

  user = prompt("ingrese nombre de usuario");
  socket.on("room:code", (roomId) => {
    textRoom.innerText = "El Codigo de su sala es :" + roomId + "\n";
    document.getElementById("btn-create").style.visibility = "hidden";
    document.getElementById("btn-join").style.visibility = "hidden";
  });
});

function sendRecord(Record) {
  socket.emit("play:record", {
    user,
    picas: Record.picas,
    fijas: Record.fijas,
  });
}

socket.on("join:user", (user) => {
  users.innerHTML += `<p> <strong>${user} se ha unido </strong></p> <br>`;
});

function sharenumber() {
  socket.on("number:game", (number) => {
   console.log("okii",number)
  });

}
socket.on("send:record", (data) => {
  puntaje.innerHTML = `<p> <strong>${data.user} </strong>  picas: ${data.picas}  fijas: ${data.fijas}</p> <br>`;
});
