CREATE TABLE bmap_T_camera
(
	camId VARCHAR(32) NOT NULL,
	cname VARCHAR(128),
	ctype VARCHAR(8),
	memo VARCHAR(256),
	area VARCHAR(256),
	street VARCHAR(256),
	camNo VARCHAR(64),
	eff VARCHAR(4),
	crTime DATETIME,
	inTime DATETIME,
	moTime DATETIME,
	pid VARCHAR(32),
	PRIMARY KEY (camId)

) 
;


