"use strict";
var webSocketsServerPort = 9002;
var webSocketServer = require('websocket').server;
var http = require('http');
//var OPCODE = require("./define.js");
var receive_handlers = [];
var error_handler = void 0;
var disconnected_handler = void 0;
var connected_handler = void 0;
var clients = [];
var server = http.createServer(function(request, response) {});
server.listen(webSocketsServerPort, function() {
    console.log(" Server is listening on port " + webSocketsServerPort);
});
var ws = new webSocketServer({
    httpServer: server
});

function getClient(index) {
    return clients[index];
}

function SetHandler(a, b) {
    if ("connected" == a) {
        connected_handler = b;
    } else if ("disconnected" == a) {
        disconnected_handler = b;
    } else if ("error" == a) {
        error_handler = b;
    } else if ("receive" == a) {
        receive_handlers = Object.freeze(b);
    }
}

function SendData(index, data) {
    console.log("send: " + JSON.stringify(data));
    getClient(index).sendUTF(JSON.stringify(data));
}

function SendDataAll(index, data, exp) {
    for (var i = 0; i < clients.length; i++) {
        if (exp != true) {
            SendData(i, data);
        } else if (i != index) {
            SendData(i, data);
        }
    }
}
ws.on('request', function(request) {
    console.log(' Connection from origin ' + request.origin + '.');
    var connection = request.accept(null, request.origin);
    var index = clients.push(connection) - 1;
    connected_handler && connected_handler(index)
    var self = this;
    connection.on('message', function(a) {
        try {
            var b = JSON.parse(a.utf8Data)
        } catch (f) {
            error_handler && error_handler("Received not JSON: " + a.utf8Data);
            return
        }
        if (1 > b.length) {
            error_handler && error_handler("JSON is not Array: " + b);
        } else {
            var op = b[0];
            b.shift();
            if (receive_handlers[op]) {
                receive_handlers[op].apply(null, [index, b]);
            } else {
                error_handler && error_handler("No handler for op-code: " + op + " at packet: " + JSON.stringify(b));
            }
        }
    });
    connection.on('close', function(connection) {
        console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected.");
        clients.splice(index, 1);
        disconnected_handler && disconnected_handler(index)
    });
});
ws.on('error', function(a) {
    error_handler && d.error_handler(a)
});
module.exports.getClient = getClient;
module.exports.SetHandler = SetHandler;
module.exports.SendData = SendData;
module.exports.SendDataAll = SendDataAll;