CREATE DATABASE db_webShop;
USE db_webShop;

CREATE TABLE t_users(
   users_id INT AUTO_INCREMENT,
   username VARCHAR(50) NOT NULL,
   password VARCHAR(64) NOT NULL,
   salt VARCHAR(16) NOT NULL,
   admin BOOLEAN NOT NULL,
   PRIMARY KEY(users_id),
   UNIQUE(username)
);
