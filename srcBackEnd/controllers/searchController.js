const { TripleDES } = require('crypto-js');
const { doQuery } = require('../utilities/doQuery');
const {
  getBannedCategories,
  getBannedIngredients,
} = require('../utilities/profile/profile');

exports.searchPrefs = async (req, res) => {
  const defaultPreferences = {
    ingredients: [],
    bannedCategories: [
      {
        id: 3,
        category: 'meat',
        title: 'Carne',
        value: false,
      },
      {
        id: 13,
        category: 'fish',
        title: 'Pescado',
        value: false,
      },
      {
        id: 10,
        category: 'shellfish',
        title: 'Marisco',
        value: false,
      },
      {
        id: 8,
        category: 'dairyAndEggs',
        title: 'Lácteos y huevos',
        value: false,
      },
      {
        id: 17,
        category: 'vegetable',
        title: 'Verduras',
        value: false,
      },
      {
        id: 11,
        category: 'breadAndPastry',
        title: 'Pan y bollería',
        value: false,
      },
      {
        id: 0,
        category: 'noFilter',
        title: 'Saltar',
        value: false,
      },
    ],
    bannedIngredients: [],
    categories: [
      {
        id: 91,
        category: 'national',
        title: 'De aquí',
        value: false,
      },
      {
        id: 203,
        category: 'international',
        title: 'De allá',
        value: false,
      },
      {
        id: 200,
        category: 'appetizer',
        title: 'Aperitivos y tapas',
        value: false,
      },
      {
        id: 201,
        category: 'soups',
        title: 'Sopas y cremas',
        value: false,
      },
      {
        id: 202,
        category: 'salads',
        title: 'Ensaladas',
        value: false,
      },
    ],
    cost: [
      {
        id: 31,
        category: 'cheap',
        title: 'Barato',
        value: false,
      },
      {
        id: 111,
        category: 'medium',
        title: 'Medio',
        value: false,
      },
    ],
    time: [
      {
        id: 1,
        category: 15,
        title: '15 min',
        value: false,
      },
      {
        id: 2,
        category: 30,
        title: '30 min',
        value: false,
      },
      {
        id: 3,
        category: 45,
        title: '45 min',
        value: false,
      },
    ],
    daily: [
      {
        id: 1,
        category: 'breakfast',
        title: 'Desayuno',
        value: false,
      },
      {
        id: 2,
        category: 'lunch',
        title: 'Comida',
        value: false,
      },
      {
        id: 3,
        category: 'dinner',
        title: 'Cena',
        value: false,
      },
    ],
  };

  const idUser = res.user;
  console.log('USER', idUser);
  if (!idUser) {
    console.log('NO REGISTRADO');
    res.send({
      OK: 1,
      searchPreferences: defaultPreferences,
      logged: false,
    });
  } else {
    const categories = await getBannedCategories(idUser);
    const ingredients = await getBannedIngredients(idUser);

    const bannedCategories = await defaultPreferences.bannedCategories.map(
      (cat) => {
        categories.map((ban) => {
          if (ban.idCategory === cat.id) {
            cat.value = true;
          }
        });
        return cat;
      },
    );

    const bannedIngredients = ingredients
      ? ingredients.map((el) => {
          return { idIngredient: el.idIngredient, title: el.Ingrediente };
        })
      : [];

    const newPreferences = {
      ...defaultPreferences,
      bannedCategories,
      bannedIngredients,
    };
    console.log('OK', newPreferences);
    res.json({
      OK: 1,
      searchPreferences: newPreferences,
      logged: true,
    });
  }
};

exports.search = async (req, res) => {
  const {
    ingredients,
    bannedCategories,
    bannedIngredients,
    categories,
    cost,
    time,
    daily,
  } = req.body;

  console.log({
    ingredients,
    bannedCategories,
    bannedIngredients,
    categories,
    cost,
    time,
    daily,
  });

  let sql = `SELECT tp.*, tri.* FROM TablaPrincipal as tp
              INNER JOIN TablaRecetaIngredientes as tri
              ON tp.IdReceta = tri.IdReceta
              INNER JOIN TablaPreferenciasReceta as tpr      
		        	ON tpr.IdReceta=tp.IdReceta`;
  const sqlArray = [];
  sql += ' WHERE 1=1 ';

  const sqlIngredients =
    ingredients.length !== 0
      ? ' AND tri.idIngrediente IN (' +
        ingredients
          .map((el) => {
            sqlArray.push(el.idIngredient);
            return '?';
          })
          .join(',') +
        ')'
      : '';

  const sqlBannedCat =
    bannedCategories.filter((el) => el.value).length !== 0
      ? ' AND tp.IdCategoria NOT IN (' +
        bannedCategories
          .filter((el) => el.value)
          .map((el) => {
            sqlArray.push(el.id);
            return '?';
          })
          .join(',') +
        ') '
      : ' ';

  const sqlBannedIng =
    bannedIngredients.length !== 0
      ? ' AND tri.idIngrediente NOT IN (' +
        bannedIngredients
          .map((el) => {
            sqlArray.push(el.idIngredient);
            return '?';
          })
          .join(',') +
        ')'
      : '';

  const sqlCategories =
    categories.filter((el) => el.value).length !== 0
      ? ' AND tpr.IdPreferencias IN (' +
        categories
          .filter((el) => el.value)
          .map((el) => {
            sqlArray.push(el.id);
            return '?';
          })
          .join(',') +
        ')'
      : ' ';

  const sqlCost =
    cost.filter((el) => el.value).length !== 0
      ? ' AND (tpr.idPreferencias = ' +
        categories
          .filter((el) => el.value)
          .map((el) => {
            sqlArray.push(el.id);
            return '?';
          }) +
        ' OR tpr.idPreferencias NOT IN (31,111))'
      : ' ';

  let sqlTime = '';
  const timeSelection = time.filter((el) => el.value);
  if (timeSelection.length !== 0) {
    if (timeSelection[0].id == 1) sqlTime += ' AND tp.idTiempo = 1';
    if (timeSelection[0].id == 2)
      sqlTime += ' AND (tp.idTiempo = 1 OR tp.idTiempo = 2)';
    if (timeSelection[0].id == 3)
      sqlTime += ' AND (tp.idTiempo = 1 OR tp.idTiempo = 2 OR tp.idTiempo = 3)';
  }

  const sqlDaily =
    daily.filter((el) => el.value).length !== 0
      ? ' AND tp.idTipo = ' +
        daily.filter((el) => el.value)
          .map((el) => {
            sqlArray.push(el.id);
            return '?'; 
          })
      : ' ';

  sql +=
    sqlIngredients +
    sqlBannedCat +
    sqlBannedIng +
    sqlCategories +
    sqlCost +
    sqlTime +
    sqlDaily;

    console.log(sql, sqlArray);
  const result = await doQuery(sql, sqlArray);
  console.log('RESULT', result);

  res.send({
    OK:1,
    message: "Búsqueda recetas",
    recipes: result
  })
  /*
SELECT tp.* , tri.* 
FROM TablaPrincipal as tp, TablaRecetaIngredientes as tri, TablaPreferenciasReceta as tpr
WHERE tri.idIngrediente IN (1223, 1034)
 AND tp.IdCategoria NOT IN (3,10,13)
 AND tri.idIngrediente NOT IN(90,1008)
 AND tpr.IdPreferencias IN (91) #AND tpr.IdPreferencias=31
 AND tp.idTiempo IN (1,2,3)
 AND tp.IdTipo = 2
 AND tri.idReceta = tp.idReceta
 AND tpr.IdReceta = tp.idReceta;
 

  */
};
