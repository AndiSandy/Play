CREATE TABLE `suning_yun_diamond_game_play_records` (
`rid` int NOT NULL AUTO_INCREMENT COMMENT '记录id',
`gameid` varchar(255) NULL COMMENT '活动配置id',
`playid` varchar(255) NULL,
`dinput` int NULL COMMENT '云钻输入数量',
`doutput` int NULL COMMENT '云钻输出数量',
`dresult` int NULL COMMENT 'doutput-dinput',
`rindex` int NULL COMMENT '结果索引',
`rcode` varchar(255) NULL COMMENT '结果编码',
`p` float NULL COMMENT '倍数',
`playtime` datetime NULL COMMENT '游戏时间',
`crtime` datetime NULL COMMENT '记录时间',
PRIMARY KEY (`rid`) 
);

