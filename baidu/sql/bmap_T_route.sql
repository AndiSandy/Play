CREATE TABLE bmap_T_route
(
	roId VARCHAR(32) NOT NULL,
	roName VARCHAR(128),
	roType VARCHAR(8),
	memo VARCHAR(256),
	eff VARCHAR(4),
	crTime DATETIME,
	moTime DATETIME,
	PRIMARY KEY (roId)

) 
;


