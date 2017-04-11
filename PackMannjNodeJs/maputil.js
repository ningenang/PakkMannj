

var _this = this;

module.exports.tileTypeEnum = Object.freeze({
	FLOOR: '_',
	DOOR: '-',
	WALL: '|',
	PELLET: '.',
	SUPER_PELLET: 'o'
	//TODO?: add type for enemies (dangerous, non-dangerous
});

module.exports.createNeighbourTiles = function (coord) {
	return [
		{ x: coord.x - 1,	y: coord.y },		//left
		{ x: coord.x + 1,	y: coord.y },		//right
		{ x: coord.x,		y: coord.y + 1 },	//down
		{ x: coord.x,		y: coord.y - 1 }	//up
	];
}


module.exports.isWalkable = function (map, coord) {
	//check that coordinate is within map bounds
	if (coord.x > -1 && coord.y > -1 &&
		map.width > coord.x && map.height > coord.y) {
		//if not a wall => walkable
		return map.content[coord.y][coord.x] !== _this.tileTypeEnum.WALL;
	}

	return false;
};