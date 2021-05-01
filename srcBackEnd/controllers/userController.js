const { doQuery } = require('../utilities/doQuery');
const SHA256 = require('crypto-js/sha256');

const SqlString = require('sqlstring');



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

  console.log (sql)
  console.log (sqlValues)

  //sql = SqlString.format(sql, sqlValues);


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
    console.log(error)
    //no se ha podido actualizar perfil de ninguna de las dos maneras (insert o update)
    res.status(500).send({
      OK: 0,
      message: 'No se ha podido actualizar perfil',
    });
  } 
};
