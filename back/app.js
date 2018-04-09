
"use strict";
var webSocketsServerPort = 9002;
var webSocketServer = require('websocket').server;
var http = require('http');
var OPCODE = require("./define.js");
var User = require('./user.js');

var MySql = require("./../mysql.js");
var MySql = new MySql();

var clients = [];
var server = http.createServer(function(request, response) {});
server.listen(webSocketsServerPort, function() {
    console.log(" Server is listening on port " + webSocketsServerPort);
});
var ws = new webSocketServer({
    httpServer: server
});

ws.on('request', function(request) {
    var self = this;
    console.log(' Connection from origin ' + request.origin + '.');
    self.client = request.accept(null, request.origin);
    self.client.index = clients.push(self.client) - 1;
    self.client.connect_handler = function(){
        var data = [OPCODE.SERVER.hi, 48, "Dev", 0, 0];
        self.client.sendUTF(JSON.stringify(data));
    };
    self.Send = function(data){
        self.client.sendUTF(JSON.stringify(data));
    };
    self.broadcast = function(data){
        ws.broadcastUTF(JSON.stringify(data));
    };
    /************************************************/
    self.login_profile_response = function(){
        var data = [
            OPCODE.SERVER.login_profile
        ];
        self.Send(data);
    };
    self.login_avatars_response = function(){
        var data = [
            OPCODE.SERVER.login_avatars
        ];
    };
    self.login_profile_response = function(){
        var data = [OPCODE.SERVER.login_profile];
        self.Send(data);
    };
    self.login_avatars_response = function(){
        var data = [OPCODE.SERVER.login_avatars];
        self.Send(data);
    };
    self.my_player_info_response = function(){
        var data = [
            OPCODE.SERVER.my_player_info,
            self.client.user.getPlayerInfo()
        ];
        self.Send(data);
    };
    self.chat_response = function(msj, type){
        var data = [
            OPCODE.SERVER.chat,
            msj,
            self.client.user.game_id,
            self.client.user.rank == 24 ? 5 : type
        ];
        if (self.client.user.guild != 0) {
            data[4] = self.client.user.guild;
        }
        self.broadcast(data);
    };
    self.channel_players_response = function(){
        var data = [
            OPCODE.SERVER.channel_players,
            []
        ];
        var i = 0;
        clients.forEach(function(us) {
            data[1][i++] = us.user.id;
            data[1][i++] = us.user.game_id;
            data[1][i++] = us.user.rank;
            data[1][i++] = us.user.guild == "0" ? 0 : us.user.guild;
        });
        self.broadcast(data);
    };
    /************************************************/
    self.error_handler = function(m){
        console.log(m);
    };
    self.client.handlers = function(data){
        console.log("data: ", JSON.stringify(data));
        var opcode = data[0];
        switch (opcode){
            case OPCODE.CLIENT.login : {
                self.client.ver = data[1];
                self.client.id = data[2];
                self.client.session = data[3];
                MySql.getUserData(self.client.id, function(res){
                    self.client.user = new User(self.client.id, res);
                    self.login_profile_response();
                    self.login_avatars_response();
                    self.my_player_info_response();
                    self.channel_players_response();
                });
                break;
            }
            case OPCODE.CLIENT.chat : {
                var msj = data[1];
                var type = data[2];
                self.chat_response(msj, type);
                break;
            }
            case OPCODE.CLIENT.change_name : {
                var name = data[1];
                self.client.user.game_id = name;
                self.my_player_info_response();
                self.channel_players_response();
            }
            case OPCODE.CLIENT.tab : {
                break;
            }
            case OPCODE.CLIENT.refresh_friends : {
                break;
            }
            case OPCODE.CLIENT.refresh_guildies : {
                break;
            }
            default : {
                console.log("unk-op: " + opcode);
                break;
            }
        }
    };

/**************************************************************************/
    self.client.connect_handler();
    self.client.on('message', function(a){
        try {
            var b = JSON.parse(a.utf8Data)
        } catch (f) {
            self.error_handler("Received not JSON: " + a.utf8Data);
            return
        }
        if (1 > b.length) {
            self.error_handler("JSON is not Array: " + b);
        } else {
            self.client.handlers(b);
        }
    });
});

ws.on('error', function(a) {
});

