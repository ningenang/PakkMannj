

var _this = this;

module.exports.tileTypeEnum = Object.freeze({
	FLOOR: '_',
	DOOR: '-',
	WALL: '|',
	PELLET: '.',
	SUPER_PELLET: 'o'
});

module.exports.getManhattanDistance = function (coord, target) {
	var dx = Math.abs(coord.x - target.x);
	var dy = Math.abs(coord.y - target.y);

	//assume movement cost of 1
	return 1 * (dx + dy);
};

module.exports.createNeighbourTiles = function (coord) {
	return [
		{ x: coord.x - 1, y: coord.y },		//left
		{ x: coord.x + 1, y: coord.y },		//right
		{ x: coord.x, y: coord.y + 1 },	//down
		{ x: coord.x, y: coord.y - 1 }	//up
	];
};


//todo: treat enemies in same state as me as non-walkable
module.exports.isWalkable = function (map, coord) {


	//check that coordinate is within map bounds
	if (coord.x > -1 && coord.y > -1 &&
		map.width > coord.x && map.height > coord.y) {
		//if not a wall => walkable
		return map.content[coord.y][coord.x] !== _this.tileTypeEnum.WALL;
	}

	return false;
};