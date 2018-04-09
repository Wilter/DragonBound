"use strict";
process.title = 'node-server';
var sv = require('./serverapp.js');
var User = require('./user.js');
var OPCODE = require("./define.js");
var Room = require("./room.js");
var MySql = require("./mysql.js");
var e = [];
var ver = 48;
var Users = [];
var Rooms = [];
var MySql = new MySql();
MySql.Connect();
sv.SetHandler("connected", function(index) {
    console.log("[DragonSocket] Connected");
    var data = [OPCODE.SERVER.hi, ver, "Beginners", 0, 0];
    sv.SendData(index, data);
});
sv.SetHandler("disconnected", function(index) {
    console.log("[DragonSocket] Disconnected");
});
sv.SetHandler("error", function(a) {
    console.log("[DragonSocket] Error:", a)
});
e[OPCODE.CLIENT.login] = function(index, data) {
    console.log("index: " + index + " : " + data);
    var id = data[1];
    var sess = data[2];
    var sql = 'SELECT * FROM users u, relationship r, guild_list g, avatars a WHERE u.user_id = ' + id + ' AND r.user_id = u.user_id AND a.user_id = u.user_id AND g.user_id = u.user_id';
    MySql.Querry(sql, function(res) {
        //console.log("MySql: " + JSON.stringify(res));
        var tUser = new User(id, sess, index, res[0]);
        Users[index] = tUser;
        var data = [OPCODE.SERVER.login_profile];
        sv.SendData(index, data);
        data = [OPCODE.SERVER.login_avatars];
        sv.SendData(index, data);
        sv.SendData(index, tUser.GetPlayerInfo());
        UpdateBoddy(index);
        UpdateListRooms(index);
    });
};
e[OPCODE.CLIENT.get_my_avatars] = function(index, data) {
    var us = Users[index];
    var sql = 'SELECT * FROM player_items WHERE user_id = ' + us.user_id;
    MySql.Querry(sql, function(res) {
        var dat = [OPCODE.SERVER.my_avatars, [
            [], us.gold, us.cash]];
        if (res.length > 0) {
            var x = 0;
            res.forEach(function(its) {
                var c = 0;
                dat[1][0][x] = [];
                dat[1][0][x][c++] = its.id;
                dat[1][0][x][c++] = its.item_id;
                dat[1][0][x][c++] = its.used;
                dat[1][0][x][c++] = null; //unk
                dat[1][0][x][c++] = 0; //unk
                dat[1][0][x][c++] = 0; //unk
                x++;
            });
            sv.SendData(index, dat);
        } else {
            sv.SendData(index, dat);
        }
    });
};
e[OPCODE.CLIENT.equip] = function(index, data) {
    var us = Users[index];
    var ids = data[0];
    var sql = 'UPDATE player_items SET used = 0 WHERE user_id = ' + us.user_id;
    MySql.Querry(sql, function(res1) {
        sql = 'UPDATE player_items SET used = 1 WHERE id IN (';
        var i = null;
        ids.forEach(function(id) {
            if (i != null) {
                i = i + ', ' + id + ' ';
            } else {
                i = id;
            }
        });
        if (i != null) {
            i = i + ')';
            sql = sql + i;
            MySql.Querry(sql, function(res) {
                sql = 'SELECT pi.item_id, it.code, it.type FROM player_items pi, items_list it WHERE pi.used = 1 AND pi.user_id = ' + us.user_id + ' AND it.item_id = pi.item_id;';
                MySql.Querry(sql, function(res2) {
                    var head = 1,
                        eyes = 0,
                        body = 2,
                        flag = 0,
                        background = 0,
                        foreground = 0;
                    res2.forEach(function(item) {
                        if (item.type == 'h') {
                            head = item.item_id;
                        } else if (item.type == 'e') {
                            eyes = item.item_id;
                        } else if (item.type == 'b') {
                            body = item.item_id;
                        } else if (item.type == 'f') {
                            flag = item.item_id;
                        } else if (item.type == '1') {
                            background = item.item_id;
                        } else if (item.type == '2') {
                            foreground = item.item_id;
                        }
                    });
                    us.head = head;
                    us.eyes = eyes;
                    us.body = body;
                    us.flag = flag;
                    us.background = background;
                    us.foreground = foreground;
                    sql = 'UPDATE avatars SET head = ' + head + ', body = ' + body + ', eyes = ' + eyes + ', flag = ' + flag + ', background = ' + background + ', foreground = ' + foreground + ', event1 = 0, event2 = 0 WHERE user_id = ' + us.user_id;
                    MySql.Querry(sql, function(res3) {
                        us.UpdateAvatars();
                        sv.SendData(index, us.GetPlayerInfo());
                    });
                });
            });
        }
    });
};
e[OPCODE.CLIENT.chat] = function(index, data) {
    var ur = Users[index];
    var msj = htmlEntities(data[0]);
    var type = data[1];
    var datas = [OPCODE.SERVER.chat, msj, ur.getGameID(), type];
    if (ur.rank == 24) {
        datas[3] = 5;
    }
    if (ur.guild != 0) {
        datas[4] = ur.guild;
    }
    sv.SendDataAll(index, datas, false);
};
e[OPCODE.CLIENT.change_name] = function(index, data) {
    var name = data[0];
    Users[index].game_id = name;
    sv.SendData(index, Users[index].GetPlayerInfo());
    UpdateBoddy(index);
};
e[OPCODE.CLIENT.room_create] = function(index, data) {
    var rom = new Room();
    if (rom.Create(data[0], data[1], data[2], data[3])) {
        var dat = [OPCODE.SERVER.enter_room];
        sv.SendData(index, dat);
        var id = Rooms.push(rom) - 1;
        rom.SetID(id);
        rom.Join(Users[index], true);
        sv.SendData(index, rom.GetState());
        UpdateListRooms(index);
        SendRoomPlayers(index, rom);
    }
};
e[OPCODE.CLIENT.room_join] = function(index, data) {
    var rom_id = data[0];
    console.log("id: " + rom_id);
    if (Rooms[rom_id]) {
        var dat = [OPCODE.SERVER.enter_room];
        sv.SendData(index, dat);
        var rom = Rooms[rom_id];
        var us = Users[index];
        rom.Join(us, false);
        sv.SendData(index, rom.GetState());
        SendRoomPlayers(index, rom);
        UpdateRoom(index, rom);
    } else {
        console.log(" Channel no Found!");
    }
};
e[OPCODE.CLIENT.channel_join] = function(index, data) {
    var us = Users[index];
    var rom_num = us.room_number;
    console.log("Num: " + rom_num);
    if (rom_num > -1) {
        var rom = Rooms[rom_num];
        var d = rom.Leave(us);
        sv.SendData(index, us.GetPlayerInfo());
        SendDataRoomPlayers(index, d, rom, false);
        UpdateBoddy(index);
        if (us.is_master == 1 && rom.GetUsers().length > 0) {
            var n_us = rom.NewMaster();
            var dat = [OPCODE.SERVER.pass_master, n_us];
            SendDataRoomPlayers(index, dat, rom, false);
            us.is_master = 0;
        } else if (rom.GetUsers().length <= 0) {
            Rooms.splice(rom.id, 1);
        }
        UpdateListRooms(index)
    }
};
e[OPCODE.CLIENT.room_change_ready] = function(index, data) {
    var us = Users[index];
    var dat = [OPCODE.SERVER.changed_ready, us.id, data[0]];
    us.is_ready = data[0] == true ? 1 : 0;
    SendDataRoomPlayers(index, dat, Rooms[us.room_number], false);
};
e[OPCODE.CLIENT.mobile] = function(index, data) {
    var us = Users[index];
    var dat = [OPCODE.SERVER.changed_mobile, us.id, data[0]];
    us.mobile = data[0];
    SendDataRoomPlayers(index, dat, Rooms[us.room_number], false);
};
e[OPCODE.CLIENT.game_start] = function(index, data) {
    var dat = [OPCODE.SERVER.chat, 'No Funciona put..!', 'System', 6];
    sv.SendData(index, dat);
};

function SendRoomPlayers(index, rom) {
    sv.SendData(index, rom.GetPlayers());
}

function SendDataRoomPlayers(index, dat, rom, exp) {
    if (rom) {
        rom.GetUsers().forEach(function(us) {
            if (exp == false) {
                console.log("Send() " + us.index + " name:" + us.game_id + " data: " + dat);
                var s = us.index;
                sv.SendData(s, dat);
            } else if (us.index != index) {
                sv.SendData(us.index, dat);
            }
        });
        console.log("SendDataRoomPlayers()");
    } else {
        console.log("Room No Existe!");
    }
}

function UpdateRoom(index, rom) {
    var d = rom.UpdateSlot(Users[index]);
    SendDataRoomPlayers(index, d, rom, true);
}

function UpdateListRooms(index) {
    if (Rooms.length > 0) {
        var romx = [];
        Rooms.forEach(function(rom) {
            var dt = rom.toList();
            romx.push(dt);
        });
        var dat = [OPCODE.SERVER.rooms_list, romx, 0, 0];
        sv.SendDataAll(index, dat, false);
    }
}

function UpdateBoddy(index) {
    var dat = [OPCODE.SERVER.channel_players, []];
    var i = 0;
    Users.forEach(function(us) {
        dat[1][i++] = us.id;
        dat[1][i++] = us.game_id;
        dat[1][i++] = us.rank;
        dat[1][i++] = us.guild == "0" ? 0 : us.guild;
    });
    sv.SendDataAll(index, dat, false);
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
sv.SetHandler("receive", Object.freeze(e));