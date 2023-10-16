var gameInfo = await require('scripts/game/itself/gameInfo.js');
var drawing = await require('scripts/game/itself/drawing.js');
var objects = await require('scripts/game/other-classes/object.js');
class game {
	canvasInfo = {width: null, height: null};
	canvas = null;
	scale = 0.2;
	shipCache = {};
	constructor(width = 640, height = 480) {
		this.target = [10000, -1000];
		this.canvasInfo.width = width;
		this.canvasInfo.height = height;
		this.gameInfo = new gameInfo(this);
		var s = function(sketch) {
			sketch.setup = function() {
				sketch.createCanvas(width, height);
			}
		}
		var draw = new p5(s, 'pad');
		this.canvas = draw;
		this.canvas.angleMode(this.canvas.DEGREES);
		this.drawing = new drawing(this.canvas, this);
		this.updateLoop();
		this.shipimg = draw.loadImage("images/ship.svg");
		this.ship = new objects.ship(75, 320, 0, this.shipimg, 9);
	}
	changeShip(fname) {
		this.canvas.loadImage(`images/${fname}.svg`, this.ship.change.bind(this.ship));
	}
	updateLoop(fps = 30) {
		return setInterval(this.updateCanvas.bind(this), fps);
	}
	updateCanvas() {
		if (!this.canvas) return console.log(`canvas not loaded`);
		for (const ship of Object.values(ssi.foreignShips)) {
			if (this.shipCache[ship.id]) continue;
			this.shipCache[ship.id] = new objects.ship(75, 350, 0, this.shipimg, 5, ship.x, ship.y);
			this.shipCache[ship.id].targetAngle = ship.angle;
			this.shipCache[ship.id].angle = ship.angle;
		}
		this.canvas.clear();
		this.drawing.drawBackgroundAndShip();
	}
}
module.exports = game;