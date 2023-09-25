const socket = io();
const ssi = {};
ssi.foreignShips = {};
socket.on('id-reveal', (id) => {
	console.log('got id!');
	ssi['id'] = id.id;
	ssi['callsign'] = id.callsign;
});
socket.on('ship get', (ships) => {
	console.log('other ships loaded!');
	ssi.foreignShips = ships;
})
socket.on('ship join', (ship) => {
	ssi.foreignShips[ship.id] = ship;
});
socket.on('ship change', (interaction) => {
	console.log(`position change for id ${interaction.id}`);
	if (typeof currentGame == 'undefined') return;
	ssi.foreignShips[interaction.id] = {...ssi.foreignShips[interaction.id], ...interaction.ship};
	const toChange = currentGame.shipCache[interaction.id];
	if (!toChange) return console.log('thaas strange');
	toChange.x = interaction.ship.x;
	toChange.y = interaction.ship.y;
	toChange.currentSpeed = interaction.ship.currentSpeed;
})
socket.on('angle change', (interaction) => {
	if (typeof currentGame == 'undefined') return;
	ssi.foreignShips[interaction.id].angle = interaction.angle;
	currentGame.shipCache[interaction.id].targetAngle = interaction.angle;
	currentGame.shipCache[interaction.id].angle = interaction.angle;
})
socket.emit('ship request');