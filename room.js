var cls = require("./lib/class"),
    Messages = require("./message"),
    Log = require('log'),
    Utils = require('./utils');

module.exports = Room = cls.Class.extend({
    init: function (name, password, max, mode, server) {
        log.debug("Room create!");
        this.players = {};
        this.d = [
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];

        this.title = name;
        this.password = password;
        this.max_players = max;
        this.game_mode = mode;
        this.server = server;
        this.map = 1;
        this.avatar_on = false;
        this.max_wind = 0;
        this.gp_rate = 0;
        this.s1_disabled = null;
        this.tele_disabled = null;
        this.is_random_teams = null;
        this.status = 0;
        this.lock = 0;
        this.power_user = 1;
        this.type = 1;
        this.minimap = 0;
        this.gp_a = 0;
        this.gold_a = 0;
        this.gp_b = 0;
        this.gold_b = 0;
        this.server.incrementRoomsCount();
        this.id = this.createId();
    },
    destroy: function () {
    },
    addPlayer: function (player) {
        this.players[player.id] = player;
        player.position = this.getSlot();
    },
    removePlayer: function (playerid) {
        delete this.players[playerid];
    },
    setReady: function (playerid) {
        //ready
    },
    gameStart: function () {
        //game start
    },
    chat: function (player, msj) {
        //posible
        _.each(this.players, function (pl) {
            pl.connection.send(msj);
        });
    },
    getState: function () {
        return Messages.Room_getState();
    },
    createId: function () {
        return '12' + Utils.random(99) + '' + (this.server.getRoomsCount());
    },
    getSlot: function () {
        var a = 0;
        var b = 0;
        var team = 0;
        for (var i = 0; i < 4; i++) {
            if (this.d[0][i] == 0) {
                a = i;
                team = 1;
                this.d[0][i] = 1;
                break;
            } else if (this.d[1][i] == 0) {
                b = i;
                team = 2;
                d[1][i] = 1;
                break;
            }
        }
        return this.getPosition(team, a, b, false);
    },
    getPosition: function (team, a, b, Rm) {
        if (Rm) {
            if (team == 0) team = 1;
            else if (team == 1) team = 2;
        }
        return (team == 1) ? ((a == 0) ? a : (a == 1) ? (a + 1) : (a * 2)) : ((b == 0) ? (b + 1) : (b == 1 ? (b + 2) : (b * 2 + 1)));
    }
});