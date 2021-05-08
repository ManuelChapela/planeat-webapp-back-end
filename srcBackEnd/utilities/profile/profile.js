const { doQuery } = require('../doQuery.js');

//FUNCIONES PARA EL MANEJO DE LA PERSONALIZACIÓN DE PERFIL

exports.saveBannedCategories = async (bannedObj, idUser) => {
  const values = [];

  bannedObj
    .filter((el) => el.value)
    .map((el) => {
      values.push([el.id, idUser]);
    });

  const sql = 'INSERT INTO UserBannedCategories (idCategory, idUser) VALUES ? ';

  try {
    if (values.length !== 0) {
      const results = await doQuery(sql, [values]);
      console.log('AÑADIDAS:', results.affectedRows);
      return results.affectedRows;
    } else {
      console.log('AÑADIDAS:', 0);
      return 0;
    }
  } catch (error) {
    console.log(error);
  }
};

exports.delBannedCategories = async (idUser) => {
  const sql = 'DELETE FROM UserBannedCategories WHERE idUser = ?';
  const values = [idUser];

  try {
    const results = await doQuery(sql, values);
    console.log('BORRADAS:', results.affectedRows);
    return results.affectedRows;
  } catch (error) {
    console.log(error);
  }
};

exports.getBannedCategories = async (idUser) => {
  const sql = 'SELECT * FROM UserBannedCategories WHERE idUser = ?';
  const values = [idUser];

  try {
    const results = await doQuery(sql, values);
    console.log('SELECT:', results);
    return results;
  } catch (error) {
    console.log(error);
  }
};

exports.getBannedIngredients = async (idUser) => {
  const sql =
    'SELECT * FROM UserBannedIngredients as U, TablaIngredientes as I WHERE U.idUser = ? AND I.idIngrediente = U.idIngredient';
  const values = [idUser];

  try {
    const results = await doQuery(sql, values);
    console.log('SELECT:', results);
    return results;
  } catch (error) {
    console.log(error);
  }
};

exports.addFav = async (idUser, idRecipe, res) => {
  const sql = 'INSERT INTO Favs (idUser, idRecipe) VALUES (?)';
  const values = [[idUser, idRecipe]];
  try {
    const results = await doQuery(sql, values);
    console.log('AÑADIDAS:', results);
    res.status(200).send({
      OK: 1,
      message: `Se ha añadido el favorito.`,
      idRecipe: idRecipe,
    });
  } catch (error) {
    console.log(error);
    if (error.errno === 1062) {
      res.status(404).send({
        OK: 0,
        message: `No se ha podido añadir favorito: El favorito está duplicado.`,
      });
    } else if (error.errno === 1452) {
      res.status(409).send({
        OK: 0,
        message: `No se ha podido añadir favorito: El usuario o la receta no existen.`,
      });
    } else {
      res.status(500).send({
        OK: 0,
        message: `No se ha podido añadir favorito: ${error.message}`,
      });
    }
  }
};

exports.delFav = async (idUser, idRecipe, res) => {
  const sql = 'DELETE FROM Favs WHERE idUser = ? AND idRecipe = ?';
  const values = [idUser, idRecipe];
  try {
    const results = await doQuery(sql, values);
    console.log('ELIMINADAS:', results.affectedRows);
    if (results.affectedRows !== 0) {
      res.status(200).send({
        OK: 1,
        message: `Se ha eliminado el favorito.`,
        idRecipe: idRecipe,
        //idFav: results.insertId,
      });
    } else {
      res.status(404).send({
        OK: 0,
        message: `No se ha podido borrar el favorito ${idRecipe} del usuario ${idUser}`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      OK: 0,
      message: `No se ha podido borrar favorito: ${error.message}`,
    });
  }
};

exports.getFavs = async (idUser, res) => {
  const sql = `SELECT * FROM Recipes INNER JOIN Favs ON Recipes.id = Favs.idUser WHERE Favs.idUser=?`;

  try {
    const results = await doQuery(sql, idUser);
    console.log(results);
    res.status(200).send({
      OK: 1,
      message: `Obtenidos favoritos del usuario ${idUser}`,
      Favs: results,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      OK: 0,
      message: `No se han podido obtener Favoritos: ${error.message}`,
    });
  }
};

exports.delBannedIngredients = async (idUser) => {
  const sql = 'DELETE FROM UserBannedIngredients WHERE idUser = ?';
  const values = [idUser];

  try {
    const results = await doQuery(sql, values);
    console.log('BORRADOS:', results.affectedRows);
    return results.affectedRows;
  } catch (error) {
    console.log(error);
  }
};

exports.saveBannedIngredients = async (bannedIngredients, idUser) => {
  const values = [];
  console.log('BANNED', bannedIngredients);
  bannedIngredients.map((el) => {
    values.push([el.idIngredient, idUser]);
  });

  const sql =
    'INSERT INTO UserBannedIngredients (idIngredient, idUser) VALUES ? ';

  try {
    if (values.length !== 0) {
      const results = await doQuery(sql, [values]);
      console.log('AÑADIDAS:', results.affectedRows);
      return results.affectedRows;
    } else {
      console.log('AÑADIDAS:', 0);
      return 0;
    }
  } catch (error) {
    console.log(error);
  }
};
