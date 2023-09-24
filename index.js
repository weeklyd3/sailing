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
const ships = {};
var currentId = 1;
io.on('connection', (socket) => {
  ships[currentId++] = {x: 0, y: 0, angle: 0, particles: []};
	socket.emit('id', currentId - 1);
  console.log('a user connected');
  socket.on('disconnect', () => {
	  console.log('disconnect');
  });
});

// listen for requests :)
const listener = server.listen(4000, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});