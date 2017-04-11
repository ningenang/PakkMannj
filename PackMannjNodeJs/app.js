'use strict';

//self-invoking function - avoid polluting global namespace
(function _app() {

	var _client = require('./client.js');
	var _astar = require('./astar.js');
	var _navigator = require('./navigator');

	var client = new _client('127.0.0.1', 54321, 'testbot');
	var astar = new _astar();
	var navigator = new _navigator();

	var currentTarget;

	//helper method used for both 'welcome' and 'stateupdate' events
	function sendNextMove(map, currentTile, targetTile) {

		//get the tile to move to using a*-algorithm
		var nextTile = astar.getNextTile(map, currentTile, targetTile);
		var nextMove;
		if (nextTile !== undefined)
		{
			//translate to move command (up, down, left, right)
			nextMove = navigator.translateToMoveCommand(currentTile, nextTile);
		}
		else {
			console.log('sendNextMove: unable to determine next tile! choosing direction at random!');
			nextMove = navigator.getRandomValidMove();
		}

		client.sendString(nextMove);
	}


	client.on('welcome', function (data) {
		console.time('process welcome');
		navigator.updateTargets(data.map);

		var startTile = {
			x: data.you.x,
			y: data.you.y
		};

		currentTarget = navigator.pickTarget(startTile);

		sendNextMove(data.map, startTile, currentTarget);

		console.timeEnd('process welcome');
	});

	client.on('stateupdate', function (data) {
		console.time('process update');

		navigator.updateTargets(data.gamestate.map);

		var currentTile = {
			x: data.gamestate.you.x,
			y: data.gamestate.you.y
		};

		currentTarget = navigator.pickTarget(currentTile, currentTarget);

		sendNextMove(data.gamestate.map, currentTile, currentTarget);

		console.timeEnd('process update');
	});

})();

