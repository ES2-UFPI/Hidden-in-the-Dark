const path = require('path');
const express = require('express');

const app = express();
const HTML_DIR = path.join(__dirname, '/view/html');
const GAME_DIR = path.join(__dirname, '/view/game');
// const HTML_FILE = 'index.html';

app.use(express.static(HTML_DIR));
app.use(express.static(GAME_DIR));

// app.get('/', function(req, res) {
//   res.sendFile(path.join(HTML_DIR, HTML_FILE));
// });

const PORT = process.env.PORT || 8080;

app.listen(PORT, (req, res) => {
  console.log('Servidor Web Ligado')
});