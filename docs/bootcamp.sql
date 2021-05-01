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


INSERT INTO Users (secret, email, pass, userName, boolFavCalendar, photo, name) VALUES ('Pkd0Dl5uzW', 'c@aa.es', 'cf0fc5378a8315c66fc5426b03a1cf3112fb705e53483e0be1ec5da45c5a5f3e', 'Roberto', false, 'http://kk.es', 'Roberto');
SELECT * FROM Users;
UPDATE Users
SET 
	secret="Pkd0Dl5uzW",
    email="c@aa.es",
    pass="cf0fc5378a8315c66fc5426b03a1cf3112fb705e53483e0be1ec5da45c5a5f3e",
    userName="Roberto",
    boolFavCalendar=false,
    photo="http://kk.es",
    name="Roberto Villares"
WHERE id=1;


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

DROP TABLE BannedCategories;
CREATE TABLE BannedCategories (
	id INT NOT NULL AUTO_INCREMENT,
    idCategory INT NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE UserBannedCategories;
CREATE TABLE UserBannedCategories (
	id INT NOT NULL AUTO_INCREMENT,
    idCategory INT NOT NULL,
    idUser INT NOT NULL,
    PRIMARY KEY (id),
	FOREIGN KEY (idUser) REFERENCES Users(id),
    FOREIGN KEY (idCategory) REFERENCES BannedCategories(id)
);


DROP TABLE UserBannedIngredients;
CREATE TABLE UserBannedIngredients (
	id INT NOT NULL AUTO_INCREMENT,
    idIngredient INT NOT NULL,
    idUser INT NOT NULL,
    PRIMARY KEY (id),
	FOREIGN KEY (idUser) REFERENCES Users(id),
    FOREIGN KEY (idIngredient) REFERENCES Ingredients(id)
);

SELECT * FROM BannedCategories;
INSERT INTO BannedCategories (idCategory, category, title)
	VALUES
		(1, "meat", "Carne"),
        (2, "fish", "Pescado"),
        (3, "shellfish", "Marisco"),
        (4, "vegetable", "Verduras"),
        (5, "dairyProducts", "Lacteos"),
        (6, "eggs", "Huevos"),
        (7, "pulses", "Legumbres"),
        (8, "pasta", "Pasta");

        


DROP TABLE Recipes;
CREATE TABLE Recipes (
	id INT NOT NULL AUTO_INCREMENT,
    idUser INT,
    PRIMARY KEY (id),
	FOREIGN KEY (idUser) REFERENCES Users(id)
);


DROP TABLE Ingredients;
CREATE TABLE Ingredients (
	id INT NOT NULL AUTO_INCREMENT,
	title VARCHAR(100),
    PRIMARY KEY (id)
);