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
const shipSockets = {};
var currentId = 1;
function randomLetter() {
	return 'ASDFGHJKLZXCVBNMQWERTYUIOP'[Math.floor(Math.random() * 26)];
}
io.on('connection', (socket) => {
	var shipid = String(Math.round(Date.now() / 1000) % 10000000) + String(currentId++ % 10000);
	ships[shipid] = {x: 0, y: 0, angle: 0, particles: [], callsign: randomLetter() + randomLetter() + randomLetter(), id: shipid, speed: 0};
	shipSockets[shipid] = socket;
	socket.emit('id-reveal', {id: shipid, callsign: ships[shipid].callsign});
	console.log(`${ships[shipid].callsign} #${shipid} joined`);
	socket.broadcast.emit('ship join', ships[shipid]);
	socket.on('position change', (newpos) => {
		ships[shipid].x = newpos.x;
		ships[shipid].y = newpos.y;
		ships[shipid].currentSpeed = newpos.speed;
		socket.broadcast.emit('ship change', {id: shipid, ship: ships[shipid]});
	});
	socket.on('angle change', (newang) => {
		ships[shipid].angle = newang;
		socket.broadcast.emit('angle change', {id: shipid, angle: newang});
	})
	socket.on('ship request', () => {
		var clone = JSON.parse(JSON.stringify(ships));
		delete clone[shipid];
		socket.emit('ship get', clone);
	});
	socket.on('chat message', (data) => {
		const radioRange = 20000;
		console.log(`${ships[shipid].callsign}: ${data}`);
		var sentTo = 0;
		const distressData = {isCall: false};
		const distressPattern = /peanut butter/g;
		const match = data.match(distressPattern);
		if (match && match.length >= 3) {
			distressData.isCall = true;
			distressData.locationData = {
				x: ships[shipid].x,
				y: ships[shipid].y,
				angle: ships[shipid].angle
			}
		}
		for (const id in ships) {
			const ship = ships[id];
			if (ship.id == shipid) continue;
			var distance = Math.sqrt((ship.x - ships[shipid].x) ** 2 + (ship.y - ships[shipid].y) ** 2);
			if (distance > radioRange) continue;
			sentTo++;
			console.log(`sending to ${ship.callsign}`);
			shipSockets[id].emit('chat message', {...distressData, from: shipid, callsign: ships[shipid].callsign, data: data});
		}
		socket.emit('chat message', {...distressData, from: shipid, callsign: ships[shipid].callsign, data: data, sentTo: sentTo});
	});
	socket.on('disconnect', () => {
		console.log(`${ships[shipid].callsign} #${shipid} left`);
		delete ships[shipid];
	});
});

// listen for requests :)
const listener = server.listen(4000, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});