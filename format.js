
var _ = require('underscore'),
    Types = require("./gametypes");

(function () {
    FormatChecker = Class.extend({
        init: function () {
            this.formats = [];
            /*
             s = string
             n = number
             t = s & n
             */
            /* ==== PLAYER ==== */
            this.formats[Types.Messages.CLIENT.login] = ['n', 'n', 's', 'n', 'n'];
            this.formats[Types.Messages.CLIENT.change_info] = ['n'];
            this.formats[Types.Messages.CLIENT.change_name] = ['t'];
            this.formats[Types.Messages.CLIENT.get_my_avatars] = [];
            this.formats[Types.Messages.CLIENT.equip] = [];

            /* ==== CHANEL ==== */
            this.formats[Types.Messages.CLIENT.chat] = ['t', 'n'];
            this.formats[Types.Messages.CLIENT.tab] = ['n'];
            this.formats[Types.Messages.CLIENT.refresh_friends] = [];
            this.formats[Types.Messages.CLIENT.refresh_guildies] = [];
            this.formats[Types.Messages.CLIENT.channel_rooms] = ['s'];
            this.formats[Types.Messages.CLIENT.quick_join] = [];

            /* ==== ROOM ==== */
            this.formats[Types.Messages.CLIENT.room_create] = ['t', 't', 'n', 'n'];
            this.formats[Types.Messages.CLIENT.room_join] = ['t', 't'];

        },
        check: function (msg) {
            var message = msg.slice(0),
                type = message[0],
                format = this.formats[type];
            message.shift();
            if (format) {
                if (message.length !== format.length) {
                    return false;
                }
                for (var i = 0, n = message.length; i < n; i += 1) {
                    if (format[i] === 'n' && message[i] !== null && !_.isNumber(message[i])) {
                        return false;
                    }
                    if (format[i] === 's' && message[i] !== null && !_.isString(message[i])) {
                        return false;
                    }
                }
                return true;
            }
            /*else if(type === Types.Messages.WHO) {
             // WHO messages have a variable amount of params, all of which must be numbers.
             return message.length > 0 && _.all(message, function(param) { return _.isNumber(param) });
             }*/
            else {
                log.error("Unknown message type: " + type);
                return false;
            }
        }
    });
    var checker = new FormatChecker;
    exports.check = checker.check.bind(checker);
})();