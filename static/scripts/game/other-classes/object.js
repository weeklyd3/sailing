class gameObject {
	constructor(x, y, width, height, type, image, speed,) {
		this.x = x;
		this.y = y;
		this.type = type;
		this.image = image;
		this.angle = 0;
		this.speed = speed;
		this.width = width;
		this.height = height;
	}
}
class ship extends gameObject {
	constructor(w, h, speed, image) {
		super(0, 0, w, h, 'ship', image, speed);
		this.turningSpeed = 1;
		this.targetAngle = 0;
		this.currentSpeed = 0;
		this.maxSpeed = 10;
	}
	turn(angle) {
		this.targetAngle = angle;
	}
}
module.exports = {gameObject, ship};