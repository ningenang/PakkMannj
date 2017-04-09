

var MapUtil = function MapUtil() {

	return {

		//Object.freeze prevents other code from changing the enum
		tileTypeEnum: Object.freeze({
			FLOOR: '_',
			DOOR: '-',
			WALL: '|',
			PELLET: '.',
			SUPER_PELLET: 'o',
		}),

		isWalkable: function (map, coord) {
			//check that coordinate is within map bounds
			if (coord.x > -1 && coord.y > -1 &&
				map.width > coord.x && map.height > coord.y) {
				//if not a wall => walkable
				return map.content[coord.y][coord.x] !== MapUtil.tileTypeEnum.WALL;

			} else {
				console.error(`coordinate (${coord.x}, ${coord.y}) outside bounds (${map.width}, ${map.height})`);
			}

			return false;
		},
	};
};


module.exports = MapUtil;