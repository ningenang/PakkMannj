

var _mapUtil = require('./maputil');

var Navigator = function Navigator() {

	var mapUtil = new _mapUtil();

	var targets = {
		superPellets: [],
		pellets: []
	};

	var currentTarget = {};

	return {

		updateTargets: function (map) {
			map.content.forEach(function (row, rowIndex) {
				for (var i = 0; i < row.length; i++) {
					if (row[i] === mapUtil.tileTypeEnum.SUPER_PELLET) {
						targets.superPellets.push(
							{
								x: i,
								y: rowIndex
							}
						);
					}
					else if (row[i] === mapUtil.tileTypeEnum.PELLET) {
						targets.pellets.push(
							{
								x: i,
								y: rowIndex
							}
						);
					}

				}
			});
		},

		pickTarget: function () {
			//just for testing
			if (targets.superPellets.length > 0)
				currentTarget = targets.superPellets[Math.floor(Math.random() * targets.superPellets.length)];
			else if (targets.pellets.length > 0)
				currentTarget = targets.pellets[Math.floor(Math.random() * targets.pellets.length)];
			return currentTarget;
		},

		//calculate simple Manhattan distance as the heuristic
		heuristic: function (coord) {
			var dx = Math.abs(coord.x - currentTarget.x);
			var dy = Math.abs(coord.y - currentTarget.y);

			//assume movement cost of 1
			return 1 * (dx + dy);
		}

	}
};

module.exports = Navigator;