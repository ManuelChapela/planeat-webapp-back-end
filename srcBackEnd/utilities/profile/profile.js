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
    console.log('AÑADIENDO FAVORITO');
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

exports.addNoFav = async (idUser, idRecipe, res) => {
  const sql = 'INSERT INTO NoFavs (idUser, idRecipe) VALUES (?)';
  const values = [[idUser, idRecipe]];
  try {
    const results = await doQuery(sql, values);
    console.log('AÑADIDAS:', results);
    res.status(200).send({
      OK: 1,
      message: `Se ha añadido receta vetada.`,
      idRecipe: idRecipe,
    });
  } catch (error) {
    console.log(error);
    if (error.errno === 1062) {
      res.status(404).send({
        OK: 0,
        message: `No se ha podido añadir favorito: La receta vetada está duplicado.`,
      });
    } else if (error.errno === 1452) {
      res.status(409).send({
        OK: 0,
        message: `No se ha podido añadir receta vetada: El usuario o la receta no existen.`,
      });
    } else {
      res.status(500).send({
        OK: 0,
        message: `No se ha podido añadir receta vetada: ${error.message}`,
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

exports.delNoFav = async (idUser, idRecipe, res) => {
  const sql = 'DELETE FROM NoFavs WHERE idUser = ? AND idRecipe = ?';
  const values = [idUser, idRecipe];
  try {
    const results = await doQuery(sql, values);
    console.log('ELIMINADAS:', results.affectedRows);
    if (results.affectedRows !== 0) {
      res.status(200).send({
        OK: 1,
        message: `Se ha eliminado la receta vetada.`,
        idRecipe: idRecipe,
        //idFav: results.insertId,
      });
    } else {
      res.status(404).send({
        OK: 0,
        message: `No se ha podido borrar la receta vetada ${idRecipe} del usuario ${idUser}`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      OK: 0,
      message: `No se ha podido borrar la receta vetada: ${error.message}`,
    });
  }
};

exports.getFavs = async (idUser, res) => {
  const sql = `SELECT  tp.IdReceta AS id, tp.Nombre AS title, tt.Tiempo AS time, 
                tp.Imagen as img, GROUP_CONCAT(DISTINCT tpr.IdPreferencias) AS preferencias
                FROM TablaPrincipal AS tp
                JOIN TablaRecetaIngredientes AS tri
                  ON tp.IdReceta = tri.IdReceta
                JOIN TablaIngredientes AS ti
                  ON tri.IdIngrediente = ti.IdIngrediente
                JOIN Favs
                  ON Favs.idRecipe = tp.IdReceta
                JOIN TablaPreferenciasReceta AS tpr
                  ON tp.IdReceta = tpr.IdReceta
                JOIN TablaTiempo as tt
                  ON tt.IdTiempo = tp.IdTiempo
                WHERE Favs.idUser=?
                GROUP by tp.IdReceta`;

  try {
    const results = await doQuery(sql, idUser);
    console.log(results);

    const favs = results.length
      ? results.map((el) => {
          const fav = {};

          fav.img = el.img;
          fav.title = el.title;
          fav.id = el.id;
          fav.time = el.time;
          /* 
          el.prize =
            el.preferences &&
            el.preferences.filter((pref) => (pref = 31)).length &&
            'Barato';
          el.prize =
            el.preferences &&
            el.preferences.filter((pref) => (pref = 111)).length &&
            'Medio';
 */

          if (el.preferencias) {
            const arrayPreferencias = el.preferencias.split(',');
            if (arrayPreferencias.includes("31")) fav.prize = 'Barato';
            else if (arrayPreferencias.includes("111")) fav.prize = 'Medio';
          }

          fav.logged=true;

          return fav;
        })
      : [];

    res.status(200).send({
      OK: 1,
      message: `Obtenidos favoritos del usuario ${idUser}`,
      Favs: favs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      OK: 0,
      message: `No se han podido obtener Favoritos: ${error.message}`,
    });
  }
};

exports.getNoFavs = async (idUser, res) => {
  const sql = `SELECT * FROM TablaPrincipal as tp INNER JOIN NoFavs ON tp.IdReceta = NoFavs.idRecipe WHERE NoFavs.idUser=?`;

  try {
    const results = await doQuery(sql, idUser);
    console.log(results);
    res.status(200).send({
      OK: 1,
      message: `Obtenidos recetas vetadas del usuario ${idUser}`,
      Favs: results,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      OK: 0,
      message: `No se han podido obtener recetas vetadas: ${error.message}`,
    });
  }
};

exports.getFavsMiddle = async (req, res, next) => {
  const sqlFav = `SELECT * FROM TablaPrincipal as tp INNER JOIN Favs ON tp.IdReceta = Favs.idRecipe WHERE Favs.idUser=?`;
  const sqlNoFav = `SELECT * FROM TablaPrincipal as tp INNER JOIN NoFavs ON tp.IdReceta = NoFavs.idRecipe WHERE NoFavs.idUser=?`;

  idUser = res.user;
  if (idUser) {
    try {
      const resultsFav = await doQuery(sqlFav, idUser);
      res.favs = resultsFav;
      const resultsNoFav = await doQuery(sqlNoFav, idUser);
      res.noFavs = resultsNoFav;
      next();
    } catch (error) {
      console.log(error);
    }
  } else {
    console.error('NO HAY USUARIO');
    res.favs = [];
    res.noFavs = [];
    next();
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
