const path = require('path');
const express = require('express');


const app = express();
const server = require('http').Server(app);

const io = require('socket.io')(server);

const HTML_DIR = path.join(__dirname, './view/html');
const GAME_DIR = path.join(__dirname, './view/game');

app.use(express.static(HTML_DIR));
app.use(express.static(GAME_DIR));

io.on('connection', function(socket){
  console.log('Um usuario se conectou: ' + socket.id);
  players[socket.id] = {
    anim: 'idleLeft',
    x: 1834,
    y: 527,
    playerId: socket.id,
    team: 'hidder'
  };
  socket.emit('currentPlayers', players);
  socket.broadcast.emit('newPlayer', players[socket.id]);

  socket.on('playerMovement', function (movementData) {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    players[socket.id].anim = movementData.anim;
    // emit a message to all players about the player that moved
    socket.broadcast.emit('playerMoved', players[socket.id]);
  });

  socket.on('disconnect', function(){
    console.log('O usuario se desconectou');
    delete players[socket.id];
    io.emit('disconectado', socket.id);
  })
})



const PORT = process.env.PORT || 8080;


server.listen(PORT, function () {
  console.log(`Listening on ${server.address().port}`);
});

var players = {};

