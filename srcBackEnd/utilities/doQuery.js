const dbConnection = require('./db');
const doQuery = (query, values) => {
  return new Promise((resolve, reject) => {
    dbConnection.query(query, values, (error, results) => {
      if (error) return reject(error);
      return resolve(results);
    });
  });
};

const relifeDB = async () => {
  dbConnection.ping();
  console.log("PING")
};

setInterval(() => {
  relifeDB();
}, 10000);

exports.doQuery = doQuery;
