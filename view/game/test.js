var body = document.getElementsByTagName('BODY')[0];

console.log(body)

var socket = io();
var socket1 = io();
var socket2 = io();
var socket3 = io();


socket.on('start',()=>{socket.emit('ready', {})})
socket1.on('start',()=>{socket1.emit('ready', {})})
socket2.on('start',()=>{socket.emit('ready', {})})
socket3.on('start',()=>{socket3.emit('ready', {})})

socket.on('chests', (chests)=>{
    body.innerHTML+="Teste Com os Baús do Servidor:<br>"
    body.innerHTML+=` Quatidade:<br> --Esperado: 11, recebido: ${chests.length} - status: ${chests.length == 11?"Passou":"Falha"}<br>`
});


socket3.on('currentPlayers', (players)=>{
    let hidder = 0;
    let seeker = 0;
    players.forEach(element => {
        if (element.team == "hidder"){hidder++}
        if (element.team == "seeker"){seeker++}
    });
    body.innerHTML+="Testes com os players<br>"
    body.innerHTML+=`--Quantidade de Hidders Esperada: 3, recebido: ${hidder} <br> --Quantidade de Seeker Esperada: 1, recebido: ${seeker} - status: ${hidder+seeker == 4?"Passou":"Falha"}<br>`
});


socket.emit('playerLogin', {partida: 0, name: 'Felipe'})
socket1.emit('playerLogin', {partida: 0, name: 'Felipe1'})
socket2.emit('playerLogin', {partida: 0, name: 'Felipe2'})
socket3.emit('playerLogin', {partida: 0, name: 'Felipe3'})

// socket.emit('chestOpen', 5);
// socket.on('openChest', (id)=>(
//     console.log(`\t Baú Aberto:\n \t\tId Esperado: 5, recebido: ${id} - status: ${id == 5?"Passou":"Falha"}`)
// ));
