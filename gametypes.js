
_ = require('underscore');
Types = {
    Messages: {
        SERVER: {
            chat: 0,
            my_player_info: 1,
            room_players: 2,
            room_state: 3,
            game_start: 4,
            pchat: 5,
            room_update: 6,
            friend_update: 7,
            play: 8,
            hi: 9,
            rooms_list: 10,
            update: 11,
            dead: 12,
            game_over: 13,
            items: 14,
            master_timer: 15,
            my_avatars: 16,
            alert: 17,
            friends: 18,
            guild: 19,
            info: 20,
            friendreq: 21,
            guildreq: 22,
            guildres: 23,
            logout: 24,
            disconnect_reason: 25,
            login_profile: 26,
            login_avatars: 27,
            pass: 28,
            joined: 29,
            left: 30,
            channel_players: 31,
            changed_mobile: 32,
            changed_team: 33,
            changed_ready: 34,
            slot_update: 35,
            player_left: 36,
            enter_room: 37,
            pass_master: 38,
            extra_room_info: 39,
            alert2: 40,
            tournament_wait: 41,
            team_search: 42,
            game_share: 43,
            relationreq: 44
        },
        CLIENT: {
            login: 0,
            chat: 1,
            pchat: 2,
            tab: 3,
            game_move: 4,
            game_shoot: 5,
            mobile: 6,
            room_change_ready: 7,
            room_change_team: 8,
            getinfo: 9,
            room_create: 10,
            room_join: 11,
            channel_join: 12,
            game_start: 13,
            game_pass_turn: 14,
            game_items: 15,
            game_use_item: 16,
            get_my_avatars: 17,
            equip: 18,
            buy: 19,
            quick_join: 20,
            room_title: 21,
            select_bot: 22,
            event: 23,
            addfriend: 24,
            guildinvite: 25,
            friend_approved: 26,
            guild_approved: 27,
            friend_delete: 28,
            room_options: 29,
            guild_create: 30,
            guild_leave: 31,
            channel_rooms: 32,
            refresh: 33,
            guild_kick: 34,
            change_info: 35,
            change_name: 36,
            guildres: 37,
            get_room_info: 38,
            refresh_friends: 39,
            refresh_guildies: 40,
            tournament_start_game: 41,
            tournament_cancel_wait: 42,
            create_team: 43,
            team_search_cancel: 44,
            game_share: 45,
            relationship_change: 46,
            relationship_approved: 47
        }
    },
    Orientations: {
        LEFT: 1,
        RIGHT: 2
    }
};
Types.getMessageTypeAsString = function(type) {
    var typeName;
    _.each(Types.Messages.CLIENT, function(value, name) {
        if(value === type) {
            typeName = name;
        }
    });
    if(!typeName) {
        typeName = "UNKNOWN";
    }
    return typeName;
};

if(!(typeof exports === 'undefined')) {
    module.exports = Types;
}