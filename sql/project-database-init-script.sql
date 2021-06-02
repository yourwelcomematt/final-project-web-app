/*
 * Upon submission, this file should contain the SQL script to initialize your database.
 * It should contain all DROP TABLE and CREATE TABLE statments, and any INSERT statements
 * required...
 */

DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS users;


CREATE TABLE users (
    id INTEGER NOT NULL PRIMARY KEY,
    fname VARCHAR(50),
    lname VARCHAR(50),
    username VARCHAR(20),
    dob DATE,
    password VARCHAR(50),
    description VARCHAR(300),
    imageSource VARCHAR(100),
    authToken VARCHAR(128),
    admin BIT
);

-- for the admin column, the bit datatype will store 1 for true and 0 for false (no Boolean data type)

CREATE TABLE articles (
    id INTEGER NOT NULL PRIMARY KEY,
    title VARCHAR(100),
    postTime TIMESTAMP,
    content VARCHAR(8000),
    imageSource VARCHAR(100),
    userID INTEGER, 
    username VARCHAR(20), 
    FOREIGN KEY (userID) REFERENCES users(id)
);

CREATE TABLE comments (
    id INTEGER NOT NULL PRIMARY KEY,
    postTime TIMESTAMP,
    content VARCHAR(300),
    upvotes INTEGER,
    downvotes INTEGER,
    parentCommentID INTEGER,
    commenterID INTEGER,
    articleID INTEGER,
    FOREIGN KEY (commenterID) REFERENCES users(id),
    FOREIGN KEY (articleID) REFERENCES articles(id),
    FOREIGN KEY (parentCommentID) REFERENCES comments(id)
);

CREATE TABLE votes (
    voterID INTEGER NOT NULL, 
    commentID INTEGER NOT NULL,
    PRIMARY KEY (voterID, commentID),
    FOREIGN KEY (voterID) REFERENCES users(id),
    FOREIGN KEY (commentID) REFERENCES comments(id)

);

INSERT INTO users VALUES (1, 'Hollie', 'White', 'hols', '1996-06-17', '$2b$10$sxioZDL6KnmOZ1XN3BtPputkHrHk7pcrJUsL1HFGV4SneY7akhWMm', 'This is my description yayaya!', 'dragon-icon.png', 'null', 1);
INSERT INTO users VALUES (2,'Matthew', 'Ding', 'matt', '1993-01-11', '$2b$10$s9fGaUDYtlvsTU71RrRUtOP7ZOx1ZQuHqIZeKvYVG/BLBRNjzW1s2', 'Lorem Ipsum or something', 'sloth-icon.png', 'null', 1);
INSERT INTO users VALUES (3,'Declan', 'Williams', 'declan', '2000-03-23', '$2b$10$eMczFg51lxdIWNAJi8lrTODDXRwkWbWsQlKX06swXqf/bUGBqCI/6', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed semper ex eget dui rhoncus congue. Integer eget nisl laoreet nisl eleifend elementum.', 'dino-icon.png', 'null', 1);
INSERT INTO users VALUES (4,'Rachel', 'Yang', 'rachel', '2001-05-11', '$2b$10$B/CLSlIxyxySDeawZnl5ROwAxrIftLRTGqxgjukFkCpa8kGS.UYlW', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed semper ex eget dui rhoncus congue. Integer eget nisl laoreet nisl eleifend elementum.', 'bear-icon.png', 'null', 0);

INSERT INTO articles VALUES (1, 'Fake Title 1', '2021-01-19 03:14:07','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed semper ex eget dui rhoncus congue. Integer eget nisl laoreet nisl eleifend elementum. Nulla facilisis quis felis eget efficitur. Sed vel fringilla elit. Mauris et purus sem. Praesent nec magna lorem. Quisque condimentum scelerisque luctus. Nam finibus nisl sed purus porta, lobortis pretium neque vestibulum. In hac habitasse platea dictumst. Cras feugiat tristique massa a eleifend.', 'Dragonite.png', 1, 'hols');

INSERT INTO articles VALUES (2, 'Fake Title 2', '2021-04-24 04:20:00','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed semper ex eget dui rhoncus congue. Integer eget nisl laoreet nisl eleifend elementum. Nulla facilisis quis felis eget efficitur. Sed vel fringilla elit. Mauris et purus sem. Praesent nec magna lorem. Quisque condimentum scelerisque luctus. Nam finibus nisl sed purus porta, lobortis pretium neque vestibulum. In hac habitasse platea dictumst. Cras feugiat tristique massa a eleifend.', 'Dragonite.png', 2, 'matt');

INSERT INTO articles VALUES (3, 'Fake Title 3', '2021-04-20 11:01:07','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed semper ex eget dui rhoncus congue. Integer eget nisl laoreet nisl eleifend elementum. Nulla facilisis quis felis eget efficitur. Sed vel fringilla elit. Mauris et purus sem. Praesent nec magna lorem. Quisque condimentum scelerisque luctus. Nam finibus nisl sed purus porta, lobortis pretium neque vestibulum. In hac habitasse platea dictumst. Cras feugiat tristique massa a eleifend.', 'Dragonite.png', 3, 'declan');

INSERT INTO articles VALUES (4, 'Fake Title 4', '2021-03-19 03:16:08','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed semper ex eget dui rhoncus congue. Integer eget nisl laoreet nisl eleifend elementum. Nulla facilisis quis felis eget efficitur. Sed vel fringilla elit. Mauris et purus sem. Praesent nec magna lorem. Quisque condimentum scelerisque luctus. Nam finibus nisl sed purus porta, lobortis pretium neque vestibulum. In hac habitasse platea dictumst. Cras feugiat tristique massa a eleifend.', 'Dragonite.png', 4, 'rachel');

INSERT INTO articles VALUES (5, 'Fake Title 5', '2021-06-20 02:16:07','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed semper ex eget dui rhoncus congue. Integer eget nisl laoreet nisl eleifend elementum. Nulla facilisis quis felis eget efficitur. Sed vel fringilla elit. Mauris et purus sem. Praesent nec magna lorem. Quisque condimentum scelerisque luctus. Nam finibus nisl sed purus porta, lobortis pretium neque vestibulum. In hac habitasse platea dictumst. Cras feugiat tristique massa a eleifend.', 'Dragonite.png', 1, 'hols');

INSERT INTO comments VALUES (1, '2021-04-20 11:01:07', 'This article is so good OMG', 1, 0, NULL, 2, 1);
INSERT INTO comments VALUES (2, '2021-03-10 05:00:07', 'This article is so bad OMG', 0, 1, 1, 3, 1);
INSERT INTO comments VALUES (3, '2021-01-12 06:05:00', 'This article is average', 2, 0, NULL, 1, 3);
INSERT INTO comments VALUES (4, '2021-02-16 04:20:07', 'Good job lol', 0, 0, NULL, 1, 2);
INSERT INTO comments VALUES (5, '2021-01-14 08:40:06', 'LOLOLOLOL', 3, 0, 2, 1, 1);
INSERT INTO comments VALUES (6, '2021-03-11 08:15:06', 'ROFL', 1, 1, NULL, 4, 4);
INSERT INTO comments VALUES (7, '2021-06-14 09:40:06', 'OMGWTFBBQ', 0, 2, 6, 2, 4);

INSERT INTO votes VALUES (1, 1);
INSERT INTO votes VALUES (2, 2);
INSERT INTO votes VALUES (3, 3);
INSERT INTO votes VALUES (2, 3);
INSERT INTO votes VALUES (1, 5);
INSERT INTO votes VALUES (2, 5);
INSERT INTO votes VALUES (3, 5);
INSERT INTO votes VALUES (2, 6);
INSERT INTO votes VALUES (4, 6);
INSERT INTO votes VALUES (3, 7);
INSERT INTO votes VALUES (2, 7);