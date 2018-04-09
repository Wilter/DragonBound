
var fs = require('fs');
//GLOBAL.window = GLOBAL;
_ = require('underscore');
Log = require('log');
Ms = require("./mysql");
MySql = new Ms();

function main(config) {
    var ws = require("./ws"),
        DragonServer = require("./dragonserver"),
        Player = require("./player"),
        DServer,
        server = new ws.SocketServer(config.port);

    switch (config.debug_level) {
        case "error":
            log = new Log(Log.ERROR);
            break;
        case "debug":
            log = new Log(Log.DEBUG);
            break;
        case "info":
            log = new Log(Log.INFO);
            break;
    }

    log.info("Starting DragonBound game server...");

    server.onConnect(function (connection) {
        connection.send([9, 48, "Dev", 0, 0]);
        DServer.connect_callback(new Player(connection, DServer));
    });
    server.onError(function () {
        log.error(Array.prototype.join.call(arguments, ", "));
    });

    DServer = new DragonServer('Server1', config.nb_players_per_server, server);
    DServer.run();

    process.on('uncaughtException', function (e) {
        log.error('uncaughtException: ' + e);
    });
}
function getConfigFile(path, callback) {
    fs.readFile(path, 'utf8', function (err, json_string) {
        if (err) {
            console.error("Could not open config file:", err.path);
            callback(null);
        } else {
            callback(JSON.parse(json_string));
        }
    });
}
var defaultConfigPath = './config.json',
    customConfigPath = './config_local.json';

process.argv.forEach(function (val, index, array) {
    if (index === 2) {
        customConfigPath = val;
    }
});
getConfigFile(defaultConfigPath, function (defaultConfig) {
    getConfigFile(customConfigPath, function (localConfig) {
        if (localConfig) {
            main(localConfig);
        } else if (defaultConfig) {
            main(defaultConfig);
        } else {
            console.error("Server cannot start without any configuration file.");
            process.exit(1);
        }
    });
});