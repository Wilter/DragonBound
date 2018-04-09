var cls = require("./lib/class"),
    url = require('url'),
    http = require('http'),
    _ = require('underscore'),
    wsServer = require('websocket').server;
    Utils = require('./utils'),
    WS = {};
module.exports = WS;

var Server = cls.Class.extend({
    _connections : {},
    init: function(port) {
        this.port = port;
    },

    onConnect: function(callback) {
        this.connection_callback = callback;
    },

    onError: function(callback) {
        this.error_callback = callback;
    },

    broadcast: function(message) {
        throw "Not implemented";
    },

    forEachConnection: function(callback) {
        _.each(this._connections, callback);
    },

    addConnection: function(connection) {
        this._connections[connection.id] = connection;
    },

    removeConnection: function(id) {
        delete this._connections[id];
    },

    getConnection: function(id) {
        return this._connections[id];
    }
});

var Connection = cls.Class.extend({
    init: function(id, connection, server) {
        this._connection = connection;
        this._server = server;
        this.id = id;
    },

    onClose: function(callback) {
        this.close_callback = callback;
    },

    listen: function(callback) {
        this.listen_callback = callback;
    },

    broadcast: function(message) {
        throw "Not implemented";
    },

    send: function(message) {
        throw "Not implemented";
    },

    sendUTF8: function(data) {
        throw "Not implemented";
    },

    close: function(logError) {
        log.info("Closing connection to "+this._connection.remoteAddress+". Error: "+logError);
        this._connection.close();
    }
});

WS.SocketServer = Server.extend({
    _counter: 0,

    init: function(port) {
        var self = this;
        this._super(port);

        this._httpServer = http.createServer(function(request, response){});
        this._httpServer.listen(port, function() {
            log.info("Server is listening on port "+port);
        });
        var ws = new wsServer({httpServer: this._httpServer});

        ws.on('request', function(request) {
            var wsConnection = request.accept(null, request.origin);
            var c = new WS.SocketConnection(self._createId(), wsConnection, self);
            if(self.connection_callback) {
                self.connection_callback(c);
            }
            self.addConnection(c);
        });
    },
    _createId: function() {
        return '5' + Utils.random(99) + '' + (this._counter++);
    },

    broadcast: function(message) {
        this.forEachConnection(function(connection) {
            connection.send(message);
        });
    },

    onRequestStatus: function(status_callback) {
        this.status_callback = status_callback;
    }
});


WS.SocketConnection = Connection.extend({
    init: function(id, connection, server) {
        var self = this;

        this._super(id, connection, server);

        this._connection.on('message', function(message) {
            if(self.listen_callback) {
                if(message.type === 'utf8') {
                    try {
                        self.listen_callback(JSON.parse(message.utf8Data));
                    } catch(e) {
                        if(e instanceof SyntaxError) {
                            self.close("Received message was not valid JSON.");
                        } else {
                            throw e;
                        }
                    }
                }
            }
        });
        this._connection.on('close', function(connection) {
            if(self.close_callback) {
                self.close_callback();
            }
            delete self._server.removeConnection(self.id);
        });
    },
    send: function(message) {
        var data = JSON.stringify(message);
        this.sendUTF8(data);
    },
    sendUTF8: function(data) {
        this._connection.sendUTF(data);
    }
});

