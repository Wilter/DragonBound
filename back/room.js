var OPCODE = require("./../define.js");
var GAME_MODE_NORMAL = 0,
    GAME_MODE_BOSS = 1,
    GAME_MODE_SAME = 2;
var E_ROOM_STATE_INDEX = Object.freeze({
    room_type: 0,
    number: 1,
    title: 2,
    password: 3,
    max_players: 4,
    game_mode: 5,
    room_map: 6,
    is_avatars_on: 7,
    max_wind: 8,
    gp_rate: 9,
    minimap: 10,
    is_s1_disabled: 11,
    is_tele_disabled: 12,
    is_random_teams: 13
});
var ROOM_STATUS_WAITING = 0,
    ROOM_STATUS_FULL = 1,
    ROOM_STATUS_PLAYING = 2;
var Users = [];
var d = [
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

function Room() {}
Room.prototype.Create = function(a, b, d, c) {
    this.id = 0;
    this.title = a;
    this.password = b;
    this.max_players = d;
    this.game_mode = c;
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
    return 1;
}
Room.prototype.Join = function(user, master) {
    var idx = Users.push(user) - 1;
    if (master) {
        user.is_master = 1;
    }
    user.position = SlotJoin();
    user.room_id = idx;
    user.UpdateRoomNumber(this.id);
}
Room.prototype.Leave = function(user) {
    Users.splice(user.room_id, 1);
    user.UpdateRoomNumber(-1);
    // gp - gold
    var dat = [OPCODE.SERVER.player_left, 0, 0, user.user_id];
    RemoveSlot(user.position);
    return dat;
}
Room.prototype.GetUsers = function() {
    return Users;
}
Room.prototype.GetState = function() {
    var dat = [
        OPCODE.SERVER.room_state,
        [
            this.type,
            this.id,
            this.title,
            this.password,
            this.max_players,
            this.game_mode,
            this.map,
            this.avatar_on,
            this.max_wind,
            this.gp_rate,
            this.minimap,
            this.s1_disabled,
            this.tele_disabled,
            this.is_random_teams]
    ];
    return dat;
}
Room.prototype.GetPlayers = function() {
    var rate = 7;
    var cout = Users.length;
    var dat = [OPCODE.SERVER.room_players, [cout, rate, [], ]];
    var x = 3;
    Users.forEach(function(us) {
        dat[1][x++] = us.position;
        dat[1][x++] = us.id;
        dat[1][x++] = us.game_id;
        dat[1][x++] = us.rank;
        dat[1][x++] = us.guild;
        dat[1][x++] = us.is_master;
        dat[1][x++] = us.is_ready;
        dat[1][x++] = us.gender;
        dat[1][x++] = us.mobile;
        dat[1][x++] = us.avatars;
        dat[1][x++] = us.is_bot;
        dat[1][x++] = us.power_user;
        dat[1][x++] = us.relationship_status;
    });
    return dat;
}
Room.prototype.UpdateSlot = function(us) {
    var rate = 7;
    var cout = Users.length;
    var dat = [OPCODE.SERVER.slot_update, [cout, rate, [], us.position, us.id, us.game_id, us.rank, us.guild, us.is_master, us.is_ready, us.gender, us.mobile, us.avatars, us.is_bot, us.power_user, us.relationship_status]];
    return dat;
}
Room.prototype.toList = function() {
    var tm = [
        this.id,
        this.title,
        Users.length,
        this.max_players,
        this.status,
        this.game_mode,
        this.lock,
        this.map,
        this.power_user];
    return tm;
}
Room.prototype.SetID = function(id) {
    this.id = id;
}

function SlotJoin() {
    var a = 0;
    var b = 0;
    var team = 0;
    for (var i = 0; i < 4; i++) {
        if (d[0][i] == 0) {
            a = i;
            team = 1;
            d[0][i] = 1;
            break;
        } else if (d[1][i] == 0) {
            b = i;
            team = 2;
            d[1][i] = 1;
            break;
        }
    }
    return GetPosT(team, a, b, false);
}

function RemoveSlot(posSlot) {
    var TeamLeav = posSlot % 2;
    var posArray = (TeamLeav == 1) ? (posSlot <= 3 ? (posSlot == 3 ? posSlot - 2 : posSlot - 1) : (posSlot - 1) / 2) : (TeamLeav < 4 ? ((TeamLeav == 2) ? TeamLeav - 1 : TeamLeav) : (TeamLeav / 2));
    d[TeamLeav][posArray] = 0;
    for (var x = 0; x < 4; x++) {
        if (d[TeamLeav][x] == 0) {
            var np = (x + 1) < 3 ? x + 1 : 3;
            if (d[TeamLeav][np] == 1 && x < 3) {
                d[TeamLeav][x] = 1;
                d[TeamLeav][np] = 0;
                var px = GetPosT(TeamLeav, x, x, true);
                var pnp = GetPosT(TeamLeav, np, np, true);
                //set new
                //console.log("px: " + px + " png: " + pnp);
                var us = GetUserPos(pnp);
                if (us) {
                    us.position = px;
                }
            }
        }
    }
}
Room.prototype.NewMaster = function() {
    console.log("NewMaster!");
    var pos = 0;
    var foun = false;
    var u_id = -1;
    for (var i = 0; i < 4; i++) {
        if (d[0][i] == 1) {
            pos = GetPosT(0, i, i, true);
            foun = true;
            break;
        } else if (d[1][i] == 1) {
            pos = GetPosT(1, i, i, true);
            foun = true;
            break;
        }
    }
    if (foun) {
        Users.forEach(function(us){
            if (us.position == pos) {
                us.is_master = 1;
                console.log("New Master Found!");
                u_id = us.user_id;
                return u_id;
            }
        });
    }
    return u_id;
}

function GetUserPos(pos) {
    Users.forEach(function(us){
        if (us.position == pos) {
            return us;
        }
    });
}

function GetPosT(team, a, b, Rm) {
    if (Rm) {
        if (team == 0) team = 1;
        else if (team == 1) team = 2;
    }
    return (team == 1) ? ((a == 0) ? a : (a == 1) ? (a + 1) : (a * 2)) : ((b == 0) ? (b + 1) : (b == 1 ? (b + 2) : (b * 2 + 1)));
}
module.exports = Room;