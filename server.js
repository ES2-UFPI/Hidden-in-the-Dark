Partida = require ('./game_business/partida.js');

const path = require('path');
const express = require('express');


const app = express();
const server = require('http').Server(app);

const io = require('socket.io')(server);

const HTML_DIR = path.join(__dirname, './view/html');
const GAME_DIR = path.join(__dirname, './view/game');

app.use(express.static(HTML_DIR));
app.use(express.static(GAME_DIR));

app.get('/test', (req, res) => {
  res.send( '<script src="/socket.io/socket.io.js"></script><script type="module" src="/test.js"></script>')
})

var partidas = [new Partida()]

io.on('connection', function(socket){

  socket.on('playerLogin', function (data) {
    if (data == undefined) return;
    partidas[data.partida].addListaEspera(data, socket);
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

