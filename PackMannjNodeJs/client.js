
var net = require('net'),
	eventEmitter = require('events'),
	util = require('util');


var Client = function (host, port, botName) {

	var _this = this;

	_this._client = new net.Socket();

	_this._client.connect(port, host, function () {
		_this._client.write('NAME ' + botName);
	});

	_this._client.on('data', function (buffer) {
		var data = JSON.parse(buffer.toString('utf8'));

		switch (data['messagetype']) {
			case 'welcome':
			case 'stateupdate':
			case 'dead':
			case 'endofround':
			case 'startofround':
				_this.emit(data['messagetype'], data);
				break;
			default:
				console.error('Unrecognized message type: ' + data['messagetype']);
		}
	});
};

Client.prototype.sendString = function (str) {
	this._client.write(str);
};

util.inherits(Client, eventEmitter);

module.exports = Client;

