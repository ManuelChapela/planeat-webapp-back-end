CREATE DATABASE retoTrip;
USE retoTrip;

DROP TABLE `Users`;
CREATE TABLE `Users` (
  id int NOT NULL AUTO_INCREMENT,
  secret varchar(10) NOT NULL,
  email varchar(100) UNIQUE NOT NULL,
  pass varchar(64) NOT NULL,
  userName varchar(50),
  boolFavCalendar boolean,
  photo varchar(100),
  name varchar(100),
  PRIMARY KEY (`id`)
);

DROP TABLE `Favs`;
CREATE TABLE `Favs` (
	id INT NOT NULL AUTO_INCREMENT,
    idUser INT,
    idRecipe INT,
    PRIMARY KEY (id),
    FOREIGN KEY (idUser) REFERENCES Users(id),
    FOREIGN KEY (idRecipe) REFERENCES Recipes(id)
);

DROP TABLE `NoFavs`;
CREATE TABLE `NoFavs` (
	id INT NOT NULL AUTO_INCREMENT,
    idUser INT,
    idRecipe INT,
    PRIMARY KEY (id),
    FOREIGN KEY (idUser) REFERENCES Users(id),
    FOREIGN KEY (idRecipe) REFERENCES Recipes(id)
);


DROP TABLE Recipes;
CREATE TABLE Recipes (
	id INT NOT NULL AUTO_INCREMENT,
    idUser INT,
    PRIMARY KEY (id),
	FOREIGN KEY (idUser) REFERENCES Users(id)
);