create databse clone;
use clone;

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `avatars`
-- ----------------------------
DROP TABLE IF EXISTS `avatars`;
CREATE TABLE `avatars` (
  `head` int(11) DEFAULT NULL,
  `body` int(11) DEFAULT NULL,
  `eyes` int(11) DEFAULT NULL,
  `flag` int(11) DEFAULT NULL,
  `background` int(11) DEFAULT NULL,
  `foreground` int(11) DEFAULT NULL,
  `event1` int(11) DEFAULT NULL,
  `event2` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `avatars_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of avatars
-- ----------------------------
INSERT INTO `avatars` VALUES ('189', '2', '951', '0', '394', '886', '0', '0', '1');
INSERT INTO `avatars` VALUES ('1', '2', '0', '0', '0', '0', '0', '0', '2');

-- ----------------------------
-- Table structure for `guild_list`
-- ----------------------------
DROP TABLE IF EXISTS `guild_list`;
CREATE TABLE `guild_list` (
  `guild` varchar(20) DEFAULT NULL,
  `guild_job` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `guild_list_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of guild_list
-- ----------------------------
INSERT INTO `guild_list` VALUES ('GM', '1', '1');
INSERT INTO `guild_list` VALUES ('0', '0', '2');

-- ----------------------------
-- Table structure for `items_list`
-- ----------------------------
DROP TABLE IF EXISTS `items_list`;
CREATE TABLE `items_list` (
  `item_id` int(11) NOT NULL,
  `code` int(11) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of items_list
-- ----------------------------
INSERT INTO `items_list` VALUES ('1', '3289', 'm', 'h', 'Default');
INSERT INTO `items_list` VALUES ('189', '143', 'm', 'h', 'Love Cupid');
INSERT INTO `items_list` VALUES ('394', '4816', 'a', '1', '(RARE) Cash Charger ');
INSERT INTO `items_list` VALUES ('886', '3419', 'a', '2', 'zPaul');
INSERT INTO `items_list` VALUES ('951', '3481', 'a', 'e', 'Eyes of Love');

-- ----------------------------
-- Table structure for `player_items`
-- ----------------------------
DROP TABLE IF EXISTS `player_items`;
CREATE TABLE `player_items` (
  `used` int(11) DEFAULT NULL,
  `type_buy` varchar(20) DEFAULT NULL,
  `unk1` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`item_id`,`id`),
  KEY `R_12` (`item_id`),
  CONSTRAINT `player_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `player_items_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items_list` (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of player_items
-- ----------------------------
INSERT INTO `player_items` VALUES ('1', 'g', '2', '1', '189', '2');
INSERT INTO `player_items` VALUES ('1', 'g', '2', '1', '394', '5');
INSERT INTO `player_items` VALUES ('1', 'g', '2', '1', '886', '4');
INSERT INTO `player_items` VALUES ('1', 'g', '2', '1', '951', '3');

-- ----------------------------
-- Table structure for `relationship`
-- ----------------------------
DROP TABLE IF EXISTS `relationship`;
CREATE TABLE `relationship` (
  `relationship_status` int(11) DEFAULT NULL,
  `relationship_with_id` int(11) DEFAULT NULL,
  `relationship_with_rank` int(11) DEFAULT NULL,
  `relationship_with_photo` varchar(20) DEFAULT NULL,
  `relationship_with_name` varchar(20) DEFAULT NULL,
  `relationship_with_gender` varchar(20) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `relationship_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of relationship
-- ----------------------------
INSERT INTO `relationship` VALUES ('0', '0', '0', '0', '', '', '1');
INSERT INTO `relationship` VALUES ('0', '0', '0', '0', '', '', '2');

-- ----------------------------
-- Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `game_id` varchar(20) DEFAULT NULL,
  `room_number` int(11) DEFAULT NULL,
  `location_type` int(11) DEFAULT '1',
  `rank` int(11) DEFAULT NULL,
  `gp` int(11) DEFAULT NULL,
  `gold` int(11) DEFAULT NULL,
  `cash` int(11) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `un_lock` int(11) DEFAULT NULL,
  `photo_url` bigint(15) DEFAULT NULL,
  `name_changes` int(11) DEFAULT NULL,
  `power_user` int(11) DEFAULT NULL,
  `tournament` int(11) DEFAULT NULL,
  `plus10gp` int(11) DEFAULT NULL,
  `mobile_fox` int(11) DEFAULT NULL,
  `country` int(11) DEFAULT NULL,
  `flowers` int(11) DEFAULT NULL,
  `position` int(11) DEFAULT NULL,
  `mobile` int(11) DEFAULT NULL,
  `is_master` int(11) DEFAULT NULL,
  `is_ready` int(11) DEFAULT NULL,
  `is_bot` int(11) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'BetaX', '-1', '1', '24', '0', '0', '0', 'm', '1', '100000014337670', '1', '1', '0', '1', '1', '1', '0', '0', '0', '0', '0', '0');
INSERT INTO `users` VALUES ('2', 'MR Robot', '-1', '1', '0', '0', '0', '0', 'm', '1', '100007220893250', '1', '1', '0', '1', '1', '1', '0', '0', '0', '0', '0', '0');
