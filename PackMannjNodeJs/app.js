'use strict';

var _client = require('./client.js');
var _astar = require('./astar.js');
var _navigator = require('./navigator');

var client = new _client('127.0.0.1', 54321, 'testbot');
var astar = new _astar();
var navigator = new _navigator();

client.on('welcome', function (data) {	
	navigator.updateTargets(data.map);

	var target = navigator.pickTarget();

	var startCoordinates = {
		x: data.you.x,
		y: data.you.y
	};

	var firstMove = astar.getNextMove(data.map, startCoordinates, target);
});

client.on('stateupdate', function (data) {
	//client.sendString('LEFT\n');
});