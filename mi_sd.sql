/*
 Navicat Premium Data Transfer

 Source Server         : root
 Source Server Type    : MySQL
 Source Server Version : 50726
 Source Host           : localhost:3306
 Source Schema         : mi_sd

 Target Server Type    : MySQL
 Target Server Version : 50726
 File Encoding         : 65001

 Date: 26/06/2023 23:48:02
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for exchange
-- ----------------------------
DROP TABLE IF EXISTS `exchange`;
CREATE TABLE `exchange`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `from_amount` double(255, 5) NULL DEFAULT NULL,
  `from_coin` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `from_transaction_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `from_address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `to_amount` double(255, 5) NULL DEFAULT NULL,
  `to_coin` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `to_address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `to_transaction_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `timestamp` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `time` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `state` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of exchange
-- ----------------------------
INSERT INTO `exchange` VALUES (1, 2.00000, 'USDT', '3ec988328738ccc258c04ac25cfe6f4f75fd1e97e6665ac3a6c1ac4bc7be9414', 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE', 28.58845, 'TRX', 'TKKRxZW7nxSJhPJ9qWf6jCh1EpD5555555', '48f30a620ae942ecbc7a6ce98d092e916aa58603b6f41b7ae5b882c493a082ef', '1682782132', '2023-04-29 23:28:52', 1);
INSERT INTO `exchange` VALUES (2, 1.00000, 'USDT', '4d6c7bb9766f1bb064ade75a361b3828c79e0b4be58763095a1305b6aa062055', 'TUQADYW5QAYCRXbPLZWX6Jy7J6pRkk7V4D', 14.29635, 'TRX', 'TKKRxZW7nxSJhPJ9qWf6jCh1EpD5555555', '1ccb889a7e7e9e02902e1b1f876aaf7c70d55f6a32b20a950ddab569baf4fd48', '1682782588', '2023-04-29 23:36:28', 1);
INSERT INTO `exchange` VALUES (3, 1.00000, 'USDT', '8df1496d288db7541acdf12a23b230a839241cef9a3fa72fc86a5fb050de2974', 'TUQADYW5QAYCRXbPLZWX6Jy7J6pRkk7V4D', -8.00000, 'TRX', 'TKKRxZW7nxSJhPJ9qWf6jCh1EpD5555555', NULL, '1683015478', '2023-05-02 16:17:58', 0);
INSERT INTO `exchange` VALUES (4, 1.00000, 'USDT', '0a6c507eaff63d8f44cdfb87d2bd29a7f68ca4c493118d22362d03abfa548191', 'TPQvEwcpvp8K5g9T83mGxti3QvG1KFGo4o', 6.68003, 'TRX', 'TVJQA52awtTjzcD3C9FViLHP9H77777777', '0d2b01bae4acb8f7580ab646a36e204ea7e8b47bb0a41bfd1612baa3cd281c7c', '1685631444', '2023-06-01 22:57:24', 1);
INSERT INTO `exchange` VALUES (5, 1.00000, 'USDT', 'bf525cdea906bc3f0e5e292cf8b843c48c0235bdfcc83cf76f0351db1ee2c267', 'TPQvEwcpvp8K5g9T83mGxti3QvG1KFGo4o', 6.68449, 'TRX', 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 'ca5e8d841f8a6a7f50bbf493cd2b34522ad6d2e0ec1b456a1e7d4f5f95c0820d', '1685631948', '2023-06-01 23:05:48', 1);


-- ----------------------------
-- Table structure for trxexchange
-- ----------------------------
DROP TABLE IF EXISTS `trxexchange`;
CREATE TABLE `trxexchange`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `from_amount` double(255, 5) NULL DEFAULT NULL,
  `from_coin` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `from_transaction_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `from_address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `to_amount` double(255, 5) NULL DEFAULT NULL,
  `to_coin` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `to_address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `to_transaction_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `timestamp` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `time` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `state` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 60 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;






-- ----------------------------
-- Table structure for transfer
-- ----------------------------
DROP TABLE IF EXISTS `transfer`;
CREATE TABLE `transfer`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `fromaddress` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `toaddress` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `amount` double(100, 10) NULL DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `hashid` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `coin` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `time` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 23 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of transfer
-- ----------------------------
INSERT INTO `transfer` VALUES (1, 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 'TG5eR1TorY9oHiRf2cAGaZqWJA88888888', 'TUQADYW5QAYCRXbPLZWX6Jy7J6pRkk7V4D', 4.8400000000, 'to', '97cab5f99452db4c495e4db47ce0713ae38ac847456d391950fc6ac77abb7b49', 'usdt', '2023-06-01 23:09:35');
INSERT INTO `transfer` VALUES (2, 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 'TNL9box5dukGtpjzVdQNi4vsGoRU5LAHfb', 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 30.0000000000, 'to', '4ef2c0a0b7a0b74059964d649e4121334d4d7f4dcce08bca57fb52dedcab693d', 'usdt', '2023-06-15 23:56:48');
INSERT INTO `transfer` VALUES (3, 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 'TKYp9dbDs6kHKtFhFR6srEJvDARNYkq9Qe', 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 25.8700000000, 'to', 'f47b357e1d9f0aa5b98631b1c138aec6d1fd8f4810b4bc0324816ac5483d072b', 'usdt', '2023-06-15 23:56:48');
INSERT INTO `transfer` VALUES (4, 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 'TWjsi6qHzwMcyw9cPtwyWA6rCLwavZ638r', 37.0000000000, 'to', '56c95323ca6091670061589083dc43a00c726d98af254966c707ab68ed2e63dc', 'usdt', '2023-06-15 23:56:53');
INSERT INTO `transfer` VALUES (5, 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 'TWjsi6qHzwMcyw9cPtwyWA6rCLwavZ638r', 37.0000000000, 'to', '56c95323ca6091670061589083dc43a00c726d98af254966c707ab68ed2e63dc', 'usdt', '2023-06-15 23:56:56');
INSERT INTO `transfer` VALUES (6, 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 'TKYp9dbDs6kHKtFhFR6srEJvDARNYkq9Qe', 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 25.8700000000, 'to', 'f47b357e1d9f0aa5b98631b1c138aec6d1fd8f4810b4bc0324816ac5483d072b', 'usdt', '2023-06-15 23:56:57');
INSERT INTO `transfer` VALUES (7, 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 'TWjsi6qHzwMcyw9cPtwyWA6rCLwavZ638r', 37.0000000000, 'from', '56c95323ca6091670061589083dc43a00c726d98af254966c707ab68ed2e63dc', 'usdt', '2023-06-15 23:57:06');
INSERT INTO `transfer` VALUES (8, 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 'TLCRJqvYfmER3wPSt1Kpv2QGiDPG4thZSg', 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 5.0000000000, 'to', '2011242f4443852dffea51c3698e2af74de46d73acebc6fc66ca52469a70afb3', 'usdt', '2023-06-20 22:59:42');
INSERT INTO `transfer` VALUES (9, 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 'TFYcgxpMbqf9XuU5jYA7Y6S76wM2imykor', 35.0000000000, 'to', 'e3653452109b0191c96e00b395c8af0a935ac52de1b76e2a0e333dfdb85085e8', 'usdt', '2023-06-20 22:59:42');
INSERT INTO `transfer` VALUES (10, 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 'TWGZbjofbTLY3UCjCV4yiLkRg89zLqwRgi', 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 6.0000000000, 'to', '7e2b39b7a14534a5bc7e8f28c21b013c06d16326ef2caa2c6f7d23313cb33bc9', 'usdt', '2023-06-20 22:59:42');
INSERT INTO `transfer` VALUES (11, 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 'TBwVJbDNnjAg8ZqKNYdva8iJWLAFfnoLgh', 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 25.4100000000, 'to', '5ca96a0e395c70bb537ccfe7f9baf98133c7665a45227f6f792da75419737741', 'usdt', '2023-06-20 22:59:42');
INSERT INTO `transfer` VALUES (12, 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 'TTTTTXkPHsJfh8tYhD4jK5oK3JpNyqM19z', 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 5.0000000000, 'to', 'abc3b203bc4a8bd008398a57484fc7b7d99d754bf921b3601e16770dd0cddefd', 'usdt', '2023-06-20 22:59:42');
INSERT INTO `transfer` VALUES (13, 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 'TFYcgxpMbqf9XuU5jYA7Y6S76wM2imykor', 35.0000000000, 'from', 'e3653452109b0191c96e00b395c8af0a935ac52de1b76e2a0e333dfdb85085e8', 'usdt', '2023-06-20 22:59:51');
INSERT INTO `transfer` VALUES (14, 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 'TTTTTXkPHsJfh8tYhD4jK5oK3JpNyqM19z', 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 5.0000000000, 'from', 'abc3b203bc4a8bd008398a57484fc7b7d99d754bf921b3601e16770dd0cddefd', 'usdt', '2023-06-20 22:59:51');
INSERT INTO `transfer` VALUES (15, 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 'TLCRJqvYfmER3wPSt1Kpv2QGiDPG4thZSg', 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 5.0000000000, 'from', '2011242f4443852dffea51c3698e2af74de46d73acebc6fc66ca52469a70afb3', 'usdt', '2023-06-20 22:59:51');
INSERT INTO `transfer` VALUES (16, 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 'TWGZbjofbTLY3UCjCV4yiLkRg89zLqwRgi', 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 6.0000000000, 'from', '7e2b39b7a14534a5bc7e8f28c21b013c06d16326ef2caa2c6f7d23313cb33bc9', 'usdt', '2023-06-20 22:59:51');
INSERT INTO `transfer` VALUES (17, 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 'TLCRJqvYfmER3wPSt1Kpv2QGiDPG4thZSg', 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 5.0000000000, 'to', '2011242f4443852dffea51c3698e2af74de46d73acebc6fc66ca52469a70afb3', 'usdt', '2023-06-20 23:00:01');
INSERT INTO `transfer` VALUES (18, 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 'TTTTTXkPHsJfh8tYhD4jK5oK3JpNyqM19z', 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 5.0000000000, 'to', 'abc3b203bc4a8bd008398a57484fc7b7d99d754bf921b3601e16770dd0cddefd', 'usdt', '2023-06-20 23:00:01');
INSERT INTO `transfer` VALUES (19, 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 'TWGZbjofbTLY3UCjCV4yiLkRg89zLqwRgi', 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 6.0000000000, 'to', '7e2b39b7a14534a5bc7e8f28c21b013c06d16326ef2caa2c6f7d23313cb33bc9', 'usdt', '2023-06-20 23:00:01');
INSERT INTO `transfer` VALUES (20, 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 'TTTTTXkPHsJfh8tYhD4jK5oK3JpNyqM19z', 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 5.0000000000, 'to', 'abc3b203bc4a8bd008398a57484fc7b7d99d754bf921b3601e16770dd0cddefd', 'usdt', '2023-06-20 23:00:11');
INSERT INTO `transfer` VALUES (21, 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 'TWGZbjofbTLY3UCjCV4yiLkRg89zLqwRgi', 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 6.0000000000, 'to', '7e2b39b7a14534a5bc7e8f28c21b013c06d16326ef2caa2c6f7d23313cb33bc9', 'usdt', '2023-06-20 23:00:11');
INSERT INTO `transfer` VALUES (22, 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 'TWGZbjofbTLY3UCjCV4yiLkRg89zLqwRgi', 'TVJQA52awtTjzcD3C9FViLHP9H77777777', 6.0000000000, 'to', '7e2b39b7a14534a5bc7e8f28c21b013c06d16326ef2caa2c6f7d23313cb33bc9', 'usdt', '2023-06-20 23:00:21');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `nickname` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `telegramid` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `register_time` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `inviter_telegramid` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `trxaddress` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '未绑定地址',
  `balance` double(10, 2) NULL DEFAULT 0.00,
  `energy` int(11) NULL DEFAULT 0,
  `zongliushui` double(10, 2) NULL DEFAULT 0.00,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 41 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------

-- ----------------------------
-- Table structure for yuzhi
-- ----------------------------
DROP TABLE IF EXISTS `yuzhi`;
CREATE TABLE `yuzhi`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `telegramid` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `amount` double(10, 2) NULL DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `time` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of yuzhi
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
