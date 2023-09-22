class drawing {
	constructor(canvas, game) {
		this.canvas = canvas;
		this.game = game;
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
	particles = [];
	drawParticles() {
		this.canvas.push();
		var tto = [-this.game.ship.x + this.canvas.width / 2, -this.game.ship.y + this.canvas.height / 2];
		this.canvas.strokeWeight(0);
		this.particles = this.particles.filter((part) => {
			this.canvas.push();
			part.o--;
			var newcoord = this.movePointAtAngle([part.x, part.y], part.angle, -part.spd);
			part.x = newcoord[0];
			part.y = newcoord[1];
			this.canvas.fill(this.canvas.color(0, 0, 255, part.o / 100 * 255));
			this.canvas.circle((part.x - this.game.ship.x) * this.game.scale + this.canvas.width / 2, (part.y - this.game.ship.y) * this.game.scale + this.canvas.height / 2, part.r * this.game.scale);
			this.canvas.pop();
			return part.o > 0;
		});
		this.canvas.pop();
	}
	shortcuts() {
		if (this.canvas.keyIsDown(37)) this.game.ship.turn(this.game.ship.angle - this.game.ship.turningSpeed);
		if (this.canvas.keyIsDown(39)) this.game.ship.turn(this.game.ship.angle + this.game.ship.turningSpeed);
		var speedChange = 0;
		if (this.canvas.keyIsDown(38)) speedChange = 1;
		if (this.canvas.keyIsDown(40)) speedChange = -3;
		this.game.ship.currentSpeed += speedChange * 0.1;
		if (this.game.ship.currentSpeed < 0) this.game.ship.currentSpeed = 0;
		if (this.game.ship.currentSpeed > this.game.ship.maxSpeed) this.game.ship.currentSpeed = this.game.ship.maxSpeed;
	}
	drawBackgroundAndShip() {
		this.shortcuts();
		var skyblue = [135, 206, 235];
		var blue = [0, 0, 255];
		var changeBlue = 1 - Math.abs(this.game.ship.y) / 40000;
		if (changeBlue < 0.1) changeBlue = 0.1;
		this.canvas.fill([135 * changeBlue, 206 * changeBlue, 255 - 20 * changeBlue]);
		this.canvas.rect(0, 0, this.canvas.width, this.canvas.height);
		this.canvas.fill('red');
		this.canvas.circle(-this.game.ship.x + this.canvas.width / 2, -this.game.ship.y + this.canvas.height / 2, 10)
		this.canvas.textAlign('left', 'top');
		this.canvas.fill('black');
		this.canvas.text(`[${this.game.ship.x}, ${this.game.ship.y}]`, 0, 0);
		this.drawParticles();
		if (this.game.ship) {
			if (this.game.ship.currentSpeed) {
				var newpos = this.movePointAtAngle([this.game.ship.x, this.game.ship.y], this.game.ship.angle, this.game.ship.currentSpeed);
				[this.game.ship.x, this.game.ship.y] = newpos;
				var head = this.movePointAtAngle([this.game.ship.x, this.game.ship.y], this.game.ship.angle, this.game.ship.height / 2 + 10);
				for (var i = 0; i < 5; i++) {
					this.particles.push({
						x: head[0], 
						y: head[1], 
						r: 5,
						o: 100, 
						angle: this.game.ship.angle - Math.random() * 20, 
						spd: 5
					}, {x: head[0], y: head[1], r: 5, o: 100, angle: this.game.ship.angle + Math.random() * 20, spd: 5});
				}
			}
			this.game.ship.angle += 360;
			this.game.ship.angle = this.game.ship.angle % 360;
			if (this.game.ship.angle == 360) this.game.ship.angle = 0;
			if (this.game.ship.angle != this.game.ship.targetAngle) {
				var dir = 0;
				const currentAngle = this.game.ship.angle;
				const target = this.game.ship.targetAngle;
				if (currentAngle < target) dir = (Math.abs(target - currentAngle) < 180 ? 1 : -1);
				else dir = (Math.abs(target - currentAngle) < 180 ? -1 : 1);
				this.game.ship.angle += this.game.ship.turningSpeed * dir;
				if (this.game.ship.angle < 0) this.game.ship.angle += 360;
				this.game.ship.angle = this.game.ship.angle % 360;
				if (Math.abs(this.game.ship.angle - this.game.ship.targetAngle) <= this.game.ship.turningSpeed) this.game.ship.angle = this.game.ship.targetAngle;
			}
			this.canvas.push();
			this.canvas.translate(this.canvas.width / 2, this.canvas.height / 2);
			this.canvas.rotate(this.game.ship.angle);
			const shipWidth = this.game.ship.width * this.game.scale;
			const shipHeight = this.game.ship.height * this.game.scale;
			this.canvas.image(this.game.shipimg, -shipWidth / 2, -shipHeight / 2, shipWidth, shipHeight);
			this.canvas.pop();
		}
	}
}
module.exports = drawing;