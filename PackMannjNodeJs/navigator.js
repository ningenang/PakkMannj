
var _ = require('underscore');
var shuffle = require('shuffle-array');
var mapUtil = require('./maputil');

var Navigator = function Navigator() {

	var targets = {
		superPellets: [],
		pellets: []
	};

	return {

		updateTargets: function (map) {

			superPellets = [];
			pellets = [];

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

		pickTarget: function (currentTile, currentTarget) {

			var updateTarget =
				currentTarget === null || currentTarget === undefined || //no target set, or
				(currentTile.x === currentTarget.x && currentTile.y === currentTarget.y) //target reached;

			if (!updateTarget)
				return currentTarget;

			//just for testing
			if (targets.superPellets.length > 0)
				return targets.superPellets[Math.floor(Math.random() * targets.superPellets.length)];
			else if (targets.pellets.length > 0)
				return targets.pellets[Math.floor(Math.random() * targets.pellets.length)];

			return null;
		},

		translateToMoveCommand: function (currentTile, targetTile) {
			if (targetTile.x > currentTile.x)
				return 'RIGHT';
			else if (targetTile.x < currentTile.x)
				return 'LEFT';
			else if (targetTile.y > currentTile.y)
				return 'DOWN';
			else if (targetTile.y < currentTile.y)
				return 'UP';
		},

		getRandomValidMove: function (map, currentTile) {
			
			var walkableNeighbours = _.filter(
				mapUtil.createNeighbourTiles(currentTile), function (elem) {
					return mapUtil.isWalkable(map, elem);
				});

			var randomNeighbour = _.first(shuffle(walkableNeighbours));

			return Navigator.translateToMoveCommand(currentTile, randomNeighbour);
		}
	}
};

module.exports = Navigator;