const { doQuery } = require('../utilities/doQuery');
const SHA256 = require('crypto-js/sha256');
const {
  saveBannedCategories,
  delBannedCategories,
  saveBannedIngredients,
  delBannedIngredients,
  addFav,
  delFav,
  getFavs,
  addNoFav,
  delNoFav,
  getNoFavs,
} = require('../utilities/profile/profile');

exports.getUser = async (req, res) => {
  const user = res.user.idUser;

  try {
    let sql =
      'SELECT name, email, userName, photo, boolFavCalendar FROM Users  WHERE id = "?"';

    const results = await doQuery(sql, user);
    if (results.length !== 0) {
      const profile = {
        email: results[0].email || '',
        pass: results[0].pass || '',
        userName: results[0].userName || '',
        boolFavCalendar: results[0].boolFavCalendar || '',
        photo: results[0].photo || '',
        name: results[0].name || '',
      };

      res.send({
        OK: 1,
        message: 'Perfil de usuario',
        profile: profile,
      });
    } else throw Error('No existe el usuario');
  } catch (error) {
    res.status(500).send({
      OK: 0,
      message: `Error al recibir perfil de usuario: ${error}`,
    });
  }
};

exports.updateUser = async (req, res) => {
  const { email, pass, userName, boolFavCalendar, photo, name } = req.body;
  const idUser = res.user.idUser;
  try {
    let sql = `UPDATE Users SET `;

    const sqlSet = [];
    const sqlValues = [];

    if (email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        throw 'Email no válido, prueba otra vez';
      sqlSet.push(' email = ? ');
      sqlValues.push(email);
    }

    if (pass) {
      if (pass.length < 8) throw 'Contraseña no válida ';
      sqlSet.push(' pass = ? ');
      sqlValues.push(SHA256(pass).toString());
    }

    if (userName) {
      sqlSet.push(' userName = ? ');
      sqlValues.push(userName);
    }

    if (boolFavCalendar) {
      sqlSet.push(' boolFavCalendar = ?');
      sqlValues.push(boolFavCalendar);
    }

    if (photo) {
      sqlSet.push(' photo = ? ');
      sqlValues.push(photo);
    }

    if (name) {
      sqlSet.push(' name = ? ');
      sqlValues.push(name);
    }

    sql += sqlSet.join(',') + ` WHERE id =  ?`;
    sqlValues.push(idUser);

    console.log(sql);
    console.log(sqlValues);

    const results = await doQuery(sql, sqlValues);
    console.log('SEGUNDO', results);

    if (!results.affectedRows) {
      throw 'No se ha actualizado el perfil';
    }
    sql =
      'SELECT name, email, userName, photo, boolFavCalendar FROM Users  WHERE id = "?"';
    const resultsUser = await doQuery(sql, idUser);
    res.send({
      OK: 1,
      message: 'Perfil actualizado',
      user: resultsUser[0],
    });
  } catch (error) {
    console.log(error);
    //no se ha podido actualizar perfil de ninguna de las dos maneras (insert o update)
    res.status(500).send({
      OK: 0,
      message: 'No se ha podido actualizar perfil',
    });
  }
};

exports.updateUserBannedCategories = async (req, res) => {
  const { idUser } = res.user;
  const bannedObj = req.body.bannedObj;

  console.log('TESTTT', res.user);

  //Para hacer el update vamos a borrar primero todo lo que hay del usuario
  const del = await delBannedCategories(idUser).catch((error) => {
    res.status(500).send({
      OK: 0,
      message: `Error al borrar categorías baneadas del usuario: ${error}`,
    });
    throw error;
  });

  //Luego añadimos el objeto entero de configuración
  const add = await saveBannedCategories(bannedObj, idUser).catch((error) => {
    res.status(500).send({
      OK: 0,
      message: `Error al añadir categorías baneadas del usuario: ${error}`,
    });
    throw error;
  });

  res.send({
    OK: 1,
    message: `Actualizadas las categorías baneadas del usuario. Borradas ${del}, Añadidas ${add}`,
  });
};
/* 
exports.saveUserBannedCategories = async (req, res) => {
    const { idUser } = res.user;
    const bannedObj = req.body.bannedObj;

    const add = await saveBannedCategories(bannedObj, idUser).catch((error) => {
      res.status(500).send({
        OK: 0,
        message: `Error al añadir categorías baneadas del usuario: ${error}`,
      });
      throw error;
    });

    res.send({
      OK: 1,
      message: `Actualizadas las categorías baneadas del usuario. Añadidas ${add}`,
    });
} */

exports.updateUserBannedIngredients = async (req, res) => {
  const bannedIngredients = req.body;
  const { idUser } = res.user;

  //Para hacer el update vamos a borrar primero todo lo que hay del usuario
  const del = await delBannedIngredients(idUser).catch((error) => {
    res.status(500).send({
      OK: 0,
      message: `Error al borrar los ingredientes baneados del usuario: ${error}`,
    });
    throw error;
  });

  //Luego añadimos el objeto entero de configuración
  const add = await saveBannedIngredients(bannedIngredients, idUser).catch(
    (error) => {
      res.status(500).send({
        OK: 0,
        message: `Error al añadir los ingredientes baneados del usuario: ${error}`,
      });
      throw error;
    },
  );

  res.send({
    OK: 1,
    message: `Actualizadas los ingredientes baneados del usuario. Borradas ${del}, Añadidas ${add}`,
  });

  //TODO Cuando sepamos como atacar a la tabla de ingredientes de DATA hay que ver como se hace este método.

  //Si podemos hacer autocompletado en front se podría hacer igual que las categorías añadiendo a la tabla el ID de ingrediente.
};

exports.addUserFav = async (req, res) => {
  const { idUser } = res.user;
  const { idRecipe } = req.body;
  console.log('ENTRANDO EN FAVORITOS!!');
  addFav(idUser, idRecipe, res);
};

exports.addUserNoFav = async (req, res) => {
  const { idUser } = res.user;
  const { idRecipe } = req.body;
  addNoFav(idUser, idRecipe, res);
};

exports.delUserFav = async (req, res) => {
  const { idUser } = res.user;
  const { idRecipe } = req.body;
  delFav(idUser, idRecipe, res);
};

exports.delUserNoFav = async (req, res) => {
  const { idUser } = res.user;
  const { idRecipe } = req.body;
  delNoFav(idUser, idRecipe, res);
};

exports.getUserFav = async (req, res) => {
  const { idUser } = res.user;
  getFavs(idUser, res);
};

exports.getUserNoFav = async (req, res) => {
  const { idUser } = res.user;
  getNoFavs(idUser, res);
};
