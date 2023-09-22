class gameInfo {
	constructor(game) {
		this.game = game;
		this.paused = false;
		this.objects = {};
	}
}
module.exports = gameInfo;