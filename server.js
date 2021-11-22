Partida = require ('./game_business/partida.js');
console.log(Partida)

const path = require('path');
const express = require('express');


const app = express();
const server = require('http').Server(app);

const io = require('socket.io')(server);

const HTML_DIR = path.join(__dirname, './view/html');
const GAME_DIR = path.join(__dirname, './view/game');

app.use(express.static(HTML_DIR));
app.use(express.static(GAME_DIR));

var partidas = [new Partida()]

io.on('connection', function(socket){

  //console.log(socket);
  //console.log(partidas)
  socket.on('playerLogin', function (data) {
    console.log(data)
    if (data == undefined) return;
    partidas[data.partida].conectarPlayer(data, socket);
  });

  socket.on('disconnect', function(){
    console.log('O usuario se desconectou');
    partidas[0].desconectarPlayer(socket);
    io.emit('desconectado', socket.id);
  })
  
})



const PORT = process.env.PORT || 8080;


server.listen(PORT, function () {
  console.log(`Hidden in the Dark On | Port: ${server.address().port}`);
});

var players = {};

