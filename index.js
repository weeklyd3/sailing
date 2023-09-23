const express = require('express');
const app = express();

app.use(express.static('./static'));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/static/index.html');
});
app.get('/objects/:coord', function(req, res) {
  res.type('json');
  const obj = {};
  obj.query = req.params.coord;
  res.send(JSON.stringify(obj));
})

const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);
io.on('connection', (socket) => {
  console.log('a user connected');
});

// listen for requests :)
const listener = server.listen(4000, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});