var gameInfo = await require('scripts/game/itself/gameInfo.js');
var drawing = await require('scripts/game/itself/drawing.js');
var objects = await require('scripts/game/other-classes/object.js');
class game {
	canvasInfo = {width: null, height: null};
	canvas = null;
	scale = 0.25;
	constructor(width = 640, height = 480) {
		this.canvasInfo.width = width;
		this.canvasInfo.height = height;
		this.gameInfo = new gameInfo(game);
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
		this.ship = new objects.ship(75, 350, this.shipimg, 5);
	}
	updateLoop(fps = 30) {
		return setInterval(this.updateCanvas.bind(this), fps);
	}
	updateCanvas() {
		if (!this.canvas) return console.log(`canvas not loaded`);
		this.canvas.clear();
		this.drawing.drawBackgroundAndShip();
	}
}
module.exports = game;