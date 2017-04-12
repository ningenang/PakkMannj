
var _ = require('underscore');
var mapUtil = require('./maputil');

var Astar = function Astar() {

	//calculate simple Manhattan distance as the heuristic
	function heuristic(coord, target) {
		var dx = Math.abs(coord.x - target.x);
		var dy = Math.abs(coord.y - target.y);

		//assume movement cost of 1
		return 1 * (dx + dy);
	};

	function moveCost(map, targetTile) {
		return 1;
	};
		
	return {

		getNextTile: function (map, coordStart, target) {

			if (target === undefined || target === null) {
				console.error('getNextTile: target cannot be null or undefined');
				return;
			}

			console.log(`getNextTile: find next move from (${coordStart.x}, ${coordStart.y}) to (${target.x}, ${target.y})`);

			coordStart.cost = 0;

			var frontier = [coordStart];
			var closed = [];

			var current = {};

			while (frontier.length > 0) {

				var lowestValue = frontier[0].cost;
				var ties = [frontier[0]];
				//find the x tiles with the lowest cost
				for (var i = 1; i < frontier.length; i++) {
					if (frontier[i].cost === lowestValue)
						ties.push(frontier[i]);
					else
						break;
				}

				if (ties.length === 1) {
					current = frontier.shift();
				} else {
					//select randomly among tiles if more than one with lowest cost
					var rndIndex = Math.floor(Math.random() * ties.length);
					current = frontier.splice(rndIndex, 1)[0];
				}

				if (current.x === target.x && current.y === target.y)
					break;

				closed.push(current);


				mapUtil
					//process neighbours
					.createNeighbourTiles(current)
					//check all neighbours that are not already processed
					//must also be within map bounds and walkable
					.filter(function (neighbour) {
						return _.findWhere(closed, { x: neighbour.x, y: neighbour.y }) === undefined
							&& mapUtil.isWalkable(map, neighbour);
					})
					.forEach(function (neighbour) {

						//unsure about this!!

						//total cost of moving to neighbour from starting point
						//f(n) = g(n) + h(n)
						var f = (current.cost + moveCost(map, neighbour)) + heuristic(neighbour, target);

						var existingIndex = frontier.findIndex(function (elem) {
							return elem.x === neighbour.x && elem.y === neighbour.y;
						});

						if (existingIndex > -1) {
							if (frontier[existingIndex].cost > f) {
								frontier[existingIndex].cost = f
								frontier[existingIndex].parent = current;
							}
						} else {
							neighbour.cost = f;
							neighbour.parent = current;
							frontier.push(neighbour);
						}
					});

				frontier.sort(function (a, b) { return a.cost - b.cost; });

			}

			var moveToTile;
			if (current.x === target.x && current.y === target.y) {
				while (current !== undefined && current.parent !== undefined) {
					moveToTile = current;
					current = current.parent;
				}

				if(moveToTile !== undefined)
					console.log(`getNextTile: next tile (${moveToTile.x}, ${moveToTile.y})`)
			}

			return moveToTile;
		}
	}
};

module.exports = Astar;