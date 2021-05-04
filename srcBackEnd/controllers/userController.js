const { doQuery } = require('../utilities/doQuery');
const SHA256 = require('crypto-js/sha256');
const {
  saveBannedCategories,
  delBannedCategories,
  addFav,
  delFav,
  getFavs,
} = require('../utilities/profile/profile');

exports.getUser = async (req, res) => {
  const user = res.user.idUser;

  try {
    let sql = 'SELECT * FROM Users  WHERE id = "?"';

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

  let sql = `UPDATE Users SET `;

  const sqlSet = [];
  const sqlValues = [];

  if (email) {
    sqlSet.push(' email = ? ');
    sqlValues.push(email);
  }

  if (pass) {
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

  try {
    const results = await doQuery(sql, sqlValues);
    console.log('SEGUNDO', results);

    if (!results.affectedRows) {
      throw 'No se ha actualizado el perfil';
    }
    res.send({
      OK: 1,
      message: 'Perfil actualizado',
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
}

exports.updateUserBannedIngredients = async (req, res) => {
  console.log('TO BE ADDED!!!!!!');
  res.send({ message: 'TO BE ADDED!!!!!!!!!!!!' });
  //TODO Cuando sepamos como atacar a la tabla de ingredientes de DATA hay que ver como se hace este método.

  //Si podemos hacer autocompletado en front se podría hacer igual que las categorías añadiendo a la tabla el ID de ingrediente.
};

exports.addUserFav = async (req, res) => {
  const { idUser } = res.user;
  const { idRecipe } = req.body;
  addFav(idUser, idRecipe, res);
};

exports.delUserFav = async (req, res) => {
  const { idUser } = res.user;
  const { idRecipe } = req.body;
  delFav(idUser, idRecipe, res);
};

exports.getUserFav = async (req, res) => {
  const { idUser } = res.user;
  getFavs(idUser, res);
};
