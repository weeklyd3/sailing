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
function randomLetter() {
	return 'ASDFGHJKLZXCVBNMQWERTYUIOP'[Math.floor(Math.random() * 26)];
}
io.on('connection', (socket) => {
  ships[currentId++] = {x: 0, y: 0, angle: 0, particles: [], callsign: randomLetter() + randomLetter() + randomLetter(), id: currentId - 1};
	socket.emit('id-reveal', {id: currentId - 1, callsign: ships[currentId - 1].callsign});
	var shipid = currentId - 1;
  console.log('a user connected');
	socket.broadcast.emit('ship join', ships[shipid]);
	socket.on('position change', (newpos) => {
		ships[shipid].x = newpos.x;
		ships[shipid].y = newpos.y;
		ships[shipid].angle = newpos.angle;
		socket.broadcast.emit('ship change', {id: shipid, ship: ships[shipid]});
	})
	socket.on('ship request', () => {
		var clone = JSON.parse(JSON.stringify(ships));
		delete clone[shipid];
		socket.emit('ship get', clone);
	})
  socket.on('disconnect', () => {
	  console.log('disconnect');
	  delete ships[shipid];
  });
});

// listen for requests :)
const listener = server.listen(4000, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});