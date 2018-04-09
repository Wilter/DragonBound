function User(id, a) {
    var self = this;
    self.id = id;
    // if is valid user
    self.user_id = a.user_id;
    self.location_type = a.location_type;
    self.room_number = a.room_number;
    self.game_id = a.game_id;
    self.rank = a.rank;
    self.gp = a.gp;
    self.gold = a.gold;
    self.cash = a.cash;
    self.gender = a.gender;
    self.un_lock = a.un_lock;
    self.photo_url = a.photo_url;
    self.name_changes = a.name_changes;
    self.power_user = a.power_user;
    self.tournament = a.tournament;
    self.plus10gp = a.plus10gp;
    self.mobile_fox = a.mobile_fox;
    self.country = a.country;
    self.flowers = a.flowers;
    self.position = a.position;
    self.is_master = 0;
    self.is_ready = 0;
    self.is_bot = 0;
    self.mobile = a.mobile;
    self.head = a.head;
    self.body = a.body;
    self.eyes = a.eyes;
    self.flag = a.flag;
    self.background = a.background;
    self.foreground = a.foreground;
    self.event1 = a.event1;
    self.event2 = a.event2;
    self.guild = a.guild == "0" ? 0 : a.guild;
    self.guild_job = a.guild_job;
    self.relationship_status = a.relationship_status;
    self.relationship_with_id = a.relationship_with_id;
    self.relationship_with_rank = a.relationship_with_rank;
    self.relationship_with_photo = a.relationship_with_photo;
    self.relationship_with_name = a.relationship_with_name;
    self.relationship_with_gender = a.relationship_with_gender;
    self.avatars = [self.head, self.body, self.eyes, self.flag, self.foreground, self.background];
    self.room_id = -1;
}
User.prototype.getGameId = function() {
    return this.game_id;
};
User.prototype.getPlayerInfo = function() {
    var data = [
        this.user_id,
        this.location_type,
        this.room_number,
        this.game_id,
        this.rank,
        this.gp,
        this.gold,
        this.cash,
        this.gender,
        this.un_lock,
        this.head,
        this.body,
        this.eyes,
        this.flag,
        this.background,
        this.foreground,
        this.event1,
        this.event2,
        this.photo_url,
        this.guild,
        this.guild_job,
        this.name_changes,
        this.power_user,
        this.tournament,
        this.plus10gp,
        this.mobile_fox,
        this.country,
        this.flowers,
        this.relationship_status,
        this.relationship_with_id,
        this.relationship_with_rank,
        this.relationship_with_photo,
        this.relationship_with_name,
        this.relationship_with_gender
    ];
};
User.prototype.getPlayerInfo = function() {
    var data = [this.user_id, this.location_type, this.room_number, this.game_id, this.rank, this.gp, this.gold, this.cash, this.gender, this.un_lock, this.head, this.body, this.eyes, this.flag, this.background, this.foreground, this.event1, this.event2, this.photo_url, this.guild, this.guild_job, this.name_changes, this.power_user, this.tournament, this.plus10gp, this.mobile_fox, this.country, this.flowers, this.relationship_status, this.relationship_with_id, this.relationship_with_rank, this.relationship_with_photo, this.relationship_with_name, this.relationship_with_gender];
    return data;
};
User.prototype.UpdateAvatars = function() {
    this.avatars = [
        this.head,
        this.body,
        this.eyes,
        this.flag,
        this.foreground,
        this.background
    ];
};
User.prototype.UpdateRoomNumber = function(id) {
    this.room_number = id;
};
module.exports = User;