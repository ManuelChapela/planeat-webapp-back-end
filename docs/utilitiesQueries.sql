USE retoTrip;
INSERT INTO Users (secret, email, pass, userName, photo, name) VALUES ('Pkd0Dl5uzW', 'c@aa.es', 'cf0fc5378a8315c66fc5426b03a1cf3112fb705e53483e0be1ec5da45c5a5f3e', 'Roberto', false, 'http://kk.es', 'Roberto');
INSERT INTO Recipes (idUser, title) VALUES (1, "HOLA HOLA");


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


SELECT * FROM BannedCategories;
SELECT * FROM Favs;

SELECT idRecipe FROM Favs WHERE idUser = 2;

SELECT *
FROM Recipes
INNER JOIN Favs ON Recipes.id = Favs.idUser
WHERE Favs.idUser=?;

