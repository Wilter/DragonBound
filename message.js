
var cls = require("./lib/class"),
    _ = require("underscore"),
    Utils = require("./utils"),
    Types = require("./gametypes");

var Messages = {};
var Message = cls.Class.extend({
});
module.exports = Messages;
module.Class = Message;

/*
 Messages.temple = Message.extend({
 init: function (player) {},
 serialize: function () {}
 });
 */

/* ======== PLAYER ========= */
Messages.Player_login_profile = Message.extend({
    init: function (player) {
        this.player = player;
    },
    serialize: function () {
        return [Types.Messages.SERVER.login_profile];
    }
});

Messages.Player_login_avatars = Message.extend({
    init: function (player) {
        this.player = player;
    },
    serialize: function () {
        return [Types.Messages.SERVER.login_avatars];
    }
});

Messages.Player_info = Message.extend({
    init: function (player) {
        this.player = player;
    },
    serialize: function () {
        return [Types.Messages.SERVER.my_player_info, [
            this.player.user_id,
            this.player.location_type,
            this.player.room_number,
            this.player.game_id,
            this.player.rank,
            this.player.gp,
            this.player.gold,
            this.player.cash,
            this.player.gender,
            this.player.un_lock,
            this.player.head,
            this.player.body,
            this.player.eyes,
            this.player.flag,
            this.player.background,
            this.player.foreground,
            this.player.event1,
            this.player.event2,
            this.player.photo_url,
            this.player.guild,
            this.player.guild_job,
            this.player.name_changes,
            this.player.power_user,
            this.player.tournament,
            this.player.plus10gp,
            this.player.mobile_fox,
            this.player.country,
            this.player.flowers,
            this.player.relationship_status,
            this.player.relationship_with_id,
            this.player.relationship_with_rank,
            this.player.relationship_with_photo,
            this.player.relationship_with_name,
            this.player.relationship_with_gender]];
    }
});

/* ======== LOBBY ========= */
Messages.Chanel_Players = Message.extend({
    init: function (players) {
        this.players = players;
    },
    serialize: function () {
        var data = [Types.Messages.SERVER.channel_players, []];
        var i = 0;
        _.each(this.players, function (us) {
            data[1][i++] = us.idg;
            data[1][i++] = us.game_id;
            data[1][i++] = us.rank;
            data[1][i++] = us.guild == "0" ? 0 : us.guild;
        });
        return data;
    }
});
Messages.Chat = Message.extend({
    init: function (player, message, type) {
        this.gameid = player.game_id;
        this.rank = player.rank;
        this.guild = player.guild;
        this.message = message;
        this.type = type;
    },
    serialize: function () {
        return [Types.Messages.SERVER.chat,
            this.message,
            this.gameid,
                this.rank == 24 ? 5 : this.type,
            this.guild ? this.guild : null
        ];
    }
});

/* ======== ROOM ========= */
Messages.Room_getState = Message.extend({
    init: function (room) {
        this.room = room;
    },
    serialize: function () {
        return [Types.Messages.SERVER.room_state, [
            this.room.type,
            this.room.id,
            this.room.title,
            this.room.password,
            this.room.max_players,
            this.room.game_mode,
            this.room.map,
            this.room.avatar_on,
            this.room.max_wind,
            this.room.gp_rate,
            this.room.minimap,
            this.room.s1_disabled,
            this.room.tele_disabled,
            this.room.is_random_teams
        ]];
    }
});
Messages.Room_getInfo = Message.extend({
    init: function (room) {
        this.room = room;
    },
    serialize: function () {
        return [this.room.id,
            this.room.title,
            _.size(this.room.players),
            this.room.max_players,
            this.room.status,
            this.room.game_mode,
            this.room.lock,
            this.room.map,
            this.room.power_user];
    }
});
Messages.Rooms_List = Message.extend({
    init: function (rooms) {
        this.rooms = rooms;
    },
    serialize: function () {
        var roomx = [];
        _.each(this.rooms, function (room) {
            roomx.push(new Messages.Room_getInfo(room).serialize());
        });
        return [Types.Messages.SERVER.rooms_list, roomx, 0, 0];
    }
});