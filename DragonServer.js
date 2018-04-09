
var cls = require("./lib/class"),
    _ = require("underscore"),
    Log = require('log'),
    Entity = require('./entity'),
    Character = require('./character'),
    Player = require('./player'),
    Room = require('./room'),
    Messages = require('./message'),
    Utils = require("./utils"),
    Types = require("./gametypes");

module.exports = DragonServer = cls.Class.extend({
    init: function (id, maxPlayers, websocketServer) {
        var self = this;
        this.id = id;
        this.players = {};
        this.rooms = {};
        this.roomscount = 0;
        this.maxPlayers = maxPlayers;
        this.server = websocketServer;
        this.ups = 50;
        this.groups = {
            1: {
                players: {}
            }
        };
        this.outgoingQueues = {};
        this.playerCount = 0;
        this.trom1 = new Room('developer', '1', 2, 0, this);
        this.rooms[this.trom1.id] = this.trom1;
        this.trom2 = new Room('xd2', '2', 2, 0, this);
        this.rooms[this.trom2.id] = this.trom2;
        this.trom3 = new Room('xd3', '3', 2, 0, this);
        this.rooms[this.trom3.id] = this.trom3;
        this.onPlayerConnect(function (player) {
        });
        this.onPlayerEnter(function (player) {
            log.info(player.game_id + " has joined " + self.id);
            if (!player.hasEnteredGame) {
                self.incrementPlayerCount();
            }
            player.onBroadcast(function (message, ignoreSelf) {
                self.pushToAdjacentGroups(player.group, message, ignoreSelf ? player.id : null);
            });
            player.onExit(function () {
                log.info(player.game_id + " has left the game.");
                self.removePlayer(player);
                self.decrementPlayerCount();
                if (self.removed_callback) {
                    self.removed_callback();
                }
            });
            if (self.added_callback) {
                self.added_callback();
            }
        });
        this.onChannelPlayer(function () {
            self.updateChannelPlayer();
        });
    },

    run: function () {
        var self = this;
        var regenCount = this.ups * 2;
        var updateCount = 0;
        setInterval(function () {
            //self.processGroups();
            self.processQueues();
            if (updateCount < regenCount) {
                updateCount += 1;
            } else {
                if (self.regen_callback) {
                    self.regen_callback();
                }
                updateCount = 0;
            }
        }, 1000 / this.ups);

        log.info("" + this.id + " created (capacity: " + this.maxPlayers + " players).");
    },

    nInit: function (callback) {
        this.init_callback = callback;
    },

    onPlayerConnect: function (callback) {
        this.connect_callback = callback;
    },

    onPlayerEnter: function (callback) {
        this.enter_callback = callback;
    },

    onChannelPlayer: function (callback) {
        this.channel_player_update = callback;
    },

    addPlayer: function (player) {
        this.players[player.id] = player;
        this.outgoingQueues[player.id] = [];
        this.groups[1].players[player.id] = player;
        log.info("Added player : " + player.id);
        this.updateChannelPlayer();
        this.updateRoomsList();
    },
    removePlayer: function (player) {
        delete this.groups[1].players[player.id];
        delete this.players[player.id];
        delete this.outgoingQueues[player.id];
    },

    onPlayerAdded: function (callback) {
        this.added_callback = callback;
    },

    onPlayerRemoved: function (callback) {
        this.removed_callback = callback;
    },

    onRegenTick: function (callback) {
        this.regen_callback = callback;
    },
    pushToPlayer: function (player, message) {
        if (player && player.id in this.outgoingQueues) {
            this.outgoingQueues[player.id].push(message.serialize());
        } else {
            log.error("pushToPlayer: player was undefined");
        }
    },
    pushToGroup: function (groupId, message, ignoredPlayer) {
        var self = this,
            group = this.groups[groupId];

        if (group) {
            _.each(group.players, function (playerId) {
                if (playerId != ignoredPlayer) {
                    self.pushToPlayer(playerId, message);
                }
            });
        } else {
            log.error("groupId: " + groupId + " is not a valid group");
        }
    },

    pushToAdjacentGroups: function (groupId, message, ignoredPlayer) {
        var self = this;
        self.pushToGroup(groupId, message, ignoredPlayer);
    },

    pushToPreviousGroups: function (player, message) {
        var self = this;
        _.each(player.recentlyLeftGroups, function (id) {
            self.pushToGroup(id, message);
        });
        player.recentlyLeftGroups = [];
    },

    pushBroadcast: function (message, ignoredPlayer) {
        for (var id in this.outgoingQueues) {
            if (id != ignoredPlayer) {
                this.outgoingQueues[id].push(message.serialize());
            }
        }
    },
    processQueues: function () {
        var self = this,
            connection;

        for (var id in this.outgoingQueues) {
            if (this.outgoingQueues[id].length > 0) {
                connection = this.server.getConnection(id);
                for (var dt in this.outgoingQueues[id]) {
                    connection.send(this.outgoingQueues[id][dt]);
                }
                this.outgoingQueues[id] = [];
            }
        }
    },
    setPlayerCount: function (count) {
        this.playerCount = count;
    },
    incrementPlayerCount: function () {
        this.setPlayerCount(this.playerCount + 1);
    },

    decrementPlayerCount: function () {
        if (this.playerCount > 0) {
            this.setPlayerCount(this.playerCount - 1);
        }
    },
    getRoomsCount: function () {
        return this.roomscount;
    },
    incrementRoomsCount: function () {
        this.roomscount++;
    },
    updateChannelPlayer: function () {
        this.pushBroadcast(new Messages.Chanel_Players(this.players));
    },
    updateRoomsList: function () {
        this.pushBroadcast(new Messages.Rooms_List(this.rooms));
    }
});