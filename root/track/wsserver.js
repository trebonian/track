var watchers = [];

console.log('starting');

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 2001});
wss.on('connection', newWatcher);

var net = require('net');
net.createServer(newDataSource).listen(2002);

function newWatcher(c){
	c.remoteAddress = c._socket.remoteAddress;
	console.log(c.remoteAddress+' connected');
	watchers.push(c);
	c.on('close', function (code, reason) {closeWatcher(c);});
	c.on('error', function (e) {watcherError(e,c);});
}

function watcherError(e,c){
	console.log('watcher error:', e);
	closeWatcher(c);
}

function closeWatcher(c){
	watchers.splice(watchers.indexOf(c),1);
	console.log(c.remoteAddress+' disconnected ('+watchers.length+' remaining)');
}

function newDataSource(s){
	var addr = s.remoteAddress;
	console.log(addr+' connected as datasource');
	s.setEncoding('utf8');
	s.on('data', handleData);
	s.on('close', function () {console.log(addr+' disconnected');});
	s.on('error', console.log);
}

function handleData(str){
	for(var i in watchers) watchers[i].send(str);
}


