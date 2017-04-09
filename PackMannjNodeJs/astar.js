
var _navigator = require('./navigator');
var _mapUtil = require('./maputil');

var Astar = function Astar() {

	var navigator = new _navigator();
	var mapUtil = new _mapUtil();

	return {

		getNextMove: function (map, coordStart, target) {

			console.log(`find next move from (${coordStart.x}, ${coordStart.y}) to (${target.x}, ${target.y})`);

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

				if (ties.length === 1)
				{
					current = frontier.shift();
				} else
				{
					//select randomly among tiles if more than one with lowest cost
					var rndIndex = Math.floor(Math.random() * ties.length);
					current = frontier.splice(rndIndex, 1)[0];
				}
			
				if (current.x === target.x && current.y === target.y)
					break;

				closed.push(current);

				//process neighbours
				[
					{ x: current.x - 1, y: current.y }, //left
					{ x: current.x + 1, y: current.y }, //right
					{ x: current.x, y: current + 1 }, //down
					{ x: current.x, y: current - 1 } //up
				]
					//check all neighbours that are not already processed
					//must also be within map bounds and walkable
					.filter(function (neighbour) {
						return closed.indexOf(neighbour) === -1
							&& mapUtil.isWalkable(map, neighbour);
					})
					.forEach(function (neighbour) {

						//unsure about this!!

						//total cost of moving to neighbour from starting point
						//f(n) = g(n) + h(n)
						var f = (current.cost + 1) + navigator.heuristic(neighbour);

						var existingIndex = open.indexOf(neighbour);
						
						if (existingIndex > -1) {
							if (open[existingIndex].cost > f) {
								open[existingIndex].cost = f
								open[existingIndex].parent = current;
							}
						} else {
							neighbour.cost = f;
							neighbour.parent = current;
							open.push(neighbour);
						}
					});

				frontier.sort(function (a, b) { return a.cost - b.cost; });

			}

			if (current === target)
			{
				console.log('printing path:');
				while (current.parent !== null)
				{
					console.log(current); //print path in reverse
					current = current.parent;
				} 
			}
		}
	}
};

module.exports = Astar;