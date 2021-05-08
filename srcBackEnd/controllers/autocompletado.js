const mysql = require('mysql');
require('dotenv').config();
const dbConnection = require('../utilities/db');
/* const dbConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'planeat',
}); */
/* 
dbConnection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }


  console.log('DB connected as id ' + dbConnection.threadId);
}); */

const doQuery = (query, values) => {
  return new Promise((resolve, reject) => {
    dbConnection.query(query, values, (error, results) => {
      if (error) return reject(error);
      return resolve(results);
    });
  });
};

exports.autocompletado = async (req, res) => {
  const { search } = req.params;

  console.log("probando",search)

  console.log(req.body);

  const sql = `SELECT * FROM TablaIngredientes WHERE ingrediente LIKE '%${search}%' `;

  const response = await doQuery(sql);

  res.send({
    response,
  });
};
