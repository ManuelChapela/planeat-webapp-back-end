CREATE DATABASE retoTrip;
USE retoTrip;

DROP TABLE `Users`;
CREATE TABLE `Users` (
  id int NOT NULL AUTO_INCREMENT,
  secret varchar(10) NOT NULL,
  email varchar(100) UNIQUE NOT NULL,
  pass varchar(64) NOT NULL,
  userName varchar(50),
  boolFavCalendar TINYINT(1), /*ANTES ESTABA COMO BOOL y funcionaba... ver si sigue funcionando con este cambio*/
  photo varchar(100),
  name varchar(100),
  PRIMARY KEY (`id`)
);

DROP TABLE `Favs`;
CREATE TABLE `Favs` (
	id INT AUTO_INCREMENT NOT NULL,
    idUser INT,
    idRecipe INT,
    PRIMARY KEY (id),
    FOREIGN KEY (idUser) REFERENCES Users(id),
    FOREIGN KEY (idRecipe) REFERENCES Recipes(id),
    CONSTRAINT product_store_unique UNIQUE (idUser, idRecipe)
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
    title VARCHAR(255),
    PRIMARY KEY (id),
	FOREIGN KEY (idUser) REFERENCES Users(id)
);

DROP TABLE Ingredients;
CREATE TABLE Ingredients (
	id INT NOT NULL AUTO_INCREMENT,
	title VARCHAR(100),
    PRIMARY KEY (id)
);