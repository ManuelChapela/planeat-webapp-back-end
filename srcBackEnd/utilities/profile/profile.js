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
