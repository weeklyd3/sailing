class drawing {
	constructor(canvas, game) {
		this.canvas = canvas;
		this.game = game;
		this.fcount = 0;
	}
	movePointAtAngle(point, angle, distance) {
		angle = angle * (Math.PI / 180);
		return [
			point[0] + (Math.sin(angle) * distance),
			point[1] - (Math.cos(angle) * distance)
		];
	}
	normalizeAngle(angle) {
		if (angle < 0) {
			while (angle < 0) angle += 360;
		}
		return angle % 360;
	}
	shortcuts() {
		this.fcount++;
		if (this.canvas.keyIsDown(37)) this.game.ship.turn(this.game.ship.angle - this.game.ship.turningSpeed);
		if (this.canvas.keyIsDown(39)) this.game.ship.turn(this.game.ship.angle + this.game.ship.turningSpeed);
		var speedChange = 0;
		if (this.canvas.keyIsDown(38)) speedChange = 1;
		if (this.canvas.keyIsDown(40)) speedChange = -3;
		this.game.ship.currentSpeed += speedChange * 0.1;
		if (this.game.ship.currentSpeed < 0) this.game.ship.currentSpeed = 0;
		if (this.game.ship.currentSpeed > this.game.ship.maxSpeed) this.game.ship.currentSpeed = this.game.ship.maxSpeed;
		if (!(this.fcount % 2)) socket.emit('position change', {x: this.game.ship.x, y: this.game.ship.y, angle: this.game.ship.angle});
	}
	drawBackgroundAndShip() {
		this.shortcuts();
		var skyblue = [135, 206, 235];
		var blue = [0, 255, 255];
		var changeBlue = 1 - Math.abs(this.game.ship.y) / 40000;
		if (changeBlue < 0.1) changeBlue = 0.1;
		this.canvas.fill([135 * changeBlue, 206 + 49 * changeBlue, 255 - 20 * changeBlue]);
		this.canvas.rect(0, 0, this.canvas.width, this.canvas.height);
		this.canvas.textAlign('left', 'top');
		this.canvas.fill('black');
		this.canvas.text(`[${this.game.ship.x.toFixed(2)}, ${this.game.ship.y.toFixed(2)}]\nSpeed: ${this.game.ship.currentSpeed}\n${ssi.id ? `${ssi.callsign} #${ssi.id}` : ''}`, 0, 0);
		for (const f of Object.values(this.game.shipCache)) f.draw(this.game.ship.x, this.game.ship.y, this.canvas, this.game.scale);
		if (this.game.ship) this.game.ship.draw(this.game.ship.x, this.game.ship.y, this.canvas, this.game.scale);
	}
}
module.exports = drawing;