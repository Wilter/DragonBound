var dbsv = require('mysql');
var _conn = dbsv.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'clone'
});

function MySql() {
}
MySql.prototype.Connect = function() {
    if (_conn) {
        _conn.connect(function(err) {
            if (err) {
                log.debug('MySql: ' + err);
            } else {
                log.debug("MySql: Connect!");
            }
        });
    }
};
MySql.prototype.Query = function(sql, callback) {
    _conn.query(sql, function(error, result, fields) {
        if (error) {
            log.debug("MySql: " + error);
        } else {
            callback(result);
        }
    });
};


MySql.prototype.getUserData = function(id, callback){
    var qr = 'SELECT * FROM users u, relationship r, guild_list g, avatars a WHERE u.user_id = ' + id + ' AND r.user_id = u.user_id AND a.user_id = u.user_id AND g.user_id = u.user_id';
    log.debug("getUserData: " + qr);
    this.Query(qr, function(res){
        return callback(res[0]);
    });
};

module.exports = MySql;