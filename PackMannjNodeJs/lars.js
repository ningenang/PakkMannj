'use strict';

//todo: more (globally) accessible object with current game state


//self-invoking function - avoid polluting global namespace
(function _lars() {

	var _commander = require('commander');

	var _client = require('./client.js');
	var _astar = require('./astar.js');
	var _navigator = require('./navigator');

	_commander
		.version('0.0.1')
		.usage('[options]')
		.option('-s, --server [ip:port]', 'Server address (ip:port)', '127.0.0.1:54321')
		.option('-n, --nick [name]', 'Bot nick', 'L.A.R.S.')
		.parse(process.argv);

	var address = _commander.server.split(':');
	if (address.length != 2)
	{
		console.error('invalid argument: server. must be on the form adress:port (e.g 127:0.0.1:54321)');
		return;
	}

	var client = new _client(address[0], address[1], _commander.nick);
	var astar = new _astar();
	var navigator = new _navigator();

	var currentTarget;

	//helper method used for both 'welcome' and 'stateupdate' events
	function sendNextMove(map, me, others, targetTile) {

		//get the tile to move to using a*-algorithm
		var nextTile = astar.getNextTile({
			me: me,
			others: others,
			map: map,
			target: targetTile
		});

		var nextMove;
		if (nextTile !== undefined)
		{
			//translate to move command (up, down, left, right)
			nextMove = navigator.translateToMoveCommand(me, nextTile);
		}
		else {
			console.log('sendNextMove: unable to determine next tile! choosing direction at random!');
			nextMove = navigator.getRandomValidMove(map, me);
		}

		client.sendString(nextMove);
	}


	client.on('welcome', function (data) {
		console.time('process welcome');
		navigator.updateTargets(data.map);

		currentTarget = navigator.pickTarget({
			me: data.you,
			others: data.others,
			target: currentTarget
		});

		sendNextMove(data.map, data.you, data.others, currentTarget);

		console.timeEnd('process welcome');
	});

	client.on('stateupdate', function (data) {
		console.time('process update');

		navigator.updateTargets(data.gamestate.map);

		currentTarget = navigator.pickTarget({
			me: data.gamestate.you,
			others: data.gamestate.others,
			target: currentTarget
		});

		sendNextMove(data.gamestate.map, data.gamestate.you, data.gamestate.others, currentTarget);

		console.timeEnd('process update');
	});

})();

